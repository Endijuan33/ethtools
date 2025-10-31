// app/client-layout.tsx
"use client";

import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isMiniApp =
      /Warpcast/i.test(navigator.userAgent) ||
      window.location !== window.parent.location;

    if (isMiniApp) {
      document.documentElement.classList.add("farcaster-miniapp");
      document.body.style.overflow = "hidden";
      document.documentElement.style.height = "695px";

      import("@farcaster/miniapp-sdk")
        .then(({ sdk }) => {
          sdk.actions.ready();
          sdk.getCapabilities().then((caps) => {
            if (caps.includes("haptics.impactOccurred")) {
              sdk.haptics.impactOccurred("light");
            }
          });
          (window as any).farcasterSDK = sdk;
        })
        .catch((err) => console.warn("SDK load failed:", err));
    }

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.className = "farcaster-miniapp-close";
    closeBtn.onclick = () => {
      const sdk = (window as any).farcasterSDK;
      if (sdk?.actions?.close) {
        sdk.actions.close();
      } else {
        window.postMessage({ type: "farcaster:close" }, "*");
      }
    };

    if (isMiniApp) document.body.appendChild(closeBtn);

    return () => {
      if (closeBtn.parentNode) closeBtn.parentNode.removeChild(closeBtn);
    };
  }, []);

  return <>{children}</>;
}
