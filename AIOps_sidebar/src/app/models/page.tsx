"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiHome, FiMenu, FiX, FiUser, FiLogOut, FiEye, FiUpload } from "react-icons/fi";
import { MdScience, MdModelTraining, MdStorage, MdCloud, MdRocketLaunch, MdMemory } from "react-icons/md";
import { SiTensorflow, SiScikitlearn } from "react-icons/si";
import { 
  ImportModelModal, 
  CreateModelModal, 
  ViewModelModal, 
  DeployModelModal 
} from "./components/modals";

export default function ModelsPage() {
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("models");
  const router = useRouter();
  
  // Modal states
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deployModalVisible, setDeployModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);

  const models = [
    {
      id: "model_001",
      name: "Customer Segmentation RF",
      version: "v1.2.3",
      status: "Production",
      accuracy: "94.2%",
      created: "2024-01-15",
      lastUpdated: "2 giờ trước",
      framework: "Scikit-learn"
    },
    {
      id: "model_002",
      name: "Sales Forecasting LSTM",
      version: "v2.1.0",
      status: "Staging",
      accuracy: "87.5%",
      created: "2024-01-14",
      lastUpdated: "1 ngày trước",
      framework: "TensorFlow"
    },
    {
      id: "model_003",
      name: "Churn Prediction XGBoost",
      version: "v1.0.1",
      status: "Development",
      accuracy: "82.1%",
      created: "2024-01-13",
      lastUpdated: "3 ngày trước",
      framework: "XGBoost"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Production":
        return "#10b981";
      case "Staging":
        return "#f59e0b";
      case "Development":
        return "#3b82f6";
      default:
        return "#64748b";
    }
  };

  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case "Scikit-learn":
        return <SiScikitlearn />;
      case "TensorFlow":
        return <SiTensorflow />;
      case "XGBoost":
        return <MdMemory />;
      default:
        return <MdModelTraining />;
    }
  };

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
        <div style={{ flex: 1, backgroundColor: "#f5f5f5", padding: "24px" }}>
          {/* Modal Components */}
          <ImportModelModal 
            visible={importModalVisible} 
            onCancel={() => setImportModalVisible(false)} 
            onImport={(values) => {
              console.log('Import model:', values);
              setImportModalVisible(false);
            }} 
          />
          
          <CreateModelModal 
            visible={createModalVisible} 
            onCancel={() => setCreateModalVisible(false)} 
            onCreate={(values) => {
              console.log('Create model:', values);
              setCreateModalVisible(false);
            }} 
          />
          
          <ViewModelModal 
            visible={viewModalVisible} 
            onCancel={() => setViewModalVisible(false)} 
            model={selectedModel} 
          />
          
          <DeployModelModal 
            visible={deployModalVisible} 
            onCancel={() => setDeployModalVisible(false)} 
            onDeploy={(values) => {
              console.log('Deploy model:', values);
              setDeployModalVisible(false);
            }} 
            model={selectedModel} 
          />
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}
            >
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333333", margin: 0 }}>Mô hình</h1>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setImportModalVisible(true)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <FiUpload />
                  Import mô hình
                </button>
                <button
                  onClick={() => setCreateModalVisible(true)}
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
                    gap: "4px"
                  }}
                >
                  <MdModelTraining />
                  Tạo mô hình mới
                </button>
              </div>
            </div>
          </div>

          {/* Models List */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "24px"
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "#333333" }}>
              Danh sách mô hình
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Tên mô hình
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>Phiên bản</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Trạng thái
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Độ chính xác
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>Framework</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>
                    Cập nhật cuối
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#333333" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "16px" }}>
                          <MdModelTraining />
                        </span>
                        <span className="text-primary font-medium">{model.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px", color: "#333333", fontFamily: "monospace" }}>{model.version}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: getStatusColor(model.status) + "20",
                          color: getStatusColor(model.status)
                        }}
                      >
                        {model.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#333333", fontWeight: "500" }}>{model.accuracy}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#666666" }}>{getFrameworkIcon(model.framework)}</span>
                        <span style={{ color: "#333333", fontSize: "14px" }}>{model.framework}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px", color: "#666666" }}>{model.lastUpdated}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => {
                            setSelectedModel(model);
                            setViewModalVisible(true);
                          }}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <FiEye />
                          Xem
                        </button>
                        <button
                          onClick={() => {
                            setSelectedModel(model);
                            setDeployModalVisible(true);
                          }}
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
                            gap: "4px"
                          }}
                        >
                          <MdRocketLaunch />
                          Deploy
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
    </div>
  );
}
