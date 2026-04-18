"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const firstMount = useRef(true);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    setVisible(false);
    const timer = window.setTimeout(() => setVisible(true), 60);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`page-transition ${
        visible ? "page-transition-visible" : "page-transition-hidden"
      }`}
    >
      {children}
    </div>
  );
}
