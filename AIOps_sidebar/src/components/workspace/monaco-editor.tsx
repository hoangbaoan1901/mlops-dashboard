"use client";

import { useRef } from "react";
import { Button, Card } from "antd";
import { PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MonacoEditor({ value, onChange }: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Mock cells for notebook interface
  const cells = [
    { id: 1, type: "code", content: 'import pandas as pd\nimport numpy as np\n\nprint("Xin chào AIOps")' },
    {
      id: 2,
      type: "code",
      content:
        '# Tạo dữ liệu mẫu\ndata = pd.DataFrame({\n    "tên": ["An", "Bình", "Chi"],\n    "tuổi": [25, 30, 28]\n})\nprint(data)'
    }
  ];

  const handleRunCell = (cellId: number) => {
    console.log(`Chạy cell ${cellId}`);
    // Mock output
  };

  return (
    <div className="h-full bg-gray-50 p-4 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        {cells.map((cell) => (
          <Card key={cell.id} className="shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <pre className="whitespace-pre-wrap">{cell.content}</pre>
                </div>
                <div className="mt-2 p-3 bg-gray-100 rounded border-l-4 border-blue-500">
                  <div className="text-sm text-gray-600 mb-1">Kết quả:</div>
                  <pre className="text-sm">
                    {cell.id === 1
                      ? "Xin chào AIOps!"
                      : cell.id === 2
                      ? "   tên  tuổi\n0   An    25\n1 Bình    30\n2  Chi    28"
                      : ""}
                  </pre>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleRunCell(cell.id)}
                  size="small"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Chạy
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <div className="text-center">
          <Button type="dashed" icon={<PlusOutlined />} className="w-full h-12">
            Thêm ô code mới
          </Button>
        </div>
      </div>
    </div>
  );
}
