"use client";

import { useEffect, useState } from "react";
import { AlertCircle, MapPin, Play, Radio, Target, Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getStoredSession, type StoredSession } from "@/lib/supabaseAuth";
import { useRouter } from "next/navigation";

export default function ActivateMissionPage() {
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [urgency, setUrgency] = useState("high");
  const [volunteersNeeded, setVolunteersNeeded] = useState(8);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = getStoredSession();

    if (!stored?.accessToken) {
      router.replace("/");
      return;
    }

    setSession(stored);
  }, [router]);

  if (!session) return null;

  const urgencyOptions = [
    { id: "critical", label: "Critical", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
    { id: "high", label: "High", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
    { id: "medium", label: "Medium", color: "#5C6ED5", bg: "rgba(92, 110, 213, 0.1)" },
    { id: "low", label: "Low", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
  ];

  return (
    <DashboardLayout userEmail={session.email}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", maxWidth: "1800px", margin: "0 auto" }}>
        <div className="dashboard-hero">
          <div className="dashboard-hero__content">
            <h1 style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.15, marginBottom: "14px", letterSpacing: "-0.02em" }}>
              Activate Your Mission Now
            </h1>
            <p style={{ fontSize: "17px", lineHeight: 1.6, opacity: 0.92, maxWidth: "760px", marginBottom: "26px" }}>
              Command real-time disaster response from a single interface. Coordinate teams,
              allocate resources, and launch field operations as soon as a verified site manager signs in.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button className="dashboard-primary-btn" type="button">
                <Play size={18} />
                Activate Now
              </button>
              <button className="dashboard-ghost-btn" type="button">
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[
            { label: "Available Volunteers", value: "147" },
            { label: "Active Missions", value: "12" },
            { label: "Teams on Standby", value: "9" },
            { label: "Equipment Ready", value: "34" },
          ].map((item) => (
            <div key={item.label} className="dashboard-card" style={{ padding: "22px", textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: "34px", fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="dashboard-card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Target size={20} color="#5C6ED5" />
                Select Mission Role
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {["Medic Team", "Logistics Team", "Field Team"].map((role) => (
                  <button key={role} className="dashboard-role-card" type="button">
                    <div style={{ width: "42px", height: "42px", borderRadius: "999px", background: "rgba(92,110,213,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Target size={18} color="#5C6ED5" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "14px", lineHeight: 1.3 }}>{role}</span>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>Ready for deployment</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="dashboard-card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={20} color="#5C6ED5" />
                Mission Details
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <input className="input-field" type="text" placeholder="Mission name" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <input className="input-field" type="text" placeholder="Location" />
                  <input className="input-field" type="text" placeholder="Zone" />
                </div>
                <textarea className="input-field" placeholder="Mission description" rows={4} style={{ resize: "vertical" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <input className="input-field" type="datetime-local" />
                  <select className="input-field">
                    <option>2 hours</option>
                    <option>4 hours</option>
                    <option>8 hours</option>
                    <option>12 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="dashboard-card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={20} color="#5C6ED5" />
                Urgency Level
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {urgencyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setUrgency(option.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 18px",
                      backgroundColor: urgency === option.id ? option.bg : "#F9FAFB",
                      border: urgency === option.id ? `1px solid ${option.color}` : "1px solid #E5E7EB",
                      borderRadius: "10px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: option.color }} />
                      <span style={{ fontSize: "16px", fontWeight: urgency === option.id ? 700 : 600, color: urgency === option.id ? option.color : "#374151" }}>
                        {option.label}
                      </span>
                    </div>
                    {urgency === option.id && <span style={{ color: option.color, fontSize: "13px", fontWeight: 700 }}>Selected</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="dashboard-card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={20} color="#5C6ED5" />
                Resource Allocation
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>Volunteers Needed</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{volunteersNeeded}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={volunteersNeeded}
                    onChange={(event) => setVolunteersNeeded(Number(event.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "10px" }}>
                    <Radio size={14} color="#5C6ED5" style={{ marginRight: "6px" }} />
                    Communication Channel
                  </label>
                  <select className="input-field">
                    <option>Channel 1 (Primary)</option>
                    <option>Channel 2 (Secondary)</option>
                    <option>Channel 3 (Emergency)</option>
                  </select>
                </div>
              </div>
            </div>

            {submitted && (
              <div className="status-card status-card--success">
                Mission draft prepared. You can connect this page to your mission API next.
              </div>
            )}

            <button className="dashboard-primary-btn" type="button" onClick={() => setSubmitted(true)}>
              <Play size={18} />
              Activate Mission
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
