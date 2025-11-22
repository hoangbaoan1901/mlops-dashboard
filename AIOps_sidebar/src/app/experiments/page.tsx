"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEye, FiRefreshCw } from "react-icons/fi";
import { MdAdd, MdAutoFixHigh, MdScience } from "react-icons/md";
import { AutoMLModal, CreateExperimentModal, ExperimentViewModal } from "./components/modals";
import { getStatusColor, getStatusIcon } from "./components/utils";

export default function ExperimentsPage() {
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("experiments");
  const [showExperimentModal, setShowExperimentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoMLModal, setShowAutoMLModal] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);
  const router = useRouter();

  const experiments = [
    {
      id: "exp_001",
      name: "Customer Segmentation Model",
      status: "Completed",
      accuracy: "94.2%",
      created: "2024-01-15",
      lastRun: "2 giờ trước"
    },
    {
      id: "exp_002",
      name: "Sales Prediction Analysis",
      status: "Running",
      accuracy: "87.5%",
      created: "2024-01-14",
      lastRun: "30 phút trước"
    },
    {
      id: "exp_003",
      name: "Churn Prediction Model",
      status: "Failed",
      accuracy: "82.1%",
      created: "2024-01-13",
      lastRun: "1 ngày trước"
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  // Status functions have been moved to ./components/utils.tsx

  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Content */}
        <div style={{ flex: 1, backgroundColor: "#f9fafb", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}
            >
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333333", margin: 0 }}>Thí nghiệm</h1>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f0f7ff",
                    border: "1px solid #d0e3ff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "#155dfc",
                    fontWeight: 500,
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#e0edff";
                    e.currentTarget.style.borderColor = "#93c5fd";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f7ff";
                    e.currentTarget.style.borderColor = "#d0e3ff";
                  }}
                >
                  <MdAdd size={18} />
                  Tạo thí nghiệm
                </button>
                <button
                  onClick={() => setShowAutoMLModal(true)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#155dfc",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: 500,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e40af";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#155dfc";
                    e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
                  }}
                >
                  <MdAutoFixHigh size={18} />
                  Chạy AutoML
                </button>
              </div>
            </div>
          </div>

          {/* Experiments List */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "24px"
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "#333333" }}>
              Danh sách thí nghiệm
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Tên thí nghiệm
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Trạng thái
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Độ chính xác
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>Ngày tạo</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Lần chạy cuối
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {experiments.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "16px" }}>
                          <MdScience />
                        </span>
                        <span style={{ fontWeight: "500", color: "#155dfc" }}>{exp.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: getStatusColor(exp.status) }}>{getStatusIcon(exp.status)}</span>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: getStatusColor(exp.status) + "20",
                            color: getStatusColor(exp.status)
                          }}
                        >
                          {exp.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px", color: "#333333", fontWeight: "500" }}>{exp.accuracy}</td>
                    <td style={{ padding: "12px", color: "#333333" }}>{exp.created}</td>
                    <td style={{ padding: "12px", color: "#666666" }}>{exp.lastRun}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => {
                            setSelectedExperiment(exp);
                            setShowExperimentModal(true);
                          }}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#f0f7ff",
                            border: "1px solid #d0e3ff",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#155dfc",
                            transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#e0edff";
                            e.currentTarget.style.borderColor = "#93c5fd";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f7ff";
                            e.currentTarget.style.borderColor = "#d0e3ff";
                          }}
                        >
                          <FiEye />
                          Xem
                        </button>
                        <button
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#155dfc",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#1e40af";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#155dfc";
                          }}
                        >
                          <FiRefreshCw />
                          Chạy lại
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Experiment View Modal */}
      {showExperimentModal && selectedExperiment && (
        <ExperimentViewModal experiment={selectedExperiment} onClose={() => setShowExperimentModal(false)} />
      )}

      {/* Create Experiment Modal */}
      {showCreateModal && (
        <CreateExperimentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => {
            // Xử lý logic tạo thí nghiệm ở đây
          }}
        />
      )}

      {/* AutoML Modal */}
      {showAutoMLModal && (
        <AutoMLModal
          onClose={() => setShowAutoMLModal(false)}
          onStartAutoML={() => {
            // Xử lý logic chạy AutoML ở đây
          }}
        />
      )}
    </div>
  );
}
