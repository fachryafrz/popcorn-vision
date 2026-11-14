import { use } from "react";
import UserProfileClient from "@/components/profile/user-profile-client";

interface PageProps {
  params: Promise<{ username: string }>;
}

export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export default function UserProfilePage({ params }: PageProps) {
  const { username } = use(params);
  return <UserProfileClient username={username} />;
}
