"use client";

import { Modal, Tabs, Card, Progress, Button } from "antd";
import { Line } from "react-chartjs-2";
import { FiBarChart2, FiDownload } from "react-icons/fi";
import { useState } from "react";

// Note: This is a mock component. In a real application, you'd need to add
// chart.js and react-chartjs-2 to your dependencies:
// npm install chart.js react-chartjs-2

interface MonitorModalProps {
  visible: boolean;
  onCancel: () => void;
  endpoint: any;
}

const { TabPane } = Tabs;

const MonitorModal = ({ visible, onCancel, endpoint }: MonitorModalProps) => {
  const [timeRange, setTimeRange] = useState<string>("24h");

  // Normally, you'd get this data from your backend or monitoring service
  const metricCards = [
    { title: "Requests", value: "1,258", change: "+15%", trend: "up" },
    { title: "Avg. Latency", value: "45ms", change: "-3%", trend: "down" },
    { title: "Error Rate", value: "0.2%", change: "+0.1%", trend: "up" },
    { title: "CPU Usage", value: "42%", change: "+5%", trend: "up" }
  ];

  // Dummy chart data
  const chartData = {
    labels: ["12am", "2am", "4am", "6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
    datasets: [
      {
        label: "Requests",
        data: [65, 59, 80, 81, 56, 55, 40, 56, 76, 120, 130, 100],
        fill: false,
        borderColor: "#155dfc",
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: "index",
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#333333",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FiBarChart2 />
          <span>Theo dõi: {endpoint?.name || "customer-segmentation-api"}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={null}
      bodyStyle={{ padding: "24px" }}
    >
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ color: "#333333", fontWeight: 500, marginRight: "12px" }}>Thời gian:</span>
          <Button.Group>
            {["1h", "6h", "24h", "7d", "30d"].map((range) => (
              <Button
                key={range}
                type={timeRange === range ? "primary" : "default"}
                onClick={() => setTimeRange(range)}
                style={{
                  borderRadius: timeRange === range ? "4px" : undefined,
                  backgroundColor: timeRange === range ? "#155dfc" : undefined,
                  borderColor: timeRange === range ? "#155dfc" : undefined
                }}
              >
                {range}
              </Button>
            ))}
          </Button.Group>
        </div>

        <Button
          icon={<FiDownload />}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            borderRadius: "6px"
          }}
        >
          Xuất dữ liệu
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {metricCards.map((metric) => (
          <Card key={metric.title} size="small" style={{ borderRadius: "8px" }}>
            <div>
              <div style={{ color: "#666666", fontSize: "14px" }}>{metric.title}</div>
              <div
                style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "4px" }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333333" }}>{metric.value}</div>
                <div
                  style={{
                    color: metric.trend === "up" ? (metric.title === "Error Rate" ? "#ef4444" : "#10b981") : "#10b981",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {metric.change}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultActiveKey="overview" style={{ marginBottom: "16px" }}>
        <TabPane tab="Tổng quan" key="overview">
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 500, color: "#333333", marginBottom: "16px" }}>
              Lưu lượng yêu cầu
            </h4>
            <div style={{ height: "300px", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "16px" }}>
              {/* Replace this with actual chart component */}
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Chart would be rendered here with Chart.js
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 500, color: "#333333", marginBottom: "16px" }}>Độ trễ</h4>
            <div style={{ height: "200px", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "16px" }}>
              {/* Replace this with actual chart component */}
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Latency chart would be rendered here
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "16px", fontWeight: 500, color: "#333333", marginBottom: "16px" }}>Tài nguyên</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#333333" }}>CPU Usage</span>
                  <span style={{ color: "#666666" }}>42%</span>
                </div>
                <Progress percent={42} showInfo={false} strokeColor="#155dfc" style={{ borderRadius: "4px" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#333333" }}>Memory Usage</span>
                  <span style={{ color: "#666666" }}>68%</span>
                </div>
                <Progress percent={68} showInfo={false} strokeColor="#155dfc" style={{ borderRadius: "4px" }} />
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Lưu lượng" key="traffic">
          <div style={{ height: "400px", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "16px" }}>
            {/* Replace this with actual chart component */}
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Detailed traffic analysis would be shown here
            </div>
          </div>
        </TabPane>

        <TabPane tab="Lỗi" key="errors">
          <div style={{ height: "400px", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "16px" }}>
            {/* Replace this with actual chart component */}
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Error analysis would be shown here
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default MonitorModal;
