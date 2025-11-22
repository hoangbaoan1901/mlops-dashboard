"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "antd"

export default function Terminal() {
  const [history, setHistory] = useState([
    "$ Chào mừng đến với DataBricks Terminal",
    '$ Gõ "help" để xem danh sách lệnh có sẵn',
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)

  const handleCommand = (command: string) => {
    const newHistory = [...history, `$ ${command}`]

    // Mock command responses
    switch (command.toLowerCase().trim()) {
      case "help":
        newHistory.push("Các lệnh có sẵn:")
        newHistory.push("  ls - Liệt kê files")
        newHistory.push("  pwd - Hiển thị thư mục hiện tại")
        newHistory.push("  python - Chạy Python interpreter")
        newHistory.push("  clear - Xóa màn hình")
        break
      case "ls":
        newHistory.push("notebooks/")
        newHistory.push("datasets/")
        newHistory.push("models/")
        break
      case "pwd":
        newHistory.push("/workspace/user")
        break
      case "python":
        newHistory.push("Python 3.9.7 (default, Sep 16 2021, 16:59:28)")
        newHistory.push(">>> ")
        break
      case "clear":
        setHistory(["$ Terminal đã được xóa"])
        setCurrentCommand("")
        return
      default:
        if (command.trim()) {
          newHistory.push(`Lệnh không tìm thấy: ${command}`)
        }
    }

    setHistory(newHistory)
    setCurrentCommand("")
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  return (
    <div className="h-full bg-gray-900 text-green-400 font-mono">
      <div ref={terminalRef} className="h-full p-4 overflow-auto">
        <div className="space-y-1">
          {history.map((line, index) => (
            <div key={index} className="text-sm">
              {line}
            </div>
          ))}
        </div>

        <div className="flex items-center mt-2">
          <span className="text-sm mr-2">$</span>
          <Input
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onPressEnter={() => handleCommand(currentCommand)}
            className="bg-transparent border-none text-green-400 font-mono text-sm p-0"
            placeholder="Nhập lệnh..."
          />
        </div>
      </div>
    </div>
  )
}
