"use client";

import { useAuth } from "@/hooks/auth";
import React from "react";
import Watchlist from "./Watchlist";

export default function User() {
  const { user } = useAuth();

  if (user) {
    return (
      <div>
        <span>{user.name}</span>

        <Watchlist user={user} />
      </div>
    );
  }
}
