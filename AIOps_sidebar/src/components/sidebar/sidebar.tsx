import React, { useState, useEffect } from "react";
import { Button, Layout, Menu, type MenuProps } from "antd";
import "./sidebar.css";
import DatasetIcon from "@assets/database-65418.svg";
import DataStudioIcon from "@assets/dataset-icon.svg";
import WorkspaceIcon from "@assets/CodeSimple.svg";
import MLPipeLineIcon from "@assets/Aperture.svg";
import AutomationIcon from "@assets/Play.svg";
import ServingIcon from "@assets/HardDrives.svg";
import CassManagementIcon from "@assets/Cards.svg";
import FassManagementIcon from "@assets/Lightning.svg";
import SearchStatisticsIcon from "@assets/search.svg";
import MonitoringIcon from "@assets/Activity.svg";
import AdministrationIcon from "@assets/GearSix.svg";
import { BiChevronLeft } from "react-icons/bi";
import { useRouter, usePathname } from "next/navigation";
import { MdModelTraining, MdScience, MdStorage } from "react-icons/md";

const { Sider } = Layout;

interface SidebarProps {
  className?: string;
  collapsed: boolean;
  setCollapsed: (collapse: boolean) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar: React.FC<SidebarProps> = ({ className = "", collapsed, setCollapsed }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  // Map of parent keys to their children keys for quick lookup
  const parentChildrenMap: Record<string, string[]> = {
    "ml-pipelines": ["experiments", "models", "catalogs"]
  };

  const menuItems: MenuItem[] = [
    {
      // key: "data-studio",
      key: "#",
      icon: <DataStudioIcon className="text-blue-500" />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">Data Studio</span>
          <span className="text-xs text-secondary">Tiếp nhận và Tăng cường</span>
        </div>
      )
    },
    {
      // key: "workspace",
      key: "#",
      icon: <WorkspaceIcon className="text-blue-500" />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">Workspaces</span>
          <span className="text-xs text-secondary">Không gian và mã nguồn</span>
        </div>
      )
    },
    {
      key: "ml-pipelines",
      icon: <MLPipeLineIcon className="text-blue-500" />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">ML Pipelines</span>
          <span className="text-xs text-secondary">Quy trình AI/ML</span>
        </div>
      ),
      children: [
        {
          key: "experiments",
          icon: <MdScience className="w-6! h-6! text-blue-500!" />,
          label: (
            <div className="flex flex-col">
              {!collapsed && <span className="font-medium text-base text-black">Experiments</span>}
              <span className="text-xs text-secondary">Thí nghiệm</span>
            </div>
          )
        },
        {
          key: "models",
          icon: <MdModelTraining className="w-6! h-6! text-blue-500!" />,
          label: (
            <div className="flex flex-col">
              <span className="font-medium text-base text-black">Models</span>
              <span className="text-xs text-secondary">Mô hình</span>
            </div>
          )
        },
        {
          key: "catalogs",
          icon: <MdStorage className="w-6! h-6! text-blue-500!" />,
          label: (
            <div className="flex flex-col">
              <span className="font-medium text-base text-black">Catalogs</span>
              <span className="text-xs text-secondary">Danh mục</span>
            </div>
          )
        }
      ]
    },
    {
      // key: "automation",
      key: "#",
      icon: <AutomationIcon className="  text-blue-500" />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">Automation</span>
          <span className="text-xs text-secondary">Tự động hóa CI/CD</span>
        </div>
      )
    },
    {
      // key: "serving",
      key: "#",
      icon: <ServingIcon className=" " />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">Serving</span>
          <span className="text-xs text-secondary">Triển khai mô hình</span>
        </div>
      )
    },
    {
      // key: "caas-management",
      key: "#",
      icon: <CassManagementIcon className="" style={{ color: "blue", minWidth: "25px" }} />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">CaaS Management</span>
          <span className="text-xs text-secondary">Quản lý container</span>
        </div>
      )
    },
    {
      // key: "faas-management",
      key: "#",
      icon: <FassManagementIcon className="" style={{ color: "blue", minWidth: "25px" }} />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">FaaS Management</span>
          <span className="text-xs text-secondary">Quản lý hàm serverless</span>
        </div>
      )
    },
    {
      // key: "search-statistics",
      key: "#",
      icon: <SearchStatisticsIcon className="  text-blue-500" />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">Search & Statistics</span>
          <span className="text-xs text-secondary">Tìm kiếm và thống kê</span>
        </div>
      )
    },
    {
      // key: "monitoring",
      key: "#",
      icon: <MonitoringIcon className="  text-blue-500" />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">Monitoring</span>
          <span className="text-xs text-secondary">Giám sát hệ thống</span>
        </div>
      )
    },
    {
      // key: "administration",
      key: "#",
      icon: <AdministrationIcon className="  text-blue-500" />,
      label: (
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">Administration</span>
          <span className="text-xs text-secondary">Quản trị hệ thống</span>
        </div>
      )
    }
  ];

  // Update selected keys and open keys based on URL path
  useEffect(() => {
    if (!pathname) return;

    // Remove leading slash and get the first segment of the path
    const path = pathname.substring(1).split("/")[0];

    // Check if this is a direct menu item
    let newSelectedKeys = [path];
    let newOpenKeys: string[] = [...openKeys];

    // Check if this is a child menu item
    Object.entries(parentChildrenMap).forEach(([parent, children]) => {
      if (children.includes(path)) {
        // If it's a child, set both the child as selected and parent as open
        newSelectedKeys = [path];
        if (!collapsed && !newOpenKeys.includes(parent)) {
          newOpenKeys = [...newOpenKeys, parent];
        }
      }
    });

    setSelectedKeys(newSelectedKeys);
    setOpenKeys(newOpenKeys);
  }, [pathname, collapsed]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "#") return;
    router.push(`/${e.key}`);
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white shadow-lg" width={250}>
      <div
        className={`sidebar-container min-h-screen bg-white border-r border-gray-200 flex flex-col relative ${className} overflow-hidden`}
      >
        <div className="flex items-center p-4 w-full border-b border-gray-200 min-h-[86px]">
          {collapsed ? (
            <div className="bg-gray-100 rounded-l-xs p-1 font-medium text-base text-black">AIOps</div>
          ) : (
            <>
              <DatasetIcon />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-base text-black">AIOps Hub</span>
                <span className="text-xs text-secondary">AI & Data Hub</span>
              </div>
            </>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={collapsed ? [] : openKeys}
            onClick={handleMenuClick}
            onOpenChange={onOpenChange}
            className="!border-none"
            items={menuItems}
            style={{ backgroundColor: "transparent", fontSize: "14px", border: "none" }}
            inlineIndent={24}
            rootClassName={`sidebar-menu ${collapsed ? "collapsed" : ""}`}
          />
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
