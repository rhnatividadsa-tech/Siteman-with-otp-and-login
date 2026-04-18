"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  Filter,
  HeartPulse,
  MapPin,
  Search,
  Truck,
  Users,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getStoredSession, type StoredSession } from "@/lib/supabaseAuth";
import { useRouter } from "next/navigation";

type Volunteer = {
  id: string;
  name: string;
  initials: string;
  team: string;
  location: string;
  status: "Active" | "Standby" | "Completed";
};

const VOLUNTEERS: Volunteer[] = [
  { id: "VH-1024", name: "Marco Arante", initials: "MA", team: "Logistics", location: "North District", status: "Active" },
  { id: "VH-1031", name: "Ana Reyes", initials: "AR", team: "Medic Team", location: "Central Hub", status: "Standby" },
  { id: "VH-1048", name: "Luis Gomez", initials: "LG", team: "Field Ops", location: "East Sector", status: "Active" },
  { id: "VH-1055", name: "Rina Cruz", initials: "RC", team: "Medic Team", location: "West Shelter", status: "Completed" },
];

export default function VolunteerSummaryPage() {
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("All");

  useEffect(() => {
    const stored = getStoredSession();

    if (!stored?.accessToken) {
      router.replace("/");
      return;
    }

    setSession(stored);
  }, [router]);

  const filteredVolunteers = useMemo(() => {
    return VOLUNTEERS.filter((volunteer) => {
      const matchesSearch =
        !searchTerm ||
        volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = selectedTeam === "All" || volunteer.team === selectedTeam;
      return matchesSearch && matchesTeam;
    });
  }, [searchTerm, selectedTeam]);

  if (!session) return null;

  return (
    <DashboardLayout userEmail={session.email}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", maxWidth: "1800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", marginBottom: "4px" }}>
          <div>
            <h1 style={{ fontSize: "35px", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={32} color="#5C6ED5" />
              Volunteer Command
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>
              Live summary view adapted from the dashboard repository.
            </p>
          </div>

          <div className="dashboard-pill">
            <span className="dashboard-live-dot dashboard-live-dot--pulse" />
            <span>Live</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", width: "100%" }}>
          {[
            { label: "Total Active", value: "147", icon: <Users size={20} color="#5C6ED5" /> },
            { label: "Medic Team", value: "42", icon: <HeartPulse size={20} color="#5C6ED5" /> },
            { label: "Logistics", value: "33", icon: <Truck size={20} color="#F59E0B" /> },
            { label: "Field Ops", value: "29", icon: <MapPin size={20} color="#10B981" /> },
          ].map((item) => (
            <div key={item.label} className="dashboard-card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="dashboard-stat-icon">{item.icon}</div>
              <div>
                <div className="dashboard-stat-label">{item.label}</div>
                <div className="dashboard-stat-value">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center", marginBottom: "18px", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>Volunteer Directory</h2>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Search volunteer"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  style={{ paddingLeft: "34px", minWidth: "240px" }}
                />
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Filter size={14} color="#6B7280" style={{ position: "absolute", left: "12px" }} />
                <select
                  className="input-field"
                  value={selectedTeam}
                  onChange={(event) => setSelectedTeam(event.target.value)}
                  style={{ paddingLeft: "34px", minWidth: "180px" }}
                >
                  <option>All</option>
                  <option>Medic Team</option>
                  <option>Logistics</option>
                  <option>Field Ops</option>
                </select>
              </div>
            </div>
          </div>

          {(searchTerm || selectedTeam !== "All") && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {searchTerm && (
                <span className="dashboard-filter-chip">
                  Search: {searchTerm}
                  <button type="button" onClick={() => setSearchTerm("")}>
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedTeam !== "All" && (
                <span className="dashboard-filter-chip">
                  Team: {selectedTeam}
                  <button type="button" onClick={() => setSelectedTeam("All")}>
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 700, fontSize: "13px", textTransform: "uppercase" }}>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Volunteer</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Team</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Location</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "12px 8px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((volunteer, index) => (
                  <tr key={volunteer.id} style={{ borderBottom: index < filteredVolunteers.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #5C6ED5 0%, #3E5A99 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "15px", fontWeight: 700 }}>
                          {volunteer.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827", marginBottom: "4px" }}>{volunteer.name}</div>
                          <div style={{ fontSize: "12px", color: "#6B7280" }}>ID: {volunteer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span className="dashboard-team-badge">{volunteer.team}</span>
                    </td>
                    <td style={{ padding: "16px 8px", color: "#374151", fontWeight: 600 }}>{volunteer.location}</td>
                    <td style={{ padding: "16px 8px" }}>
                      <span className={`dashboard-status dashboard-status--${volunteer.status.toLowerCase()}`}>{volunteer.status}</span>
                    </td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}>
                      <button className="dashboard-table-action" type="button">
                        <Check size={14} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
