"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md border border-gray-200 text-center">
        <div className="w-16 h-16 rounded-lg bg-blue-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <span className="text-white text-2xl font-bold">AI</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">AIOps Hub</h1>

        <p className="text-secondary text-sm mb-6">Nền tảng phân tích dữ liệu và machine learning</p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/login" className="w-full">
            <button className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
              Đăng nhập
            </button>
          </Link>

          <Link href="/auth/register" className="w-full">
            <button className="w-full py-3 rounded-lg bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium transition-colors">
              Đăng ký
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
