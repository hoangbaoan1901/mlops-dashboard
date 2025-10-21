import { useContext } from "react";
import { AuthContext } from "../common/AuthContext";
import { 
    Card, 
    CardContent, 
    Typography, 
    Divider, 
    Box, 
    Chip, 
    Avatar,
    Stack
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Define interface for Keycloak token to avoid TypeScript errors
interface KeycloakToken {
    name?: string;
    preferred_username?: string;
    email?: string;
    sub?: string;
    iat?: number;
    exp?: number;
    realm_access?: {
        roles: string[];
    };
}

function UserInfoPage() {
    const { isKeycloakAuthenticated, isBackendConnected, keycloak } =
        useContext(AuthContext);
    const isAuthenticated = isKeycloakAuthenticated && isBackendConnected;
    
    // Cast tokenParsed to our defined interface
    const tokenParsed = keycloak?.tokenParsed as KeycloakToken | undefined;
    
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };
    
    // Function to extract first character from name for avatar
    const getInitial = (name?: string) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };
    
    return (
        <div>
            <Card elevation={3} sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
                <CardContent>
                    {isAuthenticated ? (
                        <>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        bgcolor: "primary.main",
                                        fontSize: "2rem",
                                        mr: 3
                                    }}
                                >
                                    {getInitial(tokenParsed?.name)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" gutterBottom>
                                        {tokenParsed?.name || "Unknown User"}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {tokenParsed?.preferred_username || ""}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Divider sx={{ mb: 3 }} />
                            
                            <Stack direction="row" spacing={3} sx={{ mb: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                                <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <EmailIcon sx={{ mr: 1 }} color="primary" />
                                        <Typography variant="body1" sx={{ fontWeight: "500" }}>Email:</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ ml: 4 }}>
                                        {tokenParsed?.email || "No email available"}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <FingerprintIcon sx={{ mr: 1 }} color="primary" />
                                        <Typography variant="body1" sx={{ fontWeight: "500" }}>User ID:</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ ml: 4, wordBreak: "break-all" }}>
                                        {tokenParsed?.sub || "Unknown ID"}
                                    </Typography>
                                </Box>
                            </Stack>
                            
                            <Stack direction="row" spacing={3} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>
                                <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <GroupsIcon sx={{ mr: 1 }} color="primary" />
                                        <Typography variant="body1" sx={{ fontWeight: "500" }}>Roles:</Typography>
                                    </Box>
                                    <Box sx={{ ml: 4 }}>
                                        {tokenParsed?.realm_access?.roles ? (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                {tokenParsed.realm_access.roles.map((role: string) => (
                                                    <Chip 
                                                        key={role} 
                                                        label={role} 
                                                        size="small" 
                                                        variant="outlined" 
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2">No roles assigned</Typography>
                                        )}
                                    </Box>
                                </Box>
                                
                                <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <AccessTimeIcon sx={{ mr: 1 }} color="primary" />
                                        <Typography variant="body1" sx={{ fontWeight: "500" }}>Session Info:</Typography>
                                    </Box>
                                    <Box sx={{ ml: 4 }}>
                                        <Typography variant="body2">
                                            <strong>Issued at:</strong> {tokenParsed?.iat ? formatDate(tokenParsed.iat) : "Unknown"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Expires:</strong> {tokenParsed?.exp ? formatDate(tokenParsed.exp) : "Unknown"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </>
                    ) : (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                            <PersonIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                            <Typography variant="h5" color="text.secondary">
                                Guest User
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                Please log in to view your user information
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default UserInfoPage;