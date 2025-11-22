"use client";

import { useState } from "react";
import { Modal, Form, Input, Button, Select, Typography } from "antd";
import { FiPlus } from "react-icons/fi";

const { Option } = Select;
const { Title } = Typography;

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNotebook: (name: string, language: string) => void;
}

export function CreateNotebookModal({ isOpen, onClose, onCreateNotebook }: CreateNotebookModalProps) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      onCreateNotebook(values.name, values.language);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Form validation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FiPlus className="text-blue-500" />
          <Title level={5} style={{ margin: 0 }}>
            Tạo Notebook mới
          </Title>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      maskClosable={false}
      className="rounded-lg"
      centered
    >
      <Form form={form} layout="vertical" className="mt-4" initialValues={{ language: "python" }}>
        <Form.Item name="name" label="Tên Notebook" rules={[{ required: true, message: "Vui lòng nhập tên notebook" }]}>
          <Input placeholder="Nhập tên notebook" className="rounded-lg" autoFocus />
        </Form.Item>

        <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ" }]}>
          <Select className="rounded-lg w-full">
            <Option value="python">Python</Option>
            <Option value="r">R</Option>
            <Option value="sql">SQL</Option>
            <Option value="scala">Scala</Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit} loading={isLoading} className="bg-blue-500 hover:bg-blue-600">
            Tạo Notebook
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateNotebookModal;
