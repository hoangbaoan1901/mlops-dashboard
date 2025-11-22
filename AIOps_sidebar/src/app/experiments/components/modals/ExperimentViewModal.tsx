"use client";

import { MdScience, MdClose } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { getStatusColor, getStatusIcon } from "../utils";

interface ExperimentViewModalProps {
  experiment: any;
  onClose: () => void;
}

export const ExperimentViewModal: React.FC<ExperimentViewModalProps> = ({ experiment, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e0e0e0"
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>Thông tin thí nghiệm</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              fontSize: "24px",
              display: "flex",
              padding: "4px"
            }}
          >
            <MdClose />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <MdScience size={24} style={{ color: "#155dfc" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#155dfc", margin: 0 }}>{experiment.name}</h3>
            </div>

            <div style={{ marginBottom: "24px", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>ID Thí nghiệm</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{experiment.id}</div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Trạng thái</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span style={{ color: getStatusColor(experiment.status) }}>{getStatusIcon(experiment.status)}</span>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                        backgroundColor: getStatusColor(experiment.status) + "20",
                        color: getStatusColor(experiment.status)
                      }}
                    >
                      {experiment.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Độ chính xác</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{experiment.accuracy}</div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Ngày tạo</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{experiment.created}</div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Lần chạy cuối</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{experiment.lastRun}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                Thống kê hiệu suất
              </h4>
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  padding: "16px",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  border: "1px dashed #d1d5db"
                }}
              >
                Biểu đồ hiệu suất mô hình
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                Chi tiết mô hình
              </h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f9fafb" }}>
                      <th style={{ padding: "10px 16px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Tham số
                      </th>
                      <th style={{ padding: "10px 16px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Giá trị
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb", fontWeight: "500" }}>
                        Loại mô hình
                      </td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb" }}>Random Forest</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb", fontWeight: "500" }}>
                        Số lượng features
                      </td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb" }}>12</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb", fontWeight: "500" }}>
                        Hyperparameters
                      </td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb" }}>
                        n_estimators=100, max_depth=10
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#4b5563",
                fontWeight: 500
              }}
            >
              Đóng
            </button>
            <button
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
                fontWeight: 500
              }}
            >
              <FiRefreshCw size={16} />
              Chạy lại thí nghiệm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
