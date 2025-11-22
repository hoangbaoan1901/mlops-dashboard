"use client";

import { Modal, Tabs, Descriptions, Card, Progress, Button, Table } from "antd";
import { FiExternalLink, FiDownload } from "react-icons/fi";
import { MdModelTraining } from "react-icons/md";

interface ViewModelModalProps {
  visible: boolean;
  onCancel: () => void;
  model: any;
}

const { TabPane } = Tabs;

const ViewModelModal = ({ visible, onCancel, model }: ViewModelModalProps) => {
  // Sample model metrics data
  const modelMetrics = {
    accuracy: 94.2,
    precision: 92.8,
    recall: 90.5,
    f1Score: 91.6,
    auc: 0.95,
  };

  // Sample feature importance data
  const featureImportance = [
    { feature: "customer_age", importance: 0.28 },
    { feature: "purchase_frequency", importance: 0.23 },
    { feature: "total_spend", importance: 0.19 },
    { feature: "products_viewed", importance: 0.15 },
    { feature: "session_duration", importance: 0.09 },
    { feature: "device_type", importance: 0.06 },
  ];

  // Sample model versions
  const modelVersions = [
    {
      key: "1",
      version: "v1.2.3",
      date: "2024-01-15",
      author: "Nguyễn Văn A",
      accuracy: "94.2%",
    },
    {
      key: "2",
      version: "v1.1.0",
      date: "2023-12-10",
      author: "Trần Thị B",
      accuracy: "92.7%",
    },
    {
      key: "3",
      version: "v1.0.1",
      date: "2023-11-25",
      author: "Lê Văn C",
      accuracy: "90.5%",
    },
  ];

  const columns = [
    {
      title: "Phiên bản",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Độ chính xác",
      dataIndex: "accuracy",
      key: "accuracy",
    },
  ];

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: 600, color: "#333333", display: "flex", alignItems: "center", gap: "8px" }}>
          <MdModelTraining />
          <span>{model?.name || "Chi tiết mô hình"}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      bodyStyle={{ padding: "0" }}
    >
      <Tabs defaultActiveKey="1" style={{ padding: "0 24px" }}>
        <TabPane tab="Thông tin" key="1">
          <div style={{ padding: "16px 0" }}>
            <Descriptions bordered column={2} size="small" labelStyle={{ fontWeight: 500 }}>
              <Descriptions.Item label="Tên mô hình" span={2}>{model?.name || "Customer Segmentation RF"}</Descriptions.Item>
              <Descriptions.Item label="Phiên bản">{model?.version || "v1.2.3"}</Descriptions.Item>
              <Descriptions.Item label="Framework">{model?.framework || "Scikit-learn"}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    backgroundColor: "#10b98120",
                    color: "#10b981",
                  }}
                >
                  {model?.status || "Production"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">{model?.lastUpdated || "2 giờ trước"}</Descriptions.Item>
              <Descriptions.Item label="Bộ dữ liệu">Customer Data Set</Descriptions.Item>
              <Descriptions.Item label="Thuật toán">Random Forest</Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                Mô hình phân khúc khách hàng dựa trên hành vi mua hàng, thông tin nhân khẩu học và tương tác với sản phẩm.
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <Button 
                icon={<FiDownload />}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px", 
                  borderRadius: "6px" 
                }}
              >
                Tải mô hình
              </Button>
              <Button
                type="primary"
                icon={<FiExternalLink />}
                style={{ 
                  backgroundColor: "#155dfc", 
                  borderColor: "#155dfc", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px", 
                  borderRadius: "6px" 
                }}
              >
                Notebook
              </Button>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Metrics" key="2">
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {Object.entries(modelMetrics).map(([key, value]) => (
                <Card key={key} size="small" style={{ borderRadius: "6px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#155dfc" }}>
                      {typeof value === 'number' ? value.toFixed(2) : value}
                      {key === 'auc' ? '' : '%'}
                    </div>
                    <div style={{ color: "#666666", textTransform: "capitalize" }}>
                      {key === 'f1Score' ? 'F1 Score' : 
                       key === 'auc' ? 'AUC-ROC' : key}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ marginTop: "24px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#333333", marginBottom: "16px" }}>Feature Importance</h4>
              {featureImportance.map((item) => (
                <div key={item.feature} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#333333" }}>{item.feature}</span>
                    <span style={{ color: "#666666" }}>{(item.importance * 100).toFixed(1)}%</span>
                  </div>
                  <Progress
                    percent={item.importance * 100}
                    showInfo={false}
                    strokeColor="#155dfc"
                    style={{ borderRadius: "4px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab="Phiên bản" key="3">
          <div style={{ padding: "16px 0" }}>
            <Table 
              dataSource={modelVersions} 
              columns={columns} 
              pagination={false}
              size="small"
              style={{ borderRadius: "6px", overflow: "hidden" }}
            />
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ViewModelModal;
