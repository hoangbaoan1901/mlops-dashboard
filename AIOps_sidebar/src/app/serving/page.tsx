"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiGlobe, FiBarChart2, FiPlay, FiSquare } from "react-icons/fi";
import { MdRocketLaunch, MdCircle } from "react-icons/md";
import { CreateEndpointModal, MonitorModal, ApiDocsTab, LogsTab } from "./components";

export default function ServingPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("endpoints");
  const router = useRouter();

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [monitorModalVisible, setMonitorModalVisible] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);

  const endpoints = [
    {
      id: "endpoint_001",
      name: "customer-segmentation-api",
      model: "Customer Segmentation RF v1.2.3",
      status: "Running",
      url: "https://api.databricks.com/serving/customer-seg",
      requests: "1.2K",
      latency: "45ms",
      created: "2024-01-15"
    },
    {
      id: "endpoint_002",
      name: "sales-forecast-api",
      model: "Sales Forecasting LSTM v2.1.0",
      status: "Stopped",
      url: "https://api.databricks.com/serving/sales-forecast",
      requests: "856",
      latency: "120ms",
      created: "2024-01-14"
    },
    {
      id: "endpoint_003",
      name: "churn-prediction-api",
      model: "Churn Prediction XGBoost v1.0.1",
      status: "Starting",
      url: "https://api.databricks.com/serving/churn-pred",
      requests: "0",
      latency: "-",
      created: "2024-01-13"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "#10b981";
      case "Stopped":
        return "#ef4444";
      case "Starting":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <MdCircle className="text-emerald-500" />;
      case "Stopped":
        return <MdCircle className="text-red-500" />;
      case "Starting":
        return <MdCircle className="text-amber-500" />;
      default:
        return <MdCircle className="text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 h-full">
      <div className="px-6 py-6">
        {/* Modal Components */}
        <CreateEndpointModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onCreate={(values) => {
            console.log("Create endpoint:", values);
            setCreateModalVisible(false);
          }}
        />

        <MonitorModal
          visible={monitorModalVisible}
          onCancel={() => setMonitorModalVisible(false)}
          endpoint={selectedEndpoint}
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Model Serving</h1>
            <p className="text-gray-500">Quản lý API endpoints và triển khai mô hình</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              onClick={() => {
                setSelectedEndpoint(null);
                setMonitorModalVisible(true);
              }}
            >
              <FiBarChart2 size={16} />
              <span>Theo dõi</span>
            </button>
            <button
              className="px-4 py-2.5 bg-primary rounded-xl text-sm font-medium text-white flex items-center gap-2 hover:bg-blue-600 transition-all shadow-sm"
              onClick={() => setCreateModalVisible(true)}
            >
              <MdRocketLaunch size={16} />
              <span>Tạo endpoint mới</span>
            </button>
          </div>
        </div>

        {/* Filter and tabs */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-2">
            <div
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all
                ${activeTab === "endpoints" ? "bg-blue-50 text-blue-700 " : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("endpoints")}
            >
              Endpoints
            </div>
            <div
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all
                ${activeTab === "docs" ? "bg-blue-50 text-blue-700 " : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("docs")}
            >
              API Docs
            </div>
            <div
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all
                ${activeTab === "logs" ? "bg-blue-50 text-blue-700 " : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("logs")}
            >
              Logs
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm endpoints"
              className="w-full sm:w-64 pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="m14 14 4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Endpoints List */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô hình
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yêu cầu
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ trễ
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {endpoints.map((endpoint) => (
                <tr key={endpoint.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                        <FiGlobe size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{endpoint.name}</div>
                        <div className="text-xs text-gray-500">ID: {endpoint.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{endpoint.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(endpoint.status)}
                      <span
                        className="ml-1.5 px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{
                          backgroundColor: `${getStatusColor(endpoint.status)}15`,
                          color: getStatusColor(endpoint.status)
                        }}
                      >
                        {endpoint.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary font-mono">{endpoint.url}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{endpoint.requests}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{endpoint.latency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {endpoint.status === "Running" ? (
                        <button className="p-1 text-red-500 hover:text-red-700" title="Stop">
                          <FiSquare size={18} />
                        </button>
                      ) : (
                        <button className="p-1 text-green-500 hover:text-green-700" title="Start">
                          <FiPlay size={18} />
                        </button>
                      )}
                      <button
                        className="p-1 text-blue-500 hover:text-blue-700"
                        title="View Details"
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setMonitorModalVisible(true);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm-9 5.5c0 5 4 9 9 9s9-4 9-9-4-9-9-9-9 4-9 9zm8.5 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0zm1.5-2a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Tab Content */}
        {activeTab === "endpoints" ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô hình
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yêu cầu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ trễ
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {endpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                          <FiGlobe size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{endpoint.name}</div>
                          <div className="text-xs text-gray-500">ID: {endpoint.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{endpoint.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(endpoint.status)}
                        <span
                          className="ml-1.5 px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={{
                            backgroundColor: `${getStatusColor(endpoint.status)}15`,
                            color: getStatusColor(endpoint.status)
                          }}
                        >
                          {endpoint.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary font-mono">{endpoint.url}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{endpoint.requests}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{endpoint.latency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center space-x-2">
                        {endpoint.status === "Running" ? (
                          <button className="p-1 text-red-500 hover:text-red-700" title="Stop">
                            <FiSquare size={18} />
                          </button>
                        ) : (
                          <button className="p-1 text-green-500 hover:text-green-700" title="Start">
                            <FiPlay size={18} />
                          </button>
                        )}
                        <button
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="View Details"
                          onClick={() => {
                            setSelectedEndpoint(endpoint);
                            setMonitorModalVisible(true);
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm-9 5.5c0 5 4 9 9 9s9-4 9-9-4-9-9-9-9 4-9 9zm8.5 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0zm1.5-2a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "docs" ? (
          <ApiDocsTab endpoints={endpoints} />
        ) : (
          <LogsTab endpoints={endpoints} />
        )}
      </div>
    </div>
  );
}
