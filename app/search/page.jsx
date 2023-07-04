import React from "react";
import Search from "./Search";

export default function page({ searchParams }) {
  return <Search query={searchParams} />;
}
