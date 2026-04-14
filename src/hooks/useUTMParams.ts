import { useEffect } from "react";

export function useUTMParams() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const utm: Record<string, string> = {};
    let hasUTM = false;

    utmKeys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        utm[key] = val;
        hasUTM = true;
      }
    });

    if (hasUTM) {
      sessionStorage.setItem("utm_params", JSON.stringify(utm));
    }
  }, []);
}
