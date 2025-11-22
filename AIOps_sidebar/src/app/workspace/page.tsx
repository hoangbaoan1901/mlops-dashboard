// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   FiHome,
//   FiMenu,
//   FiX,
//   FiPlay,
//   FiSave,
//   FiPlus,
//   FiFolder,
//   FiFile,
//   FiTerminal,
//   FiUser,
//   FiLogOut
// } from "react-icons/fi";
// import { MdScience, MdModelTraining, MdStorage, MdCloud } from "react-icons/md";
// import { SiJupyter, SiApacheparquet } from "react-icons/si";
// import { VscJson } from "react-icons/vsc";
// import { BiData } from "react-icons/bi";

// export default function WorkspacePage() {
//   const [activeTab, setActiveTab] = useState("notebook");
//   const [notebooks, setNotebooks] = useState([
//     {
//       key: "notebook1",
//       title: "Notebook mới",
//       content: '# Notebook Python\nprint("Xin chào DataBricks!")'
//     }
//   ]);
//   const [activeNotebook, setActiveNotebook] = useState("notebook1");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [newNotebookName, setNewNotebookName] = useState("");
//   const [user, setUser] = useState<any>(null);
//   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["workspace", "notebooks", "datasets"]));
//   const [selectedFile, setSelectedFile] = useState("analysis.ipynb");
//   const router = useRouter();

//   const folderStructure = {
//     workspace: {
//       name: "Không gian làm việc",
//       type: "folder",
//       children: {
//         notebooks: {
//           name: "Notebooks",
//           type: "folder",
//           children: {
//             "analysis.ipynb": {
//               name: "Phân tích dữ liệu.ipynb",
//               type: "notebook"
//             },
//             "ml.ipynb": { name: "Machine Learning.ipynb", type: "notebook" },
//             "visualization.ipynb": {
//               name: "Trực quan hóa.ipynb",
//               type: "notebook"
//             }
//           }
//         },
//         datasets: {
//           name: "Datasets",
//           type: "folder",
//           children: {
//             "sales_data.csv": { name: "sales_data.csv", type: "csv" },
//             "customer_info.json": { name: "customer_info.json", type: "json" },
//             "product_catalog.parquet": {
//               name: "product_catalog.parquet",
//               type: "parquet"
//             }
//           }
//         },
//         models: {
//           name: "Models",
//           type: "folder",
//           children: {
//             "regression_model.pkl": {
//               name: "regression_model.pkl",
//               type: "model"
//             },
//             "classification_model.joblib": {
//               name: "classification_model.joblib",
//               type: "model"
//             }
//           }
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     } else {
//       router.push("/auth/login");
//     }
//   }, [router]);

//   const handleRunCode = () => {
//     alert("Đang chạy code...");
//   };

//   const handleSaveNotebook = () => {
//     alert("Notebook đã được lưu!");
//   };

//   const handleCreateNotebook = () => {
//     if (newNotebookName.trim()) {
//       const newKey = `notebook${Date.now()}`;
//       setNotebooks([
//         ...notebooks,
//         {
//           key: newKey,
//           title: newNotebookName,
//           content: "# Notebook mới\n# Bắt đầu viết code của bạn ở đây"
//         }
//       ]);
//       setActiveNotebook(newKey);
//       setNewNotebookName("");
//       setIsModalVisible(false);
//       alert("Notebook mới đã được tạo!");
//     }
//   };

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

//   const selectFile = (fileId: string) => {
//     setSelectedFile(fileId);
//   };

//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case "folder":
//         return <FiFolder />;
//       case "notebook":
//         return <SiJupyter />;
//       case "csv":
//         return <BiData />;
//       case "json":
//         return <VscJson />;
//       case "parquet":
//         return <SiApacheparquet />;
//       case "model":
//         return <MdModelTraining />;
//       default:
//         return <FiFile />;
//     }
//   };

//   const renderFolderTree = (items: any, level = 0, parentPath = "") => {
//     return Object.entries(items).map(([key, item]: [string, any]) => {
//       const fullPath = parentPath ? `${parentPath}.${key}` : key;
//       const isExpanded = expandedFolders.has(fullPath);
//       const isSelected = selectedFile === key;
//       const indent = level * 20;

//       return (
//         <div key={fullPath}>
//           <div
//             style={{
//               marginLeft: `${indent}px`,
//               marginBottom: "4px",
//               padding: "6px 8px",
//               borderRadius: "6px",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               backgroundColor: isSelected ? "rgba(59, 130, 246, 0.1)" : "transparent",
//               color: isSelected ? "#3b82f6" : "#64748b",
//               fontWeight: isSelected ? "600" : "400",
//               transition: "all 0.2s ease"
//             }}
//             onClick={() => {
//               if (item.type === "folder") {
//                 toggleFolder(fullPath);
//               } else {
//                 selectFile(key);
//               }
//             }}
//             onMouseEnter={(e) => {
//               if (!isSelected) {
//                 e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!isSelected) {
//                 e.currentTarget.style.backgroundColor = "transparent";
//               }
//             }}
//           >
//             {item.type === "folder" && (
//               <span style={{ fontSize: "12px", color: "#94a3b8" }}>{isExpanded ? "▼" : "▶"}</span>
//             )}
//             <span style={{ fontSize: "16px" }}>{getFileIcon(item.type)}</span>
//             <span style={{ fontSize: "14px" }}>{item.name}</span>
//           </div>
//           {item.type === "folder" && isExpanded && item.children && (
//             <div>{renderFolderTree(item.children, level + 1, fullPath)}</div>
//           )}
//         </div>
//       );
//     });
//   };

//   const currentNotebook = notebooks.find((nb) => nb.key === activeNotebook);

//   const cells = [
//     {
//       id: 1,
//       type: "code",
//       content: 'import pandas as pd\nimport numpy as np\n\nprint("Xin chào DataBricks!")'
//     },
//     {
//       id: 2,
//       type: "code",
//       content:
//         '# Tạo dữ liệu mẫu\ndata = pd.DataFrame({\n    "tên": ["An", "Bình", "Chi"],\n    "tuổi": [25, 30, 28]\n})\nprint(data)'
//     }
//   ];

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center min-h-screen linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
//         <div
//           style={{
//             width: "40px",
//             height: "40px",
//             border: "4px solid #f3f3f3",
//             borderTop: "4px solid #3498db",
//             borderRadius: "50%",
//             animation: "spin 1s linear infinite"
//           }}
//         ></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-[#f8fafc]">
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {/* Content */}
//         <div style={{ flex: 1, display: "flex" }}>
//           {/* Interactive File Explorer */}
//           <div
//             style={{
//               width: 350,
//               background: "white",
//               borderRight: "1px solid #e2e8f0",
//               display: "flex",
//               flexDirection: "column"
//             }}
//           >
//             <div style={{ padding: 24, borderBottom: "1px solid #f1f5f9" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 20
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: 18,
//                     fontWeight: 700,
//                     margin: 0,
//                     color: "#1e293b"
//                   }}
//                 >
//                   Thư mục dự án
//                 </h3>
//                 <button
//                   onClick={() => setIsModalVisible(true)}
//                   style={{
//                     padding: "8px 16px",
//                     background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "8px",
//                     cursor: "pointer",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                     transition: "all 0.2s ease",
//                     boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "4px"
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-1px)";
//                     e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.2)";
//                   }}
//                 >
//                   <FiPlus />
//                   Tạo mới
//                 </button>
//               </div>

//               {/* Interactive Folder Tree */}
//               <div style={{ fontSize: "14px", lineHeight: "1.6" }}>{renderFolderTree(folderStructure)}</div>
//             </div>
//           </div>

//           {/* Notebook Area */}
//           <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//             <div
//               style={{
//                 background: "white",
//                 borderBottom: "1px solid #e2e8f0",
//                 padding: 24
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between"
//                 }}
//               >
//                 <h2
//                   style={{
//                     fontSize: 24,
//                     fontWeight: 700,
//                     margin: 0,
//                     color: "#1e293b"
//                   }}
//                 >
//                   {currentNotebook?.title}
//                 </h2>
//                 <div style={{ display: "flex", gap: 12 }}>
//                   <button
//                     onClick={handleRunCode}
//                     style={{
//                       padding: "12px 20px",
//                       background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "10px",
//                       cursor: "pointer",
//                       fontWeight: "600",
//                       fontSize: "14px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       transition: "all 0.2s ease",
//                       boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)"
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = "translateY(-1px)";
//                       e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = "translateY(0)";
//                       e.currentTarget.style.boxShadow = "0 2px 4px rgba(16, 185, 129, 0.2)";
//                     }}
//                   >
//                     <FiPlay />
//                     Chạy tất cả
//                   </button>
//                   <button
//                     onClick={handleSaveNotebook}
//                     style={{
//                       padding: "12px 20px",
//                       background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "10px",
//                       cursor: "pointer",
//                       fontWeight: "600",
//                       fontSize: "14px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       transition: "all 0.2s ease",
//                       boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)"
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = "translateY(-1px)";
//                       e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = "translateY(0)";
//                       e.currentTarget.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.2)";
//                     }}
//                   >
//                     <FiSave />
//                     Lưu
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Modern Tabs */}
//             <div style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}>
//               <div style={{ display: "flex", padding: "0 24px" }}>
//                 {[
//                   { key: "notebook", icon: <SiJupyter />, label: "Notebook" },
//                   { key: "terminal", icon: <FiTerminal />, label: "Terminal" }
//                 ].map((tab) => (
//                   <button
//                     key={tab.key}
//                     onClick={() => setActiveTab(tab.key)}
//                     style={{
//                       padding: "16px 24px",
//                       background:
//                         activeTab === tab.key ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "transparent",
//                       color: activeTab === tab.key ? "white" : "#64748b",
//                       border: "none",
//                       cursor: "pointer",
//                       fontWeight: "600",
//                       fontSize: "14px",
//                       borderRadius: "12px 12px 0 0",
//                       transition: "all 0.2s ease",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       marginRight: "4px"
//                     }}
//                     onMouseEnter={(e) => {
//                       if (activeTab !== tab.key) {
//                         e.currentTarget.style.background = "#f1f5f9";
//                         e.currentTarget.style.color = "#1e293b";
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (activeTab !== tab.key) {
//                         e.currentTarget.style.background = "transparent";
//                         e.currentTarget.style.color = "#64748b";
//                       }
//                     }}
//                   >
//                     <span>{tab.icon}</span>
//                     {tab.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div style={{ flex: 1, overflow: "auto" }}>
//               {activeTab === "notebook" && (
//                 <div style={{ height: "100%", background: "#f8fafc", padding: 24 }}>
//                   <div
//                     style={{
//                       maxWidth: 1200,
//                       margin: "0 auto",
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: 20
//                     }}
//                   >
//                     {cells.map((cell) => (
//                       <div
//                         key={cell.id}
//                         style={{
//                           background: "white",
//                           borderRadius: "16px",
//                           padding: 24,
//                           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                           border: "1px solid #e2e8f0",
//                           transition: "all 0.2s ease"
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.boxShadow =
//                             "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
//                           e.currentTarget.style.transform = "translateY(-2px)";
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.boxShadow =
//                             "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
//                           e.currentTarget.style.transform = "translateY(0)";
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "flex-start",
//                             gap: 20
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <div
//                               style={{
//                                 background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
//                                 color: "#10b981",
//                                 padding: 20,
//                                 borderRadius: "12px",
//                                 fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                                 fontSize: 14,
//                                 lineHeight: "1.6",
//                                 border: "1px solid #374151"
//                               }}
//                             >
//                               <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{cell.content}</pre>
//                             </div>
//                             <div
//                               style={{
//                                 marginTop: 12,
//                                 padding: 16,
//                                 background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//                                 borderRadius: "8px",
//                                 borderLeft: "4px solid #3b82f6",
//                                 border: "1px solid #e2e8f0"
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   fontSize: 12,
//                                   color: "#64748b",
//                                   marginBottom: 8,
//                                   fontWeight: "600",
//                                   textTransform: "uppercase",
//                                   letterSpacing: "0.05em"
//                                 }}
//                               >
//                                 Kết quả:
//                               </div>
//                               <pre
//                                 style={{
//                                   fontSize: 14,
//                                   margin: 0,
//                                   color: "#1e293b",
//                                   fontFamily: "'JetBrains Mono', monospace"
//                                 }}
//                               >
//                                 {cell.id === 1
//                                   ? "Xin chào DataBricks!"
//                                   : cell.id === 2
//                                   ? "   tên  tuổi\n0   An    25\n1 Bình    30\n2  Chi    28"
//                                   : ""}
//                               </pre>
//                             </div>
//                           </div>
//                           <div>
//                             <button
//                               onClick={() => console.log(`Chạy cell ${cell.id}`)}
//                               style={{
//                                 padding: "10px 16px",
//                                 background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                                 color: "white",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 cursor: "pointer",
//                                 fontSize: "12px",
//                                 fontWeight: "600",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "6px",
//                                 transition: "all 0.2s ease",
//                                 boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)"
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.transform = "translateY(-1px)";
//                                 e.currentTarget.style.boxShadow = "0 4px 8px rgba(16, 185, 129, 0.3)";
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.transform = "translateY(0)";
//                                 e.currentTarget.style.boxShadow = "0 2px 4px rgba(16, 185, 129, 0.2)";
//                               }}
//                             >
//                               <FiPlay />
//                               Chạy
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     <div style={{ textAlign: "center" }}>
//                       <button
//                         style={{
//                           width: "100%",
//                           height: 60,
//                           background: "white",
//                           border: "2px dashed #cbd5e1",
//                           borderRadius: "12px",
//                           cursor: "pointer",
//                           color: "#64748b",
//                           fontSize: "14px",
//                           fontWeight: "500",
//                           transition: "all 0.2s ease",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: "8px"
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.borderColor = "#3b82f6";
//                           e.currentTarget.style.color = "#3b82f6";
//                           e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)";
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.borderColor = "#cbd5e1";
//                           e.currentTarget.style.color = "#64748b";
//                           e.currentTarget.style.background = "white";
//                         }}
//                       >
//                         <FiPlus style={{ fontSize: "18px" }} />
//                         Thêm ô code mới
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "terminal" && (
//                 <div
//                   style={{
//                     height: "100%",
//                     background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
//                     color: "#10b981",
//                     fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                     padding: 24
//                   }}
//                 >
//                   <div style={{ marginBottom: 20 }}>
//                     <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>
//                       $ Chào mừng đến với DataBricks Terminal
//                     </div>
//                     <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>
//                       $ Gõ "help" để xem danh sách lệnh có sẵn
//                     </div>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <span
//                       style={{
//                         fontSize: 14,
//                         marginRight: 12,
//                         color: "#3b82f6",
//                         fontWeight: "bold"
//                       }}
//                     >
//                       $
//                     </span>
//                     <input
//                       style={{
//                         background: "transparent",
//                         border: "none",
//                         color: "#10b981",
//                         fontFamily: "'JetBrains Mono', monospace",
//                         fontSize: 14,
//                         outline: "none",
//                         flex: 1,
//                         padding: "8px 0"
//                       }}
//                       placeholder="Nhập lệnh..."
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Modern Modal */}
//         {isModalVisible && (
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: "rgba(0, 0, 0, 0.6)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 1000,
//               backdropFilter: "blur(4px)"
//             }}
//           >
//             <div
//               style={{
//                 background: "white",
//                 padding: "32px",
//                 borderRadius: "20px",
//                 minWidth: "500px",
//                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//                 border: "1px solid #e2e8f0"
//               }}
//             >
//               <h3
//                 style={{
//                   marginBottom: "24px",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                   color: "#1e293b"
//                 }}
//               >
//                 Tạo Notebook mới
//               </h3>
//               <input
//                 type="text"
//                 value={newNotebookName}
//                 onChange={(e) => setNewNotebookName(e.target.value)}
//                 placeholder="Nhập tên notebook"
//                 style={{
//                   width: "100%",
//                   padding: "16px",
//                   border: "2px solid #e2e8f0",
//                   borderRadius: "12px",
//                   marginBottom: "24px",
//                   fontSize: "14px",
//                   transition: "all 0.2s ease",
//                   outline: "none"
//                 }}
//                 onFocus={(e) => {
//                   e.currentTarget.style.borderColor = "#3b82f6";
//                   e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
//                 }}
//                 onBlur={(e) => {
//                   e.currentTarget.style.borderColor = "#e2e8f0";
//                   e.currentTarget.style.boxShadow = "none";
//                 }}
//               />
//               <div
//                 style={{
//                   display: "flex",
//                   gap: "12px",
//                   justifyContent: "flex-end"
//                 }}
//               >
//                 <button
//                   onClick={() => setIsModalVisible(false)}
//                   style={{
//                     padding: "12px 24px",
//                     background: "#f8fafc",
//                     border: "2px solid #e2e8f0",
//                     borderRadius: "10px",
//                     cursor: "pointer",
//                     fontWeight: "600",
//                     color: "#64748b",
//                     transition: "all 0.2s ease"
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = "#f1f5f9";
//                     e.currentTarget.style.borderColor = "#cbd5e1";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "#f8fafc";
//                     e.currentTarget.style.borderColor = "#e2e8f0";
//                   }}
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   onClick={handleCreateNotebook}
//                   style={{
//                     padding: "12px 24px",
//                     background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "10px",
//                     cursor: "pointer",
//                     fontWeight: "600",
//                     transition: "all 0.2s ease",
//                     boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)"
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-1px)";
//                     e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.2)";
//                   }}
//                 >
//                   Tạo
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlay, FiSave, FiPlus, FiFolder, FiFile, FiTerminal } from "react-icons/fi";
import { SiJupyter, SiApacheparquet } from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { BiData } from "react-icons/bi";
import { Button } from "antd";
import CreateNotebookModal from "./components/CreateNotebookModal";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("notebook");
  const [notebooks, setNotebooks] = useState([
    {
      key: "notebook1",
      title: "Notebook mới",
      content: '# Notebook Python\nprint("Xin chào DataBricks!")'
    }
  ]);
  const [activeNotebook, setActiveNotebook] = useState("notebook1");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["workspace", "notebooks", "datasets"]));
  const [selectedFile, setSelectedFile] = useState("analysis.ipynb");
  const router = useRouter();

  const folderStructure = {
    workspace: {
      name: "Không gian làm việc",
      type: "folder",
      children: {
        notebooks: {
          name: "Notebooks",
          type: "folder",
          children: {
            "analysis.ipynb": {
              name: "Phân tích dữ liệu.ipynb",
              type: "notebook"
            },
            "ml.ipynb": { name: "Machine Learning.ipynb", type: "notebook" },
            "visualization.ipynb": {
              name: "Trực quan hóa.ipynb",
              type: "notebook"
            }
          }
        },
        datasets: {
          name: "Datasets",
          type: "folder",
          children: {
            "sales_data.csv": { name: "sales_data.csv", type: "csv" },
            "customer_info.json": { name: "customer_info.json", type: "json" },
            "product_catalog.parquet": {
              name: "product_catalog.parquet",
              type: "parquet"
            }
          }
        },
        models: {
          name: "Models",
          type: "folder",
          children: {
            "regression_model.pkl": {
              name: "regression_model.pkl",
              type: "model"
            },
            "classification_model.joblib": {
              name: "classification_model.joblib",
              type: "model"
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const handleRunCode = () => {
    console.log("Running all code...");
  };

  const handleCreateNotebook = (name: string, language: string) => {
    console.log(`Creating new notebook: ${name} with language: ${language}`);
    const newKey = `notebook${Date.now()}`;
    setNotebooks([
      ...notebooks,
      {
        key: newKey,
        title: name,
        content: `# ${name}\n# Language: ${language}\n\n# Start coding here`
      }
    ]);
    setActiveNotebook(newKey);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <FiFolder className="text-yellow-500" />;
      case "notebook":
        return <SiJupyter className="text-orange-500" />;
      case "csv":
        return <BiData className="text-green-500" />;
      case "json":
        return <VscJson className="text-blue-500" />;
      case "parquet":
        return <SiApacheparquet className="text-purple-500" />;
      case "model":
        return <FiFile className="text-cyan-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  const renderFileItem = (item: any, key: string, path: string, level: number = 0) => {
    const isExpanded = expandedFolders.has(path);
    const isSelected = selectedFile === key;
    const hasChildren = item.type === "folder" && item.children && Object.keys(item.children).length > 0;

    return (
      <div key={key} className="mb-1">
        <div
          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer
            ${isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-800"}
          `}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            setSelectedFile(key);
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
          <span className="mr-2">{getFileIcon(item.type)}</span>
          <span className="text-sm font-medium">{item.name}</span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {Object.entries(item.children).map(([childKey, childItem]: [string, any]) => {
              return renderFileItem(childItem, childKey, `${path}.${childKey}`, level + 1);
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
        {/* Left sidebar - File explorer */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 h-full overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Explorer</h2>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus />
            </button>
          </div>

          <div>
            {Object.entries(folderStructure).map(([key, item]: [string, any]) => {
              return renderFileItem(item, key, key);
            })}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Tab bar */}
          <div className="bg-white border-b border-gray-200 flex items-center px-4">
            <div
              className={`px-4 py-3 border-b-2 font-medium text-sm cursor-pointer
                ${
                  activeTab === "notebook"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("notebook")}
            >
              Notebook
            </div>
            <div
              className={`px-4 py-3 border-b-2 font-medium text-sm cursor-pointer
                ${
                  activeTab === "terminal"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("terminal")}
            >
              Terminal
            </div>
            {/* <div
              className={`px-4 py-3 border-b-2 font-medium text-sm cursor-pointer
                ${
                  activeTab === "data"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("data")}
            >
              Data
            </div> */}
          </div>

          {/* Notebook content */}
          {activeTab === "notebook" && (
            <div className="flex-1 p-6 bg-white">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <SiJupyter className="text-orange-500 mr-2" size={24} />
                  <h2 className="text-lg font-semibold">Phân tích dữ liệu.ipynb</h2>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-all shadow-sm">
                    <FiSave size={14} />
                    <span>Lưu</span>
                  </button>
                  <button
                    className="px-3 py-1.5 bg-primary rounded-lg text-sm font-medium text-white flex items-center gap-1.5 hover:opacity-80 transition-all shadow-sm cursor-pointer"
                    onClick={handleRunCode}
                  >
                    <FiPlay size={14} />
                    <span>Chạy tất cả</span>
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="bg-gray-100 p-2 rounded-lg mb-3 text-sm font-mono"># Notebook Python</div>
                <div className="bg-gray-100 p-2 rounded-lg text-sm font-mono">print("Xin chào DataBricks!")</div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="bg-gray-100 p-2 rounded-lg mb-3 text-sm font-mono"># Import thư viện</div>
                <div className="bg-gray-100 p-2 rounded-lg mb-1 text-sm font-mono">import pandas as pd</div>
                <div className="bg-gray-100 p-2 rounded-lg mb-1 text-sm font-mono">import numpy as np</div>
                <div className="bg-gray-100 p-2 rounded-lg text-sm font-mono">import matplotlib.pyplot as plt</div>
              </div>

              <button
                className="w-full p-3 border border-dashed border-gray-300 rounded-xl text-sm flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                onClick={() => console.log("Thêm ô code mới")}
              >
                <FiPlus size={16} />
                <span>Thêm ô code mới</span>
              </button>
            </div>
          )}

          {/* Terminal content */}
          {activeTab === "terminal" && (
            <div className="flex-1 p-6">
              <div className="mb-4 flex items-center">
                <FiTerminal className="text-gray-700 mr-2" size={24} />
                <h2 className="text-lg font-semibold">Terminal</h2>
              </div>
              <div className="bg-gray-900 text-gray-100 rounded-xl p-4 font-mono text-sm h-96 overflow-auto">
                <div>$ python --version</div>
                <div>Python 3.9.12</div>
                <div>$ pip list</div>
                <div>Package Version</div>
                <div>--------------- -------</div>
                <div>numpy 1.22.3</div>
                <div>pandas 1.4.2</div>
                <div>matplotlib 3.5.1</div>
                <div>scikit-learn 1.0.2</div>
                <div>$ _</div>
              </div>
            </div>
          )}

          {/* Data content */}
          {activeTab === "data" && (
            <div className="flex-1 p-6">
              <div className="mb-4 flex items-center">
                <BiData className="text-green-600 mr-2" size={24} />
                <h2 className="text-lg font-semibold">Data Explorer - sales_data.csv</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10{i + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sản phẩm {i + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(i + 1) * 50}.000đ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i + 5}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-08-{20 + i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Notebook Modal */}
      <CreateNotebookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateNotebook={handleCreateNotebook}
      />
    </div>
  );
}
