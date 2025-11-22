"use client";

import { Tabs, Card, Table, Input, Button, Tag } from "antd";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { FiCopy } from "react-icons/fi";

const { TabPane } = Tabs;

interface ApiDocsTabProps {
  endpoints: any[];
}

const ApiDocsTab = ({ endpoints }: ApiDocsTabProps) => {
  const [searchText, setSearchText] = useState("");
  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0]?.id);

  const filteredEndpoints = endpoints.filter((endpoint) =>
    endpoint.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sample API endpoints with request and response examples
  const apiEndpointData = {
    customer_segmentation: {
      endpoint: "/api/customer-segmentation",
      method: "POST",
      description: "Phân khúc khách hàng dựa trên dữ liệu đầu vào",
      requestExample: {
        customer_id: "C123456",
        age: 35,
        income: 50000,
        purchase_frequency: 12,
        avg_order_value: 120
      },
      responseExample: {
        segment: "high_value",
        confidence: 0.92,
        next_best_action: "loyalty_program_upgrade"
      },
      parameters: [
        { name: "customer_id", type: "string", required: true, description: "ID của khách hàng" },
        { name: "age", type: "number", required: true, description: "Tuổi của khách hàng" },
        { name: "income", type: "number", required: false, description: "Thu nhập hàng năm" },
        { name: "purchase_frequency", type: "number", required: true, description: "Số lần mua hàng trong 12 tháng" },
        { name: "avg_order_value", type: "number", required: true, description: "Giá trị trung bình mỗi đơn hàng" }
      ]
    },
    sales_forecast: {
      endpoint: "/api/sales-forecast",
      method: "POST",
      description: "Dự báo doanh số dựa trên dữ liệu lịch sử",
      requestExample: {
        product_id: "P789012",
        historical_data: [120, 125, 130, 140, 135, 150, 155],
        horizon: 7
      },
      responseExample: {
        forecast: [158, 162, 165, 170, 172, 175, 180],
        confidence_intervals: {
          lower: [150, 152, 155, 160, 162, 165, 170],
          upper: [166, 172, 175, 180, 182, 185, 190]
        }
      },
      parameters: [
        { name: "product_id", type: "string", required: true, description: "ID của sản phẩm" },
        { name: "historical_data", type: "array", required: true, description: "Dữ liệu doanh số lịch sử" },
        { name: "horizon", type: "number", required: true, description: "Số ngày cần dự báo" }
      ]
    },
    churn_prediction: {
      endpoint: "/api/churn-prediction",
      method: "POST",
      description: "Dự đoán khả năng rời bỏ của khách hàng",
      requestExample: {
        user_id: "U345678",
        months_active: 8,
        total_spent: 1200,
        last_purchase_days: 45,
        support_tickets: 2
      },
      responseExample: {
        churn_probability: 0.35,
        risk_level: "medium",
        retention_suggestions: ["offer_discount", "follow_up_email"]
      },
      parameters: [
        { name: "user_id", type: "string", required: true, description: "ID của người dùng" },
        { name: "months_active", type: "number", required: true, description: "Số tháng hoạt động" },
        { name: "total_spent", type: "number", required: true, description: "Tổng số tiền đã chi" },
        { name: "last_purchase_days", type: "number", required: true, description: "Số ngày kể từ lần mua cuối" },
        { name: "support_tickets", type: "number", required: false, description: "Số ticket hỗ trợ đã tạo" }
      ]
    }
  };

  const getEndpointData = (endpointId: string) => {
    if (endpointId === "endpoint_001") return apiEndpointData.customer_segmentation;
    if (endpointId === "endpoint_002") return apiEndpointData.sales_forecast;
    if (endpointId === "endpoint_003") return apiEndpointData.churn_prediction;
    return apiEndpointData.customer_segmentation; // Default
  };

  const currentEndpoint = getEndpointData(activeEndpoint);

  // Table columns for parameters
  const columns = [
    {
      title: "Tên tham số",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontFamily: "monospace", fontWeight: 500 }}>{text}</span>
    },
    {
      title: "Kiểu dữ liệu",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: "Bắt buộc",
      dataIndex: "required",
      key: "required",
      render: (required: boolean) => (required ? <Tag color="red">Có</Tag> : <Tag color="green">Không</Tag>)
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a notification here
  };

  const formatJson = (json: any) => {
    return JSON.stringify(json, null, 2);
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#333333", margin: 0 }}>API Documentation</h2>
          <div style={{ position: "relative", width: "300px" }}>
            <Input
              placeholder="Tìm kiếm endpoint..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                borderRadius: "6px",
                padding: "8px 12px",
                paddingLeft: "36px"
              }}
            />
            <MdSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666666",
                fontSize: "18px"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ width: "250px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#666666",
              marginBottom: "12px",
              textTransform: "uppercase"
            }}
          >
            Endpoints
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredEndpoints.map((endpoint) => (
              <Card
                key={endpoint.id}
                size="small"
                style={{
                  borderRadius: "6px",
                  borderColor: activeEndpoint === endpoint.id ? "#155dfc" : "#e5e7eb",
                  cursor: "pointer",
                  backgroundColor: activeEndpoint === endpoint.id ? "#f0f7ff" : "white"
                }}
                onClick={() => setActiveEndpoint(endpoint.id)}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#333333" }}>{endpoint.name}</div>
                  <div style={{ fontSize: "12px", color: "#666666", marginTop: "4px" }}>{endpoint.model}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Card
            title={
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#333333",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Tag color="green" style={{ margin: 0 }}>
                    {currentEndpoint.method}
                  </Tag>
                  <span style={{ fontFamily: "monospace" }}>{currentEndpoint.endpoint}</span>
                </div>
                <div style={{ fontSize: "14px", color: "#666666", marginTop: "4px" }}>
                  {currentEndpoint.description}
                </div>
              </div>
            }
            style={{ borderRadius: "8px" }}
          >
            <Tabs defaultActiveKey="parameters">
              <TabPane tab="Tham số" key="parameters">
                <Table
                  dataSource={currentEndpoint.parameters}
                  columns={columns}
                  pagination={false}
                  rowKey="name"
                  size="small"
                  style={{ borderRadius: "6px", overflow: "hidden" }}
                />
              </TabPane>
              <TabPane tab="Request Example" key="request">
                <div style={{ position: "relative" }}>
                  <Button
                    icon={<FiCopy />}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={() => copyToClipboard(formatJson(currentEndpoint.requestExample))}
                  />
                  <pre
                    style={{
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "6px",
                      overflow: "auto",
                      maxHeight: "400px"
                    }}
                  >
                    {formatJson(currentEndpoint.requestExample)}
                  </pre>
                </div>
              </TabPane>
              <TabPane tab="Response Example" key="response">
                <div style={{ position: "relative" }}>
                  <Button
                    icon={<FiCopy />}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={() => copyToClipboard(formatJson(currentEndpoint.responseExample))}
                  />
                  <pre
                    style={{
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "6px",
                      overflow: "auto",
                      maxHeight: "400px"
                    }}
                  >
                    {formatJson(currentEndpoint.responseExample)}
                  </pre>
                </div>
              </TabPane>
              <TabPane tab="Code Example" key="code">
                <div style={{ position: "relative" }}>
                  <Button
                    icon={<FiCopy />}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={() =>
                      copyToClipboard(`
fetch('${currentEndpoint.endpoint}', {
  method: '${currentEndpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${formatJson(currentEndpoint.requestExample)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`)
                    }
                  />
                  <pre
                    style={{
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "6px",
                      overflow: "auto",
                      maxHeight: "400px"
                    }}
                  >
                    {`fetch('${currentEndpoint.endpoint}', {
  method: '${currentEndpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${formatJson(currentEndpoint.requestExample)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                  </pre>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsTab;
