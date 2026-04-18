"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Play,
  Radio,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getStoredSession, type StoredSession } from "@/lib/supabaseAuth";
import { useRouter } from "next/navigation";

type SummaryData = {
  total: number;
  active: number;
  onMission: number;
  standby: number;
  completed: number;
};

const RECENT_ACTIVITY = [
  { name: "Marco Arante", action: "Assigned to North Logistics corridor", time: "6 min ago" },
  { name: "Admin Team", action: "Mission readiness check completed", time: "12 min ago" },
  { name: "Field Ops Unit", action: "Updated evacuation checkpoint map", time: "21 min ago" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const stored = getStoredSession();

    if (!stored?.accessToken) {
      router.replace("/");
      return;
    }

    setSession(stored);
    setLastUpdated(new Date());
  }, [router]);

  const summaryData = useMemo<SummaryData>(() => {
    const isAdmin = session?.email?.toLowerCase().includes("admin");

    return {
      total: isAdmin ? 147 : 124,
      active: isAdmin ? 38 : 27,
      onMission: isAdmin ? 19 : 14,
      standby: isAdmin ? 71 : 63,
      completed: isAdmin ? 19 : 20,
    };
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout userEmail={session.email}>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: "16px",
              letterSpacing: "-0.01em",
            }}
          >
            Mission Control
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              width: "100%",
            }}
          >
            <div className="dashboard-card" style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Radio size={16} color="#5C6ED5" />
                  Start New Mission
                </h3>
                <div className="dashboard-pill">
                  <span className="dashboard-live-dot" />
                  <span>Ready</span>
                </div>
              </div>

              <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px", flex: 1 }}>
                Activate a new volunteer mission session and begin coordinating field operations.
              </p>

              <Link href="/dashboard/activate-mission" style={{ width: "100%", textDecoration: "none" }}>
                <button className="dashboard-primary-btn" type="button">
                  <Play size={14} />
                  Activate Mission Session
                </button>
              </Link>
            </div>

            <div className="dashboard-card" style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Activity size={16} color="#5C6ED5" />
                  Real-time Monitoring
                </h3>
                <div className="dashboard-pill">
                  <span className="dashboard-live-dot dashboard-live-dot--pulse" />
                  <span>Live</span>
                </div>
              </div>

              <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px", flex: 1 }}>
                Monitor active volunteers, track mission progress, and view live status updates.
              </p>

              <Link href="/dashboard/volunteer-summary" style={{ width: "100%", textDecoration: "none" }}>
                <button className="dashboard-secondary-btn" type="button">
                  <Activity size={14} />
                  View Live Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginBottom: "14px",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Users size={18} color="#5C6ED5" />
            Volunteer Summary
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              width: "100%",
              marginBottom: "8px",
            }}
          >
            {[
              { label: "Total", value: summaryData.total, icon: <UserPlus size={18} color="#5C6ED5" /> },
              { label: "Active", value: summaryData.active, icon: <UserCheck size={18} color="#5C6ED5" /> },
              { label: "On Mission", value: summaryData.onMission, icon: <MapPin size={18} color="#5C6ED5" /> },
              { label: "Standby", value: summaryData.standby, icon: <UserMinus size={18} color="#5C6ED5" /> },
            ].map((item) => (
              <div key={item.label} className="dashboard-card" style={{ padding: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="dashboard-stat-icon">{item.icon}</div>
                <div>
                  <div className="dashboard-stat-label">{item.label}</div>
                  <div className="dashboard-stat-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "11px", color: "#9ca3af", textAlign: "right", paddingRight: "4px" }}>
            Last updated{" "}
            <span style={{ fontWeight: 600, color: "#6b7280" }}>
              {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
            </span>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "14px", color: "#1f2937" }}>
            Recent Activity
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {RECENT_ACTIVITY.map((item, index) => (
              <div
                key={`${item.name}-${item.time}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: index < RECENT_ACTIVITY.length - 1 ? "1px solid #f3f4f6" : "none",
                  paddingBottom: index < RECENT_ACTIVITY.length - 1 ? "10px" : 0,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937", marginBottom: "2px" }}>{item.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{item.action}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={11} color="#d1d5db" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%" }}>
          <div className="dashboard-card" style={{ padding: "18px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "14px", color: "#1f2937" }}>
              Mission Status
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {[
                { label: "Active", value: summaryData.active },
                { label: "Completed", value: summaryData.completed },
                { label: "Pending", value: summaryData.standby },
              ].map((item) => (
                <div key={item.label}>
                  <div className="dashboard-mini-label">{item.label}</div>
                  <div className="dashboard-mini-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: "18px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "14px", color: "#1f2937" }}>
              System Status
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {[
                { label: "GPS", icon: <CheckCircle size={12} color="#22c55e" />, text: "Online", color: "#22c55e" },
                { label: "Comm", icon: <Radio size={12} color="#5C6ED5" />, text: "Active", color: "#5C6ED5" },
                { label: "Alert", icon: <AlertCircle size={12} color="#22c55e" />, text: "Ready", color: "#22c55e" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="dashboard-mini-label">{item.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: item.color }}>
                    {item.icon}
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
