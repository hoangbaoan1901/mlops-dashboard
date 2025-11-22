"use client";

import { Modal, Form, Input, Upload, Select, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";

const { Dragger } = Upload;
const { Option } = Select;

interface ImportModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (values: any) => void;
}

const ImportModelModal = ({ visible, onCancel, onImport }: ImportModelModalProps) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onImport({ ...values, files: fileList });
      form.resetFields();
      setFileList([]);
    });
  };

  const customUploadProps = {
    onRemove: (file: any) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file: any) => {
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList
  };

  return (
    <Modal
      title={<div style={{ fontSize: "18px", fontWeight: 600, color: "#333333" }}>Import mô hình</div>}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} style={{ borderRadius: "6px" }}>
          Hủy
        </Button>,
        <Button
          key="import"
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
          icon={<FiUpload />}
        >
          Import
        </Button>
      ]}
      width={600}
      bodyStyle={{ padding: "24px" }}
    >
      <Form form={form} layout="vertical" initialValues={{ framework: "Scikit-learn" }}>
        <Form.Item
          name="name"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>Tên mô hình</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên mô hình" }]}
        >
          <Input placeholder="Nhập tên mô hình" style={{ borderRadius: "6px", padding: "8px 12px" }} />
        </Form.Item>
        <Form.Item
          name="version"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>Phiên bản</span>}
          rules={[{ required: true, message: "Vui lòng nhập phiên bản" }]}
        >
          <Input placeholder="v1.0.0" style={{ borderRadius: "6px", padding: "8px 12px" }} />
        </Form.Item>
        <Form.Item
          name="framework"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>Framework</span>}
          rules={[{ required: true, message: "Vui lòng chọn framework" }]}
        >
          <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
            <Option value="Scikit-learn">Scikit-learn</Option>
            <Option value="TensorFlow">TensorFlow</Option>
            <Option value="XGBoost">XGBoost</Option>
            <Option value="PyTorch">PyTorch</Option>
            <Option value="Keras">Keras</Option>
            <Option value="Other">Khác</Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label={<span style={{ color: "#333333", fontWeight: 500 }}>Mô tả</span>}>
          <Input.TextArea
            rows={3}
            placeholder="Mô tả ngắn về mô hình..."
            style={{ borderRadius: "6px", padding: "8px 12px" }}
          />
        </Form.Item>
        <Form.Item
          name="file"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>File mô hình</span>}
          rules={[{ required: true, message: "Vui lòng tải lên file mô hình" }]}
        >
          <Dragger {...customUploadProps} style={{ borderRadius: "6px", padding: "16px" }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#155dfc" }} />
            </p>
            <p style={{ fontWeight: 500, color: "#333333" }}>Kéo thả file vào đây hoặc click để tải lên</p>
            <p style={{ color: "#666666", fontSize: "14px" }}>Hỗ trợ các file .pkl, .h5, .pb, .onnx, .pt</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ImportModelModal;
