import { Layout, Flex } from "antd";
import { FiLogOut, FiMenu, FiUser, FiX, FiSettings, FiBell } from "react-icons/fi";

export const Header: React.FC<{
  user: any;
  setCollapsed: (collapsed: boolean) => void;
  collapsed: boolean;
  handleLogout: () => void;
}> = ({ user, collapsed, handleLogout, setCollapsed }) => {
  return (
    <Layout.Header
      className="bg-white border-b border-gray-200 shadow-sm"
      style={{
        padding: "0 24px",
        height: "72px",
        lineHeight: "normal",
        display: "flex",
        alignItems: "center"
      }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left side - Menu toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-sm"
          >
            {collapsed ? <FiMenu size={18} /> : <FiX size={18} />}
          </button>

          {/* Breadcrumb or title area */}
          {/* <div className="hidden md:flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div> */}
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-sm relative">
            <FiBell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-sm">
            <FiSettings size={18} />
          </button>

          {/* User profile section */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="flex flex-col items-end">
              <span className="font-medium text-sm text-gray-900">{user?.name || user?.email}</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md border-2 border-white">
              <FiUser size={16} />
            </div>
            {/* Logout button - uncommented for professional look */}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:shadow-sm"
            >
              <FiLogOut size={14} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </Layout.Header>
  );
};
