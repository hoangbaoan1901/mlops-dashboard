// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { FiHome, FiMenu, FiX, FiSearch, FiPlus, FiUser, FiLogOut, FiEye, FiDatabase } from "react-icons/fi";
// import { MdScience, MdModelTraining, MdStorage, MdCloud, MdPublic, MdTableChart, MdSettings } from "react-icons/md";
// import { HiOutlineOfficeBuilding } from "react-icons/hi";
// import { BiTable, BiData } from "react-icons/bi";

// export default function CatalogPage() {
//   const [activeTab, setActiveTab] = useState("recents");
//   const [user, setUser] = useState<any>(null);
//   const [collapsed, setCollapsed] = useState(false);
//   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["organization", "workspace", "shared"]));
//   const [selectedItem, setSelectedItem] = useState("sales_data");
//   const router = useRouter();

//   const catalogStructure = {
//     organization: {
//       name: "Tổ chức của tôi",
//       type: "organization",
//       children: {
//         workspace: {
//           name: "workspace",
//           type: "catalog",
//           children: {
//             default: {
//               name: "default",
//               type: "schema",
//               children: {
//                 sales_data: { name: "sales_data", type: "table" },
//                 customer_info: { name: "customer_info", type: "table" },
//                 product_catalog: { name: "product_catalog", type: "view" },
//                 user_sessions: { name: "user_sessions", type: "table" }
//               }
//             },
//             analytics: {
//               name: "analytics",
//               type: "schema",
//               children: {
//                 monthly_reports: { name: "monthly_reports", type: "table" },
//                 kpi_dashboard: { name: "kpi_dashboard", type: "view" }
//               }
//             }
//           }
//         },
//         system: {
//           name: "system",
//           type: "catalog",
//           children: {
//             information_schema: {
//               name: "information_schema",
//               type: "schema",
//               children: {
//                 tables: { name: "tables", type: "system_table" },
//                 columns: { name: "columns", type: "system_table" }
//               }
//             },
//             logs: {
//               name: "logs",
//               type: "schema",
//               children: {
//                 audit_logs: { name: "audit_logs", type: "table" },
//                 query_history: { name: "query_history", type: "table" }
//               }
//             }
//           }
//         }
//       }
//     },
//     shared: {
//       name: "Dữ liệu được chia sẻ",
//       type: "shared",
//       children: {
//         public_datasets: {
//           name: "public_datasets",
//           type: "catalog",
//           children: {
//             samples: {
//               name: "samples",
//               type: "schema",
//               children: {
//                 nyc_taxi: { name: "nyc_taxi", type: "table" },
//                 covid_data: { name: "covid_data", type: "table" }
//               }
//             }
//           }
//         }
//       }
//     }
//   };

//   const recentTables = [
//     {
//       key: "1",
//       name: "sales_data",
//       lastViewed: "2 giờ trước",
//       type: "Bảng",
//       owner: "Nguyễn Văn A"
//     },
//     {
//       key: "2",
//       name: "customer_info",
//       lastViewed: "1 ngày trước",
//       type: "Bảng",
//       owner: "Trần Thị B"
//     },
//     {
//       key: "3",
//       name: "product_catalog",
//       lastViewed: "3 ngày trước",
//       type: "View",
//       owner: "Lê Văn C"
//     }
//   ];

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     } else {
//       router.push("/auth/login");
//     }
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     router.push("/auth/login");
//   };

//   const toggleFolder = (folderId: string) => {
//     const newExpanded = new Set(expandedFolders);
//     if (newExpanded.has(folderId)) {
//       newExpanded.delete(folderId);
//     } else {
//       newExpanded.add(folderId);
//     }
//     setExpandedFolders(newExpanded);
//   };

//   const selectItem = (itemId: string) => {
//     setSelectedItem(itemId);
//   };

//   const getItemIcon = (type: string) => {
//     switch (type) {
//       case "organization":
//         return <HiOutlineOfficeBuilding />;
//       case "shared":
//         return <MdPublic />;
//       case "catalog":
//         return <FiDatabase />;
//       case "schema":
//         return <MdStorage />;
//       case "table":
//         return <BiTable />;
//       case "view":
//         return <FiEye />;
//       case "system_table":
//         return <MdSettings />;
//       default:
//         return <BiData />;
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case "Bảng":
//         return "#155dfc";
//       case "View":
//         return "#52c41a";
//       default:
//         return "#666666";
//     }
//   };

//   const renderCatalogTree = (items: any, level = 0, parentPath = "") => {
//     return Object.entries(items).map(([key, item]: [string, any]) => {
//       const fullPath = parentPath ? `${parentPath}.${key}` : key;
//       const isExpanded = expandedFolders.has(fullPath);
//       const isSelected = selectedItem === key;
//       const indent = level * 20;

//       return (
//         <div key={fullPath}>
//           <div
//             style={{
//               marginLeft: `${indent}px`,
//               marginBottom: "4px",
//               padding: "8px 12px",
//               borderRadius: "8px",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               backgroundColor: isSelected ? "rgba(59, 130, 246, 0.1)" : "transparent",
//               color: isSelected ? "#3b82f6" : "#64748b",
//               fontWeight: isSelected ? "600" : "400",
//               transition: "all 0.2s ease",
//               border: isSelected ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid transparent"
//             }}
//             onClick={() => {
//               if (item.children) {
//                 toggleFolder(fullPath);
//               } else {
//                 selectItem(key);
//               }
//             }}
//             onMouseEnter={(e) => {
//               if (!isSelected) {
//                 e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.05)";
//                 e.currentTarget.style.borderColor = "rgba(100, 116, 139, 0.1)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!isSelected) {
//                 e.currentTarget.style.backgroundColor = "transparent";
//                 e.currentTarget.style.borderColor = "transparent";
//               }
//             }}
//           >
//             {item.children && (
//               <span style={{ fontSize: "12px", color: "#94a3b8", minWidth: "12px" }}>{isExpanded ? "▼" : "▶"}</span>
//             )}
//             <span style={{ fontSize: "16px" }}>{getItemIcon(item.type)}</span>
//             <span style={{ fontSize: "14px", flex: 1 }}>{item.name}</span>
//             {!item.children && (
//               <span
//                 style={{
//                   fontSize: "10px",
//                   padding: "2px 6px",
//                   borderRadius: "4px",
//                   backgroundColor: "rgba(100, 116, 139, 0.1)",
//                   color: "#64748b",
//                   textTransform: "uppercase",
//                   fontWeight: "500"
//                 }}
//               >
//                 {item.type}
//               </span>
//             )}
//           </div>
//           {item.children && isExpanded && <div>{renderCatalogTree(item.children, level + 1, fullPath)}</div>}
//         </div>
//       );
//     });
//   };

//   if (!user) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
//         <div>Đang tải...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       {/* Main Content */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {/* Header */}
//         <div
//           style={{
//             padding: "0 24px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             background: "#ffffff",
//             borderBottom: "1px solid #f0f0f0",
//             height: "64px"
//           }}
//         >
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             style={{
//               fontSize: 18,
//               background: "none",
//               border: "none",
//               cursor: "pointer"
//             }}
//           >
//             {collapsed ? <FiMenu /> : <FiX />}
//           </button>

//           <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 cursor: "pointer",
//                 padding: "8px 12px",
//                 borderRadius: 8
//               }}
//             >
//               <div
//                 style={{
//                   width: 32,
//                   height: 32,
//                   borderRadius: "50%",
//                   backgroundColor: "#155dfc",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "white",
//                   fontSize: 14
//                 }}
//               >
//                 <FiUser />
//               </div>
//               <span style={{ color: "#333333" }}>{user?.name || user?.email}</span>
//               <button
//                 onClick={handleLogout}
//                 style={{
//                   marginLeft: "8px",
//                   padding: "4px 8px",
//                   backgroundColor: "#ff4d4f",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   fontSize: "12px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "4px"
//                 }}
//               >
//                 <FiLogOut />
//                 Đăng xuất
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div style={{ flex: 1, backgroundColor: "#f5f5f5", padding: "24px" }}>
//           <div style={{ marginBottom: "24px" }}>
//             <div
//               style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}
//             >
//               <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333333", margin: 0 }}>Danh mục</h1>
//               <div style={{ display: "flex", gap: "8px" }}>
//                 <button
//                   style={{
//                     padding: "8px 16px",
//                     backgroundColor: "#f5f5f5",
//                     border: "1px solid #d9d9d9",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "4px"
//                   }}
//                 >
//                   <FiPlus />
//                   Thêm dữ liệu
//                 </button>
//                 <button
//                   style={{
//                     padding: "8px 16px",
//                     backgroundColor: "#155dfc",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "4px"
//                   }}
//                 >
//                   <MdTableChart />
//                   Tạo bảng
//                 </button>
//               </div>
//             </div>

//             {/* Quick Access Tabs */}
//             <div
//               style={{
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//                 border: "1px solid #e0e0e0",
//                 marginBottom: "16px"
//               }}
//             >
//               <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
//                 <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
//                   <button
//                     onClick={() => setActiveTab("recents")}
//                     style={{
//                       padding: "8px 16px",
//                       backgroundColor: activeTab === "recents" ? "#155dfc" : "transparent",
//                       color: activeTab === "recents" ? "white" : "#333333",
//                       border: activeTab === "recents" ? "none" : "1px solid #d9d9d9",
//                       borderRadius: "6px",
//                       cursor: "pointer",
//                       fontSize: "14px"
//                     }}
//                   >
//                     Gần đây
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("favorites")}
//                     style={{
//                       padding: "8px 16px",
//                       backgroundColor: activeTab === "favorites" ? "#155dfc" : "transparent",
//                       color: activeTab === "favorites" ? "white" : "#333333",
//                       border: activeTab === "favorites" ? "none" : "1px solid #d9d9d9",
//                       borderRadius: "6px",
//                       cursor: "pointer",
//                       fontSize: "14px"
//                     }}
//                   >
//                     Yêu thích
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("catalogs")}
//                     style={{
//                       padding: "8px 16px",
//                       backgroundColor: activeTab === "catalogs" ? "#155dfc" : "transparent",
//                       color: activeTab === "catalogs" ? "white" : "#333333",
//                       border: activeTab === "catalogs" ? "none" : "1px solid #d9d9d9",
//                       borderRadius: "6px",
//                       cursor: "pointer",
//                       fontSize: "14px"
//                     }}
//                   >
//                     Danh mục
//                   </button>
//                 </div>
//                 <div style={{ position: "relative", width: "400px" }}>
//                   <FiSearch
//                     style={{
//                       position: "absolute",
//                       left: "12px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       color: "#9ca3af"
//                     }}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Tìm kiếm dữ liệu, notebooks, recents..."
//                     style={{
//                       width: "100%",
//                       padding: "8px 12px 8px 36px",
//                       border: "1px solid #d9d9d9",
//                       borderRadius: "6px",
//                       fontSize: "14px"
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "24px" }}>
//             {/* Interactive Catalog Tree */}
//             <div>
//               <div
//                 style={{
//                   backgroundColor: "white",
//                   borderRadius: "12px",
//                   boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                   padding: "20px",
//                   border: "1px solid #e2e8f0"
//                 }}
//               >
//                 <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#1e293b" }}>
//                   Cấu trúc danh mục
//                 </h3>
//                 <div style={{ fontSize: "14px", lineHeight: "1.6" }}>{renderCatalogTree(catalogStructure)}</div>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div>
//               {activeTab === "recents" && (
//                 <div
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                     padding: "24px",
//                     border: "1px solid #e2e8f0"
//                   }}
//                 >
//                   <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "#1e293b" }}>
//                     Truy cập nhanh
//                   </h3>

//                   {recentTables.length === 0 ? (
//                     <div style={{ textAlign: "center", padding: "48px 0" }}>
//                       <div style={{ color: "#d9d9d9", marginBottom: "16px", fontSize: "48px" }}>
//                         <FiDatabase />
//                       </div>
//                       <p style={{ color: "#666666" }}>
//                         Chưa có bảng gần đây nào, hãy bắt đầu khám phá để xem bảng gần đây của bạn tại đây.
//                       </p>
//                     </div>
//                   ) : (
//                     <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                       <thead>
//                         <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
//                           <th
//                             style={{
//                               padding: "16px 12px",
//                               textAlign: "left",
//                               fontWeight: "700",
//                               color: "#1e293b",
//                               fontSize: "14px"
//                             }}
//                           >
//                             Tên
//                           </th>
//                           <th
//                             style={{
//                               padding: "16px 12px",
//                               textAlign: "left",
//                               fontWeight: "700",
//                               color: "#1e293b",
//                               fontSize: "14px"
//                             }}
//                           >
//                             Lần xem cuối
//                           </th>
//                           <th
//                             style={{
//                               padding: "16px 12px",
//                               textAlign: "left",
//                               fontWeight: "700",
//                               color: "#1e293b",
//                               fontSize: "14px"
//                             }}
//                           >
//                             Loại
//                           </th>
//                           <th
//                             style={{
//                               padding: "16px 12px",
//                               textAlign: "left",
//                               fontWeight: "700",
//                               color: "#1e293b",
//                               fontSize: "14px"
//                             }}
//                           >
//                             Chủ sở hữu
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {recentTables.map((table) => (
//                           <tr
//                             key={table.key}
//                             style={{
//                               borderBottom: "1px solid #f1f5f9",
//                               transition: "all 0.2s ease",
//                               cursor: "pointer"
//                             }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.backgroundColor = "#f8fafc";
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.backgroundColor = "transparent";
//                             }}
//                           >
//                             <td style={{ padding: "16px 12px" }}>
//                               <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                                 <span style={{ fontSize: "16px" }}>
//                                   <BiTable />
//                                 </span>
//                                 <span style={{ fontWeight: "600", color: "#3b82f6", fontSize: "14px" }}>
//                                   {table.name}
//                                 </span>
//                               </div>
//                             </td>
//                             <td style={{ padding: "16px 12px", color: "#64748b", fontSize: "14px" }}>
//                               {table.lastViewed}
//                             </td>
//                             <td style={{ padding: "16px 12px" }}>
//                               <span
//                                 style={{
//                                   padding: "6px 12px",
//                                   borderRadius: "6px",
//                                   fontSize: "12px",
//                                   fontWeight: "600",
//                                   backgroundColor: getTypeColor(table.type) + "20",
//                                   color: getTypeColor(table.type)
//                                 }}
//                               >
//                                 {table.type}
//                               </span>
//                             </td>
//                             <td style={{ padding: "16px 12px", color: "#64748b", fontSize: "14px" }}>{table.owner}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               )}

//               {activeTab === "favorites" && (
//                 <div
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                     padding: "24px",
//                     border: "1px solid #e2e8f0"
//                   }}
//                 >
//                   <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "#1e293b" }}>
//                     Yêu thích
//                   </h3>
//                   <div style={{ textAlign: "center", padding: "48px 0" }}>
//                     <div style={{ color: "#d9d9d9", marginBottom: "16px", fontSize: "48px" }}>⭐</div>
//                     <p style={{ color: "#666666" }}>Chưa có mục yêu thích nào.</p>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "catalogs" && (
//                 <div
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                     padding: "24px",
//                     border: "1px solid #e2e8f0"
//                   }}
//                 >
//                   <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "#1e293b" }}>
//                     Danh mục
//                   </h3>
//                   <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//                     <div
//                       style={{
//                         border: "1px solid #e2e8f0",
//                         borderRadius: "12px",
//                         padding: "20px",
//                         transition: "all 0.2s ease",
//                         cursor: "pointer"
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.borderColor = "#3b82f6";
//                         e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.1)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.borderColor = "#e2e8f0";
//                         e.currentTarget.style.boxShadow = "none";
//                       }}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
//                         <span style={{ fontSize: "20px" }}>
//                           <FiDatabase />
//                         </span>
//                         <h4 style={{ fontWeight: "600", margin: 0, color: "#1e293b", fontSize: "16px" }}>workspace</h4>
//                       </div>
//                       <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px", lineHeight: "1.5" }}>
//                         Danh mục chính cho dữ liệu workspace
//                       </p>
//                       <div style={{ display: "flex", gap: "12px" }}>
//                         <span
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             fontSize: "12px",
//                             backgroundColor: "#f1f5f9",
//                             color: "#64748b",
//                             fontWeight: "500"
//                           }}
//                         >
//                           2 schemas
//                         </span>
//                         <span
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             fontSize: "12px",
//                             backgroundColor: "#f1f5f9",
//                             color: "#64748b",
//                             fontWeight: "500"
//                           }}
//                         >
//                           15 tables
//                         </span>
//                       </div>
//                     </div>

//                     <div
//                       style={{
//                         border: "1px solid #e2e8f0",
//                         borderRadius: "12px",
//                         padding: "20px",
//                         transition: "all 0.2s ease",
//                         cursor: "pointer"
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.borderColor = "#3b82f6";
//                         e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.1)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.borderColor = "#e2e8f0";
//                         e.currentTarget.style.boxShadow = "none";
//                       }}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
//                         <span style={{ fontSize: "20px" }}>
//                           <MdSettings />
//                         </span>
//                         <h4 style={{ fontWeight: "600", margin: 0, color: "#1e293b", fontSize: "16px" }}>system</h4>
//                       </div>
//                       <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px", lineHeight: "1.5" }}>
//                         Dữ liệu hệ thống và logs
//                       </p>
//                       <div style={{ display: "flex", gap: "12px" }}>
//                         <span
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             fontSize: "12px",
//                             backgroundColor: "#f1f5f9",
//                             color: "#64748b",
//                             fontWeight: "500"
//                           }}
//                         >
//                           1 schema
//                         </span>
//                         <span
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             fontSize: "12px",
//                             backgroundColor: "#f1f5f9",
//                             color: "#64748b",
//                             fontWeight: "500"
//                           }}
//                         >
//                           8 tables
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiPlus, FiEye, FiDatabase } from "react-icons/fi";
import { MdStorage, MdTableChart } from "react-icons/md";
import { BiTable, BiData } from "react-icons/bi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("catalogs");
  const [user, setUser] = useState<any>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["organization", "workspace", "shared"]));
  const [selectedItem, setSelectedItem] = useState("sales_data");
  const router = useRouter();

  const catalogStructure = {
    organization: {
      name: "Tổ chức của tôi",
      type: "organization",
      children: {
        workspace: {
          name: "workspace",
          type: "catalog",
          children: {
            default: {
              name: "default",
              type: "schema",
              children: {
                sales_data: { name: "sales_data", type: "table" },
                customer_info: { name: "customer_info", type: "table" },
                product_catalog: { name: "product_catalog", type: "view" },
                user_sessions: { name: "user_sessions", type: "table" }
              }
            },
            analytics: {
              name: "analytics",
              type: "schema",
              children: {
                monthly_reports: { name: "monthly_reports", type: "table" },
                kpi_dashboard: { name: "kpi_dashboard", type: "view" }
              }
            }
          }
        },
        system: {
          name: "system",
          type: "catalog",
          children: {
            information_schema: {
              name: "information_schema",
              type: "schema",
              children: {
                tables: { name: "tables", type: "system_table" },
                columns: { name: "columns", type: "system_table" }
              }
            },
            logs: {
              name: "logs",
              type: "schema",
              children: {
                audit_logs: { name: "audit_logs", type: "table" },
                query_history: { name: "query_history", type: "table" }
              }
            }
          }
        }
      }
    },
    shared: {
      name: "Dữ liệu được chia sẻ",
      type: "shared",
      children: {
        public_datasets: {
          name: "public_datasets",
          type: "catalog",
          children: {
            samples: {
              name: "samples",
              type: "schema",
              children: {
                nyc_taxi: { name: "nyc_taxi", type: "table" },
                covid_data: { name: "covid_data", type: "table" }
              }
            }
          }
        }
      }
    }
  };

  const recentTables = [
    {
      key: "1",
      name: "sales_data",
      lastViewed: "2 giờ trước",
      type: "Bảng",
      owner: "Nguyễn Văn A",
      schema: "default",
      catalog: "workspace",
      rows: "1.2M",
      size: "345MB"
    },
    {
      key: "2",
      name: "customer_info",
      lastViewed: "1 ngày trước",
      type: "Bảng",
      owner: "Trần Thị B",
      schema: "default",
      catalog: "workspace",
      rows: "450K",
      size: "120MB"
    },
    {
      key: "3",
      name: "nyc_taxi",
      lastViewed: "3 ngày trước",
      type: "Bảng",
      owner: "System",
      schema: "samples",
      catalog: "public_datasets",
      rows: "22.5M",
      size: "4.5GB"
    }
  ];

  const favoriteTables = [];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderCatalogItem = (item: any, key: string, path: string, level: number = 0) => {
    const isExpanded = expandedFolders.has(path);
    const isSelected = selectedItem === key;
    const hasChildren = item.children && Object.keys(item.children).length > 0;

    const getIcon = () => {
      switch (item.type) {
        case "organization":
          return <HiOutlineOfficeBuilding className="text-gray-500" />;
        case "catalog":
          return <FiDatabase className="text-blue-500" />;
        case "schema":
          return <MdStorage className="text-purple-500" />;
        case "table":
          return <BiTable className="text-green-500" />;
        case "view":
          return <MdTableChart className="text-orange-500" />;
        case "system_table":
          return <BiData className="text-gray-500" />;
        default:
          return <FiDatabase className="text-gray-500" />;
      }
    };

    return (
      <div key={key} className="mb-1">
        <div
          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer
            ${isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-800"}
          `}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            setSelectedItem(key);
            if (hasChildren) {
              toggleFolder(path);
            }
          }}
        >
          {hasChildren && (
            <span className="mr-2 text-gray-400">
              {isExpanded ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              )}
            </span>
          )}
          <span className="mr-2">{getIcon()}</span>
          <span className="text-sm font-medium">{item.name}</span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {Object.entries(item.children).map(([childKey, childItem]: [string, any]) => {
              return renderCatalogItem(childItem, childKey, `${path}.${childKey}`, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 h-full">
      <div className="flex h-full">
        {/* Left sidebar - Catalog browser */}
        <div className="w-72 bg-white border-r border-gray-200 p-4 h-full overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Catalogs</h2>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
              <FiPlus />
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm catalog"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            {Object.entries(catalogStructure).map(([key, item]: [string, any]) => {
              return renderCatalogItem(item, key, key);
            })}
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Data Catalogs</h1>
            <p className="text-gray-500">Quản lý và khám phá dữ liệu</p>
          </div>

          <div className="flex items-center mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-200 gap-4">
            <div
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all
                ${
                  activeTab === "recents"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("recents")}
            >
              Gần đây
            </div>
            <div
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all
                ${
                  activeTab === "favorites"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("favorites")}
            >
              Yêu thích
            </div>
            <div
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all
                ${
                  activeTab === "catalogs"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("catalogs")}
            >
              Danh mục
            </div>
          </div>

          {activeTab === "recents" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catalog
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kích thước
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xem gần đây
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTables.map((table) => (
                    <tr key={table.key} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                            <BiTable size={18} />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{table.name}</div>
                            <div className="text-xs text-gray-500">Sở hữu: {table.owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{table.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.schema}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.catalog}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.rows}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.lastViewed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có bảng yêu thích nào</h3>
                <p className="text-gray-500 mb-6">Đánh dấu bảng yêu thích để truy cập nhanh</p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100">
                  Khám phá dữ liệu
                </button>
              </div>
            </div>
          )}

          {activeTab === "catalogs" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catalog
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kích thước
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chủ sở hữu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(catalogStructure).flatMap(([_, catalogEntry]: [string, any]) => {
                    if (catalogEntry.children) {
                      return Object.entries(catalogEntry.children).flatMap(([_, catalog]: [string, any]) => {
                        if (catalog.children) {
                          return Object.entries(catalog.children).flatMap(([_, schema]: [string, any]) => {
                            if (schema.children) {
                              return Object.entries(schema.children).map(([key, table]: [string, any]) => {
                                return (
                                  <tr key={key} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                          <BiTable size={18} />
                                        </div>
                                        <div className="ml-3">
                                          <div className="text-sm font-medium text-gray-900">{table.name}</div>
                                          <div className="text-xs text-gray-500">Sở hữu: System</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {table.type === "table" ? "Bảng" : "View"}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schema.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {catalog.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">System</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <button className="text-primary hover:text-blue-800 p-1">
                                        <FiEye size={18} />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            }
                            return [];
                          });
                        }
                        return [];
                      });
                    }
                    return [];
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
