import React from "react";
import { useEffect } from "react";

export default function AdComponent() {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8786419463530575"
      data-ad-slot="5468371254"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
