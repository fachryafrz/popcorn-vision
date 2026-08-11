"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(isLoggedIn: boolean) {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDeviceEndpoint, setCurrentDeviceEndpoint] = useState<string | null>(null);

  const saveSubscription = useMutation(api.push.savePushSubscription);
  const deleteSubscription = useMutation(api.push.deletePushSubscription);
  const userSubscriptions = useQuery(
    api.push.getUserSubscriptions,
    isLoggedIn ? {} : "skip"
  );

  const isSubscribed = Boolean(
    currentDeviceEndpoint &&
    userSubscriptions?.some((sub) => sub.subscription.endpoint === currentDeviceEndpoint)
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      const handleMount = async () => {
        setIsSupported(true);
        setPermission(Notification.permission);

        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            setCurrentDeviceEndpoint(subscription.endpoint);
            localStorage.setItem("push_subscription_endpoint", subscription.endpoint);
          } else {
            const stored = localStorage.getItem("push_subscription_endpoint");
            if (stored) {
              setCurrentDeviceEndpoint(stored);
            }
          }
        } catch (err) {
          console.error("Error checking push subscription on mount:", err);
          const stored = localStorage.getItem("push_subscription_endpoint");
          if (stored) {
            setCurrentDeviceEndpoint(stored);
          }
        }
      };
      handleMount();
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported by your browser");
      return false;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.warn("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not defined in environment variables");
      toast.error("Web Push is not properly configured on server");
      return false;
    }

    try {
      setIsLoading(true);

      const permResult = await Notification.requestPermission();
      setPermission(permResult);

      if (permResult !== "granted") {
        toast.error("Notification permission was denied");
        return false;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey.buffer as ArrayBuffer,
        });
      }

      const subJson = subscription.toJSON();
      if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
        throw new Error("Invalid push subscription format");
      }

      await saveSubscription({
        subscription: {
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys.p256dh,
            auth: subJson.keys.auth,
          },
        },
        userAgent: navigator.userAgent,
      });

      localStorage.setItem("push_subscription_endpoint", subJson.endpoint);
      setCurrentDeviceEndpoint(subJson.endpoint);

      toast.success("Push notifications enabled!");
      return true;
    } catch (err: unknown) {
      console.error("Failed to subscribe to push notifications:", err);
      toast.error("Failed to enable push notifications");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, saveSubscription]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return false;

    try {
      setIsLoading(true);
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await deleteSubscription({ endpoint: subscription.endpoint });
      } else if (currentDeviceEndpoint) {
        await deleteSubscription({ endpoint: currentDeviceEndpoint });
      } else {
        await deleteSubscription({});
      }

      localStorage.removeItem("push_subscription_endpoint");
      setCurrentDeviceEndpoint(null);

      toast.success("Push notifications disabled");
      return true;
    } catch (err: unknown) {
      console.error("Failed to unsubscribe from push notifications:", err);
      toast.error("Failed to disable push notifications");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, currentDeviceEndpoint, deleteSubscription]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
