"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Bell, LayoutDashboard, LogOut, Play, User } from "lucide-react";
import { clearStoredSession } from "@/lib/supabaseAuth";
import { PageTransition } from "@/components/dashboard/PageTransition";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/activate-mission", label: "Activate Mission", icon: Play },
  { href: "/dashboard/volunteer-summary", label: "Volunteer Summary", icon: Activity },
];

export function DashboardLayout({ children, userEmail }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const middleText =
    NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Site Manager Dashboard";

  function handleSignOut() {
    clearStoredSession();
    router.push("/");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <header
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 40px",
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.02)",
        }}
      >
        <div
          style={{
            maxWidth: "1800px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <img
                src="/logo_b.png"
                alt="BayaniHub Logo"
                style={{ width: "36px", height: "36px", objectFit: "contain" }}
              />
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#5C6ED5", letterSpacing: "-0.02em" }}>
                BayaniHub
              </span>
            </div>
          </Link>

          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "18px",
              fontWeight: 600,
              color: "#374151",
              whiteSpace: "nowrap",
            }}
          >
            {middleText}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {userEmail && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "rgba(92, 110, 213, 0.08)",
                  color: "#3E5A99",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {userEmail}
              </div>
            )}
            <button className="dashboard-icon-btn" type="button">
              <Bell size={18} />
            </button>
            <button className="dashboard-icon-btn" type="button">
              <User size={18} />
            </button>
            <button className="dashboard-icon-btn" type="button" onClick={handleSignOut}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <nav
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 40px",
          width: "100%",
          position: "sticky",
          top: "61px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1800px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            overflowX: "auto",
          }}
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link key={href} href={href} style={{ textDecoration: "none", flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#5C6ED5" : "#6b7280",
                    borderBottom: isActive ? "2px solid #5C6ED5" : "2px solid transparent",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <main style={{ padding: "32px 40px", width: "100%" }}>
        <div style={{ maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
