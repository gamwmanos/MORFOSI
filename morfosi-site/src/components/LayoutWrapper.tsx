"use client";

import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
  header,
  footer,
  mobileBar,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  mobileBar: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <main className="flex-1 h-screen">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {mobileBar}
    </>
  );
}
