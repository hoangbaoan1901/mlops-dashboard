import { AuthProvider } from "./common/AuthContext";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import WorkspacesPage from "./workspace/WorkspacesPage";
import UserInfoPage from "./user/UserInfoPage";
import WorkspaceCreateForm from "./workspace/WorkspaceCreateForm";
import { 
    Container, 
    Box, 
    Breadcrumbs, 
    Typography, 
    Paper,
    AppBar,
    Toolbar,
    CssBaseline
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import './App.css';

// Navigation breadcrumb component
function NavigationBreadcrumbs() {
    const location = useLocation();
    
    // Define breadcrumb items based on current path
    const pathnames = location.pathname.split('/').filter(x => x);
    
    return (
        <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
        >
            <Link to="/" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: location.pathname === '/' ? 'text.primary' : 'inherit',
                textDecoration: 'none'
            }}>
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Home
            </Link>
            
            {pathnames.length > 0 && pathnames[0] === 'workspaces' && (
                <Link to="/workspaces" style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'inherit',
                    textDecoration: 'none'
                }}>
                    <FolderIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Workspaces
                </Link>
            )}
        </Breadcrumbs>
    );
}

function App() {
    return (
        <AuthProvider>
            <CssBaseline />
            <Box className="app-container" sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                width: '100vw',
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                <AppBar 
                    position="static" 
                    color="default" 
                    elevation={1} 
                    sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        width: '100%'
                    }}
                >
                    <Container maxWidth={false} sx={{ width: '100%' }}>
                        <Toolbar disableGutters sx={{ width: '100%', justifyContent: 'space-between' }}>
                            <Typography variant="h6" component="div">
                                Workspace Manager
                            </Typography>
                            
                            {/* Navigation buttons */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link to="/" style={{ 
                                    textDecoration: 'none', 
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <HomeIcon sx={{ mr: 0.5 }} />
                                    Home
                                </Link>
                                
                                <Link to="/workspaces" style={{ 
                                    textDecoration: 'none', 
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <FolderIcon sx={{ mr: 0.5 }} />
                                    Workspaces
                                </Link>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                
                <Container 
                    maxWidth="lg" 
                    sx={{ 
                        mt: 4, 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        px: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    <Paper elevation={0} sx={{ p: 2, mb: 4, width: '100%' }}>
                        <NavigationBreadcrumbs />
                    </Paper>
                    
                    <Box sx={{ 
                        py: 2, 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Routes>
                            <Route path="/workspaces" element={<WorkspacesPage />} />
                            <Route path="/workspaces/new" element={<WorkspaceCreateForm />} />
                            <Route path="/" element={<UserInfoPage />} />
                        </Routes>
                    </Box>
                </Container>
            </Box>
        </AuthProvider>
    );
}

export default App;
