"use client";

import { MdClose } from "react-icons/md";

interface CreateExperimentModalProps {
  onClose: () => void;
  onCreate: () => void;
}

export const CreateExperimentModal: React.FC<CreateExperimentModalProps> = ({ onClose, onCreate }) => {
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
          maxWidth: "600px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e0e0e0"
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>Tạo thí nghiệm mới</h2>
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

        <div style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Tên thí nghiệm
            </label>
            <input
              type="text"
              placeholder="Nhập tên thí nghiệm"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Chọn nguồn dữ liệu
            </label>
            <select
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                appearance: "none",
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center"
              }}
            >
              <option value="">Chọn dataset</option>
              <option value="dataset1">Customer Data - 2024</option>
              <option value="dataset2">Sales Performance - Q1 2024</option>
              <option value="dataset3">User Behavior Analysis</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Loại mô hình
            </label>
            <select
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                appearance: "none",
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center"
              }}
            >
              <option value="">Chọn loại mô hình</option>
              <option value="classification">Phân loại (Classification)</option>
              <option value="regression">Hồi quy (Regression)</option>
              <option value="clustering">Phân cụm (Clustering)</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Thuật toán
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {["Random Forest", "XGBoost", "Linear Regression", "SVM", "Neural Network"].map((alg) => (
                <div
                  key={alg}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f9fafb",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  {alg}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Tỷ lệ chia dữ liệu
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
                  Training (%)
                </label>
                <input
                  type="number"
                  defaultValue="70"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
                  Validation (%)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
                  Testing (%)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#4b5563",
              fontWeight: 500
            }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => {
              onClose();
              onCreate();
            }}
            style={{
              padding: "10px 16px",
              backgroundColor: "#155dfc",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500
            }}
          >
            Tạo thí nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
