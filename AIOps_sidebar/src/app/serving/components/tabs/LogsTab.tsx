"use client";

import { Table, Card, Input, Select, DatePicker, Button, Tag, Tooltip, Radio } from "antd";
import { useState } from "react";
import { MdWarning, MdError, MdInfo, MdRefresh, MdDownload } from "react-icons/md";
import { FiFilter, FiSearch } from "react-icons/fi";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface LogsTabProps {
  endpoints: any[];
}

const LogsTab = ({ endpoints }: LogsTabProps) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  // Sample log data
  const logs = [
    {
      id: "log_001",
      timestamp: "2025-09-10T08:23:45",
      endpoint: "endpoint_001",
      endpointName: "customer-segmentation-api",
      status: 200,
      latency: 45,
      method: "POST",
      path: "/api/customer-segmentation",
      ip: "203.0.113.195",
      severity: "info",
      message: "Successful request processed"
    },
    {
      id: "log_002",
      timestamp: "2025-09-10T08:22:12",
      endpoint: "endpoint_002",
      endpointName: "sales-forecast-api",
      status: 400,
      latency: 32,
      method: "POST",
      path: "/api/sales-forecast",
      ip: "198.51.100.42",
      severity: "warning",
      message: "Invalid input format: missing 'historical_data' field"
    },
    {
      id: "log_003",
      timestamp: "2025-09-10T08:21:03",
      endpoint: "endpoint_001",
      endpointName: "customer-segmentation-api",
      status: 500,
      latency: 124,
      method: "POST",
      path: "/api/customer-segmentation",
      ip: "192.0.2.235",
      severity: "error",
      message: "Internal server error: failed to connect to database"
    },
    {
      id: "log_004",
      timestamp: "2025-09-10T08:19:57",
      endpoint: "endpoint_001",
      endpointName: "customer-segmentation-api",
      status: 200,
      latency: 51,
      method: "POST",
      path: "/api/customer-segmentation",
      ip: "203.0.113.28",
      severity: "info",
      message: "Successful request processed"
    },
    {
      id: "log_005",
      timestamp: "2025-09-10T08:18:22",
      endpoint: "endpoint_003",
      endpointName: "churn-prediction-api",
      status: 200,
      latency: 67,
      method: "POST",
      path: "/api/churn-prediction",
      ip: "198.51.100.17",
      severity: "info",
      message: "Successful request processed"
    },
    {
      id: "log_006",
      timestamp: "2025-09-10T08:17:45",
      endpoint: "endpoint_002",
      endpointName: "sales-forecast-api",
      status: 429,
      latency: 12,
      method: "POST",
      path: "/api/sales-forecast",
      ip: "192.0.2.112",
      severity: "warning",
      message: "Too many requests from this IP address"
    },
    {
      id: "log_007",
      timestamp: "2025-09-10T08:16:33",
      endpoint: "endpoint_001",
      endpointName: "customer-segmentation-api",
      status: 403,
      latency: 28,
      method: "POST",
      path: "/api/customer-segmentation",
      ip: "203.0.113.76",
      severity: "warning",
      message: "Authentication failed: invalid API key"
    }
  ];

  // Filter logs based on selected criteria
  const filteredLogs = logs.filter((log) => {
    if (selectedEndpoint !== "all" && log.endpoint !== selectedEndpoint) return false;

    if (selectedStatus !== "all") {
      if (selectedStatus === "success" && (log.status < 200 || log.status >= 300)) return false;
      if (selectedStatus === "warning" && (log.status < 400 || log.status >= 500)) return false;
      if (selectedStatus === "error" && log.status < 500) return false;
    }

    if (selectedSeverity !== "all" && log.severity !== selectedSeverity) return false;

    if (
      searchText &&
      !log.message.toLowerCase().includes(searchText.toLowerCase()) &&
      !log.path.toLowerCase().includes(searchText.toLowerCase()) &&
      !log.ip.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;

    return true;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <MdError style={{ color: "#ef4444" }} />;
      case "warning":
        return <MdWarning style={{ color: "#f59e0b" }} />;
      case "info":
      default:
        return <MdInfo style={{ color: "#3b82f6" }} />;
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "#10b981";
    if (status >= 400 && status < 500) return "#f59e0b";
    if (status >= 500) return "#ef4444";
    return "#6b7280";
  };

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (text: string) => {
        const date = new Date(text);
        return <span>{date.toLocaleString()}</span>;
      }
    },
    {
      title: "Endpoint",
      dataIndex: "endpointName",
      key: "endpoint",
      width: 200,
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666666" }}>{record.path}</div>
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: number) => (
        <Tag color={status < 300 ? "green" : status < 500 ? "gold" : "red"} style={{ fontWeight: 500 }}>
          {status}
        </Tag>
      )
    },
    {
      title: "Độ trễ",
      dataIndex: "latency",
      key: "latency",
      width: 100,
      render: (latency: number) => <span style={{ color: latency > 100 ? "#ef4444" : "#333333" }}>{latency}ms</span>
    },
    {
      title: "Mức độ",
      dataIndex: "severity",
      key: "severity",
      width: 120,
      render: (severity: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {getSeverityIcon(severity)}
          <span
            style={{
              textTransform: "capitalize",
              color: severity === "error" ? "#ef4444" : severity === "warning" ? "#f59e0b" : "#3b82f6"
            }}
          >
            {severity}
          </span>
        </div>
      )
    },
    {
      title: "Thông báo",
      dataIndex: "message",
      key: "message",
      render: (text: string) => <div style={{ fontSize: "14px" }}>{text}</div>
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      width: 150,
      render: (text: string) => <span style={{ fontFamily: "monospace" }}>{text}</span>
    }
  ];

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#333333", margin: 0 }}>Logs hệ thống</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<MdRefresh />}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "6px"
            }}
          >
            Làm mới
          </Button>
          <Button
            icon={<MdDownload />}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "6px"
            }}
          >
            Xuất logs
          </Button>
        </div>
      </div>

      <Card style={{ marginBottom: "24px", borderRadius: "8px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ minWidth: "200px", flex: "1" }}>
            <div style={{ marginBottom: "6px", fontSize: "14px", color: "#666666" }}>Endpoint</div>
            <Select
              value={selectedEndpoint}
              onChange={setSelectedEndpoint}
              style={{ width: "100%", borderRadius: "6px" }}
              dropdownStyle={{ borderRadius: "6px" }}
            >
              <Option value="all">Tất cả endpoints</Option>
              {endpoints.map((endpoint) => (
                <Option key={endpoint.id} value={endpoint.id}>
                  {endpoint.name}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ minWidth: "180px", flex: "1" }}>
            <div style={{ marginBottom: "6px", fontSize: "14px", color: "#666666" }}>Trạng thái</div>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: "100%", borderRadius: "6px" }}
              dropdownStyle={{ borderRadius: "6px" }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="success">Success (2xx)</Option>
              <Option value="warning">Warning (4xx)</Option>
              <Option value="error">Error (5xx)</Option>
            </Select>
          </div>

          <div style={{ minWidth: "180px", flex: "1" }}>
            <div style={{ marginBottom: "6px", fontSize: "14px", color: "#666666" }}>Mức độ</div>
            <Select
              value={selectedSeverity}
              onChange={setSelectedSeverity}
              style={{ width: "100%", borderRadius: "6px" }}
              dropdownStyle={{ borderRadius: "6px" }}
            >
              <Option value="all">Tất cả mức độ</Option>
              <Option value="info">Info</Option>
              <Option value="warning">Warning</Option>
              <Option value="error">Error</Option>
            </Select>
          </div>

          <div style={{ minWidth: "300px", flex: "2" }}>
            <div style={{ marginBottom: "6px", fontSize: "14px", color: "#666666" }}>Thời gian</div>
            <RangePicker style={{ width: "100%", borderRadius: "6px" }} placeholder={["Bắt đầu", "Kết thúc"]} />
          </div>

          <div style={{ minWidth: "250px", flex: "1" }}>
            <div style={{ marginBottom: "6px", fontSize: "14px", color: "#666666" }}>Tìm kiếm</div>
            <Input
              placeholder="Tìm trong logs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: "6px" }}
              suffix={<FiSearch />}
            />
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <Radio.Group defaultValue="all">
            <Radio.Button value="all" style={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}>
              Tất cả
            </Radio.Button>
            <Radio.Button value="today">Hôm nay</Radio.Button>
            <Radio.Button value="week">Tuần này</Radio.Button>
            <Radio.Button value="month" style={{ borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}>
              Tháng này
            </Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#666666" }}>
          <FiFilter />
          <span>{filteredLogs.length} kết quả</span>
        </div>
      </div>

      <Table
        dataSource={filteredLogs}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        style={{ borderRadius: "8px", overflow: "hidden" }}
        size="middle"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default LogsTab;
