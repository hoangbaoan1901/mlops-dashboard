"use client";

import { Modal, Form, Input, Select, Button, Switch, InputNumber, Radio, Tabs } from "antd";
import { MdRocketLaunch } from "react-icons/md";
import { useState } from "react";

const { Option } = Select;
const { TabPane } = Tabs;

interface CreateEndpointModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
}

const CreateEndpointModal = ({ visible, onCancel, onCreate }: CreateEndpointModalProps) => {
  const [form] = Form.useForm();
  const [deployType, setDeployType] = useState<string>("rest");

  const handleOk = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      form.resetFields();
    });
  };

  // Sample models to choose from
  const models = [
    { id: "model_001", name: "Customer Segmentation RF", version: "v1.2.3" },
    { id: "model_002", name: "Sales Forecasting LSTM", version: "v2.1.0" },
    { id: "model_003", name: "Churn Prediction XGBoost", version: "v1.0.1" }
  ];

  // Sample environment options
  const environments = [
    { value: "dev", label: "Development", color: "#3b82f6" },
    { value: "staging", label: "Staging", color: "#f59e0b" },
    { value: "prod", label: "Production", color: "#10b981" }
  ];

  // Sample instance types
  const instanceTypes = [
    { value: "small", label: "Small (2 vCPU, 4 GB RAM)", specs: { cpu: 2, memory: 4 } },
    { value: "medium", label: "Medium (4 vCPU, 8 GB RAM)", specs: { cpu: 4, memory: 8 } },
    { value: "large", label: "Large (8 vCPU, 16 GB RAM)", specs: { cpu: 8, memory: 16 } }
  ];

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
          <MdRocketLaunch />
          <span>Tạo endpoint mới</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel} style={{ borderRadius: "6px" }}>
          Hủy
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={handleOk}
          style={{
            backgroundColor: "#155dfc",
            borderColor: "#155dfc",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
          icon={<MdRocketLaunch />}
        >
          Tạo endpoint
        </Button>
      ]}
      bodyStyle={{ padding: "24px" }}
    >
      <Tabs defaultActiveKey="basic" style={{ marginBottom: "16px" }}>
        <TabPane tab="Cơ bản" key="basic">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              deployType: "rest",
              environment: "dev",
              instanceType: "small",
              autoStart: true,
              scaling: "fixed",
              replicas: 1
            }}
          >
            <Form.Item
              name="endpointName"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Tên endpoint</span>}
              rules={[{ required: true, message: "Vui lòng nhập tên endpoint" }]}
            >
              <Input
                placeholder="my-model-api"
                style={{ borderRadius: "6px", padding: "8px 12px" }}
                addonBefore="api/"
              />
            </Form.Item>

            <Form.Item
              name="model"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Chọn mô hình</span>}
              rules={[{ required: true, message: "Vui lòng chọn mô hình" }]}
            >
              <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                {models.map((model) => (
                  <Option key={model.id} value={model.id}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{model.name}</div>
                      <div style={{ fontSize: "12px", color: "#666666" }}>{model.version}</div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="deployType" label={<span style={{ color: "#333333", fontWeight: 500 }}>Loại API</span>}>
              <Radio.Group onChange={(e) => setDeployType(e.target.value)} value={deployType}>
                <Radio value="rest" style={{ color: "#333333" }}>
                  REST API
                </Radio>
                <Radio value="grpc" style={{ color: "#333333" }}>
                  gRPC
                </Radio>
                <Radio value="graphql" style={{ color: "#333333" }}>
                  GraphQL
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="environment"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Môi trường</span>}
              rules={[{ required: true, message: "Vui lòng chọn môi trường" }]}
            >
              <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                {environments.map((env) => (
                  <Option key={env.value} value={env.value}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: env.color
                        }}
                      />
                      {env.label}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="instanceType"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Loại instance</span>}
            >
              <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                {instanceTypes.map((instance) => (
                  <Option key={instance.value} value={instance.value}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{instance.label}</div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name="scaling"
                label={<span style={{ color: "#333333", fontWeight: 500 }}>Scaling</span>}
                style={{ width: "50%" }}
              >
                <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                  <Option value="fixed">Fixed</Option>
                  <Option value="auto">Auto Scaling</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="replicas"
                label={<span style={{ color: "#333333", fontWeight: 500 }}>Replicas</span>}
                style={{ width: "50%" }}
              >
                <InputNumber min={1} max={10} defaultValue={1} style={{ width: "100%", borderRadius: "6px" }} />
              </Form.Item>
            </div>

            <Form.Item name="autoStart" valuePropName="checked" style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#333333", fontWeight: 500 }}>Tự động khởi chạy endpoint</span>
                <Switch defaultChecked style={{ backgroundColor: "#155dfc" }} />
              </div>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Nâng cao" key="advanced">
          <Form
            layout="vertical"
            initialValues={{
              authType: "api_key",
              cacheEnabled: true,
              timeout: 30,
              maxConcurrency: 100
            }}
          >
            <Form.Item
              name="authType"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Phương thức xác thực</span>}
            >
              <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                <Option value="api_key">API Key</Option>
                <Option value="jwt">JWT Token</Option>
                <Option value="oauth2">OAuth2</Option>
                <Option value="none">Không xác thực</Option>
              </Select>
            </Form.Item>

            <Form.Item name="timeout" label={<span style={{ color: "#333333", fontWeight: 500 }}>Timeout (giây)</span>}>
              <InputNumber min={5} max={120} defaultValue={30} style={{ width: "100%", borderRadius: "6px" }} />
            </Form.Item>

            <Form.Item
              name="maxConcurrency"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Concurrent Requests</span>}
            >
              <InputNumber min={10} max={1000} defaultValue={100} style={{ width: "100%", borderRadius: "6px" }} />
            </Form.Item>

            <Form.Item name="cacheEnabled" valuePropName="checked" style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#333333", fontWeight: 500 }}>Bật cache kết quả</span>
                <Switch defaultChecked style={{ backgroundColor: "#155dfc" }} />
              </div>
            </Form.Item>

            <Form.Item name="description" label={<span style={{ color: "#333333", fontWeight: 500 }}>Mô tả</span>}>
              <Input.TextArea
                rows={3}
                placeholder="Mô tả về endpoint này..."
                style={{ borderRadius: "6px", padding: "8px 12px" }}
              />
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CreateEndpointModal;
