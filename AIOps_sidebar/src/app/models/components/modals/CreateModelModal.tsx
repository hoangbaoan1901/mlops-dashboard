"use client";

import { Modal, Form, Input, Select, InputNumber, Radio, Upload, Button } from "antd";
import { useState } from "react";
import { MdModelTraining } from "react-icons/md";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

interface CreateModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
}

const CreateModelModal = ({ visible, onCancel, onCreate }: CreateModelModalProps) => {
  const [form] = Form.useForm();
  const [modelType, setModelType] = useState<string>("train");
  const [fileList, setFileList] = useState<any[]>([]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onCreate({ ...values, files: fileList });
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
    fileList,
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: 600, color: "#333333" }}>
          Tạo mô hình mới
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
          icon={<MdModelTraining />}
        >
          Tạo mô hình
        </Button>,
      ]}
      bodyStyle={{ padding: "24px" }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          modelType: "train",
          framework: "Scikit-learn",
          trainingPercentage: 80,
        }}
      >
        <Form.Item
          name="name"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>Tên mô hình</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên mô hình" }]}
        >
          <Input placeholder="Nhập tên mô hình" style={{ borderRadius: "6px", padding: "8px 12px" }} />
        </Form.Item>

        <Form.Item
          name="modelType"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>Phương pháp tạo mô hình</span>}
        >
          <Radio.Group onChange={(e) => setModelType(e.target.value)} value={modelType}>
            <Radio value="train" style={{ color: "#333333" }}>Huấn luyện mô hình mới</Radio>
            <Radio value="automl" style={{ color: "#333333" }}>Sử dụng AutoML</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="dataset"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>Bộ dữ liệu</span>}
          rules={[{ required: true, message: "Vui lòng chọn bộ dữ liệu" }]}
        >
          <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
            <Option value="customer_data">Dữ liệu khách hàng</Option>
            <Option value="sales_data">Dữ liệu bán hàng</Option>
            <Option value="marketing_data">Dữ liệu marketing</Option>
            <Option value="upload">Tải lên bộ dữ liệu mới</Option>
          </Select>
        </Form.Item>

        {form.getFieldValue("dataset") === "upload" && (
          <Form.Item
            name="datasetFile"
            label={<span style={{ color: "#333333", fontWeight: 500 }}>File dữ liệu</span>}
          >
            <Dragger {...customUploadProps} style={{ borderRadius: "6px", padding: "16px" }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#155dfc" }} />
              </p>
              <p style={{ fontWeight: 500, color: "#333333" }}>
                Kéo thả file vào đây hoặc click để tải lên
              </p>
              <p style={{ color: "#666666", fontSize: "14px" }}>
                Hỗ trợ các file .csv, .xlsx, .parquet
              </p>
            </Dragger>
          </Form.Item>
        )}

        {modelType === "train" && (
          <>
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
              </Select>
            </Form.Item>

            <Form.Item
              name="algorithm"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Thuật toán</span>}
              rules={[{ required: true, message: "Vui lòng chọn thuật toán" }]}
            >
              <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                <Option value="random_forest">Random Forest</Option>
                <Option value="xgboost">XGBoost</Option>
                <Option value="logistic_regression">Logistic Regression</Option>
                <Option value="svm">Support Vector Machine</Option>
                <Option value="neural_network">Neural Network</Option>
              </Select>
            </Form.Item>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name="trainingPercentage"
                label={<span style={{ color: "#333333", fontWeight: 500 }}>Phần trăm training (%)</span>}
                style={{ width: "50%" }}
              >
                <InputNumber
                  min={50}
                  max={90}
                  style={{ width: "100%", borderRadius: "6px", padding: "4px 8px" }}
                />
              </Form.Item>

              <Form.Item
                name="epochs"
                label={<span style={{ color: "#333333", fontWeight: 500 }}>Số epochs</span>}
                style={{ width: "50%" }}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  defaultValue={10}
                  style={{ width: "100%", borderRadius: "6px", padding: "4px 8px" }}
                />
              </Form.Item>
            </div>
          </>
        )}

        {modelType === "automl" && (
          <>
            <Form.Item
              name="optimizeFor"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Tối ưu hóa cho</span>}
            >
              <Select style={{ borderRadius: "6px" }} dropdownStyle={{ borderRadius: "6px" }}>
                <Option value="accuracy">Độ chính xác</Option>
                <Option value="speed">Tốc độ</Option>
                <Option value="balanced">Cân bằng giữa độ chính xác và tốc độ</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="timeLimit"
              label={<span style={{ color: "#333333", fontWeight: 500 }}>Giới hạn thời gian (phút)</span>}
            >
              <InputNumber
                min={5}
                max={120}
                defaultValue={30}
                style={{ width: "100%", borderRadius: "6px", padding: "4px 8px" }}
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="description"
          label={<span style={{ color: "#333333", fontWeight: 500 }}>Mô tả</span>}
        >
          <TextArea
            rows={3}
            placeholder="Mô tả ngắn về mô hình..."
            style={{ borderRadius: "6px", padding: "8px 12px" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModelModal;
