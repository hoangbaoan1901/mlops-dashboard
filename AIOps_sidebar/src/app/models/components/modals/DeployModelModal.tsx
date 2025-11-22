"use client";

import { Modal, Form, Input, Select, Radio, Tabs, Button, Descriptions, Tag } from "antd";
import { useState } from "react";
import { MdRocketLaunch, MdMemory, MdStorage } from "react-icons/md";

const { Option } = Select;
const { TabPane } = Tabs;

interface DeployModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onDeploy: (values: any) => void;
  model: any;
}

const DeployModelModal = ({ visible, onCancel, onDeploy, model }: DeployModelModalProps) => {
  const [form] = Form.useForm();
  const [deployType, setDeployType] = useState<string>("api");

  const handleOk = () => {
    form.validateFields().then((values) => {
      onDeploy(values);
      form.resetFields();
    });
  };

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
    { value: "large", label: "Large (8 vCPU, 16 GB RAM)", specs: { cpu: 8, memory: 16 } },
    { value: "xlarge", label: "X-Large (16 vCPU, 32 GB RAM)", specs: { cpu: 16, memory: 32 } }
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
          <span>Deploy mô hình {model?.name || ""}</span>
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
          key="deploy"
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
          Deploy
        </Button>
      ]}
      bodyStyle={{ padding: "24px" }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Descriptions size="small" column={2} bordered style={{ borderRadius: "6px", overflow: "hidden" }}>
          <Descriptions.Item label="Tên mô hình" span={2}>
            {model?.name || "Customer Segmentation RF"}
          </Descriptions.Item>
          <Descriptions.Item label="Phiên bản">{model?.version || "v1.2.3"}</Descriptions.Item>
          <Descriptions.Item label="Framework">{model?.framework || "Scikit-learn"}</Descriptions.Item>
          <Descriptions.Item label="Độ chính xác">{model?.accuracy || "94.2%"}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={model?.status === "Production" ? "green" : model?.status === "Staging" ? "orange" : "blue"}>
              {model?.status || "Production"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Tabs defaultActiveKey="basic" style={{ marginBottom: "16px" }}>
        <TabPane tab="Cơ bản" key="basic">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              deployType: "api",
              environment: "dev",
              instanceType: "small",
              scaling: "fixed",
              replicas: 1
            }}
          >
            <Form.Item
              name="deployType"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Loại triển khai</span>}
            >
              <Radio.Group onChange={(e) => setDeployType(e.target.value)} value={deployType}>
                <Radio value="api" style={{ color: "#333333" }}>
                  API Endpoint
                </Radio>
                <Radio value="batch" style={{ color: "#333333" }}>
                  Batch Inference
                </Radio>
                <Radio value="stream" style={{ color: "#333333" }}>
                  Stream Processing
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="deployName"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Tên triển khai</span>}
              rules={[{ required: true, message: "Vui lòng nhập tên triển khai" }]}
            >
              <Input
                placeholder={`${model?.name || "model"}-deployment`}
                style={{ borderRadius: "6px", padding: "8px 12px" }}
              />
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
                    <div className="flex items-center justify-start gap-2">
                      <div style={{ fontWeight: 500 }}>{instance.label}</div>
                      <div style={{ fontSize: "12px", color: "#666666", display: "flex", gap: "8px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                          <MdMemory /> {instance.specs.cpu} vCPU
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                          <MdStorage /> {instance.specs.memory} GB
                        </span>
                      </div>
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

              {form.getFieldValue("scaling") === "fixed" && (
                <Form.Item
                  name="replicas"
                  label={<span style={{ color: "#333333", fontWeight: 500 }}>Replicas</span>}
                  style={{ width: "50%" }}
                >
                  <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={5}>5</Option>
                  </Select>
                </Form.Item>
              )}

              {form.getFieldValue("scaling") === "auto" && (
                <>
                  <Form.Item
                    name="minReplicas"
                    label={<span style={{ color: "#333333", fontWeight: 500 }}>Min replicas</span>}
                    style={{ width: "25%" }}
                  >
                    <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                      <Option value={1}>1</Option>
                      <Option value={2}>2</Option>
                      <Option value={3}>3</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="maxReplicas"
                    label={<span style={{ color: "#333333", fontWeight: 500 }}>Max replicas</span>}
                    style={{ width: "25%" }}
                  >
                    <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                      <Option value={2}>2</Option>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                    </Select>
                  </Form.Item>
                </>
              )}
            </div>
          </Form>
        </TabPane>
        <TabPane tab="Nâng cao" key="advanced">
          <Form
            layout="vertical"
            initialValues={{
              monitoring: true,
              logging: true,
              versioning: true,
              timeout: 30
            }}
          >
            <Form.Item name="timeout" label={<span style={{ color: "#333333", fontWeight: 500 }}>Timeout (giây)</span>}>
              <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                <Option value={15}>15</Option>
                <Option value={30}>30</Option>
                <Option value={60}>60</Option>
                <Option value={120}>120</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="runtimeOptions"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Runtime Options</span>}
            >
              <Select
                mode="multiple"
                style={{ borderRadius: "6px" }}
                dropdownStyle={{ borderRadius: "6px" }}
                defaultValue={["monitoring", "logging"]}
              >
                <Option value="monitoring">Enable monitoring</Option>
                <Option value="logging">Enable logging</Option>
                <Option value="versioning">Enable versioning</Option>
                <Option value="alerts">Set up alerts</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Mô tả triển khai</span>}
            >
              <Input.TextArea
                rows={3}
                placeholder="Mô tả về việc triển khai mô hình này..."
                style={{ borderRadius: "6px", padding: "8px 12px" }}
              />
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default DeployModelModal;
