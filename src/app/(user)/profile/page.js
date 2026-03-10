import axios from "axios";
import { cookies } from "next/headers";
import { TMDB_SESSION_ID } from "@/lib/constants";
import { siteConfig } from "@/config/site";
import ClientUserProfile from "@/components/User/Profile/ClientUserProfile";

export const revalidate = 0;

export async function generateMetadata() {
  const cookiesStore = cookies();

  let user = { name: "User", username: "Profile" };

  try {
    if (cookiesStore.has(TMDB_SESSION_ID)) {
      const { data } = await axios.get(`${process.env.API_URL}/account`, {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      });
      user = data;
    }
  } catch (error) {
    // Handle unauthenticated user case gracefully for metadata
  }

  return {
    title: user.name ?? user.username,
    openGraph: {
      title: user.name ?? user.username,
      url: `${siteConfig.url}/profile`,
    },
  };
}

export default function page() {
  return <ClientUserProfile />;
}

