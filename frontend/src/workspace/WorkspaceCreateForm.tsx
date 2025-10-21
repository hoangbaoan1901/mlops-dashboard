import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../common/AuthContext";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Slider,
    Alert,
    InputAdornment,
    Stack,
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface WorkspaceFormData {
    workspace_name: string;
    num_cpu: number;
    memory: number;
    home_disk_size: number;
    github_token: string;
}

const WorkspaceCreateForm = () => {
    const navigate = useNavigate();
    const { isKeycloakAuthenticated, isBackendConnected, keycloak } =
        useContext(AuthContext);
    const isAuthenticated = isKeycloakAuthenticated && isBackendConnected;

    const [formData, setFormData] = useState<WorkspaceFormData>({
        workspace_name: "",
        num_cpu: 2,
        memory: 4,
        home_disk_size: 10,
        github_token: "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof WorkspaceFormData, string>>
    >({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTextChange =
        (field: keyof WorkspaceFormData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [field]: e.target.value });
            if (errors[field]) {
                setErrors({ ...errors, [field]: undefined });
            }
        };

    const handleSliderChange =
        (field: keyof WorkspaceFormData) =>
        (_: Event, newValue: number | number[]) => {
            setFormData({ ...formData, [field]: newValue as number });
            if (errors[field]) {
                setErrors({ ...errors, [field]: undefined });
            }
        };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof WorkspaceFormData, string>> = {};

        if (!formData.workspace_name.trim()) {
            newErrors.workspace_name = "Workspace name is required";
        } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.workspace_name)) {
            newErrors.workspace_name =
                "Only alphanumeric characters, hyphens, and underscores are allowed";
        }

        if (formData.num_cpu < 2) {
            newErrors.num_cpu = "Minimum 2 CPU required";
        } else if (formData.num_cpu > 4) {
            newErrors.num_cpu = "Maximum 4 CPUs allowed";
        }

        if (formData.memory < 2) {
            newErrors.memory = "Minimum 2 GB of memory required";
        } else if (formData.memory > 8) {
            newErrors.memory = "Maximum 8 GB of memory allowed";
        }

        if (formData.home_disk_size < 10) {
            newErrors.home_disk_size = "Minimum 10 GB of disk space required";
        } else if (formData.home_disk_size > 15) {
            newErrors.home_disk_size = "Maximum 15 GB of disk space allowed";
        }

        if (formData.github_token && formData.github_token.length < 10) {
            newErrors.github_token =
                "GitHub token appears to be invalid (too short)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) {
            return;
        }

        if (!isAuthenticated || !keycloak) {
            setSubmitError("You must be authenticated to create a workspace");
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/workspaces`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            navigate("/workspaces");
        } catch (error) {
            console.error("Error creating workspace:", error);
            if (axios.isAxiosError(error) && error.response) {
                setSubmitError(
                    error.response.data.message ||
                        "Failed to create workspace. Please try again."
                );
            } else {
                setSubmitError(
                    "An unexpected error occurred. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/workspaces");
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", width: "100%" }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleCancel}
                sx={{ mb: 2 }}
            >
                Back to Workspaces
            </Button>

            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                        Create New Workspace
                    </Typography>

                    {submitError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {submitError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3} width="100%">
                            <Box>
                                <TextField
                                    label="Workspace Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.workspace_name}
                                    onChange={handleTextChange(
                                        "workspace_name"
                                    )}
                                    error={!!errors.workspace_name}
                                    helperText={
                                        errors.workspace_name ||
                                        "Use alphanumeric characters, hyphens, and underscores"
                                    }
                                    required
                                />
                            </Box>

                            <Box>
                                <Typography gutterBottom>
                                    CPU Cores (Max: 4)
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <ComputerIcon
                                        sx={{ mr: 2, color: "primary.main" }}
                                    />
                                    <Slider
                                        value={formData.num_cpu}
                                        onChange={handleSliderChange("num_cpu")}
                                        step={1}
                                        marks
                                        min={2}
                                        max={4}
                                        valueLabelDisplay="auto"
                                        sx={{ flex: 1, mr: 2 }}
                                    />
                                    <TextField
                                        value={formData.num_cpu}
                                        onChange={handleTextChange("num_cpu")}
                                        type="number"
                                        InputProps={{
                                            inputProps: { min: 2, max: 4 },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    cores
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ width: 100 }}
                                        error={!!errors.num_cpu}
                                    />
                                </Box>
                                {errors.num_cpu && (
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ ml: 5 }}
                                    >
                                        {errors.num_cpu}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography gutterBottom>
                                    Memory (Max: 8 GB)
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <MemoryIcon
                                        sx={{ mr: 2, color: "primary.main" }}
                                    />
                                    <Slider
                                        value={formData.memory}
                                        onChange={handleSliderChange("memory")}
                                        step={1}
                                        marks
                                        min={4}
                                        max={8}
                                        valueLabelDisplay="auto"
                                        sx={{ flex: 1, mr: 2 }}
                                    />
                                    <TextField
                                        value={formData.memory}
                                        onChange={handleTextChange("memory")}
                                        type="number"
                                        InputProps={{
                                            inputProps: { min: 4, max: 8 },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    GB
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ width: 100 }}
                                        error={!!errors.memory}
                                    />
                                </Box>
                                {errors.memory && (
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ ml: 5 }}
                                    >
                                        {errors.memory}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography gutterBottom>
                                    Home Disk Size (Max: 15 GB)
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <StorageIcon
                                        sx={{ mr: 2, color: "primary.main" }}
                                    />
                                    <Slider
                                        value={formData.home_disk_size}
                                        onChange={handleSliderChange(
                                            "home_disk_size"
                                        )}
                                        step={5}
                                        marks
                                        min={10}
                                        max={30}
                                        valueLabelDisplay="auto"
                                        sx={{ flex: 1, mr: 2 }}
                                    />
                                    <TextField
                                        value={formData.home_disk_size}
                                        onChange={handleTextChange(
                                            "home_disk_size"
                                        )}
                                        type="number"
                                        InputProps={{
                                            inputProps: { min: 10, max: 30 },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    GB
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ width: 100 }}
                                        error={!!errors.home_disk_size}
                                    />
                                </Box>
                                {errors.home_disk_size && (
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ ml: 5 }}
                                    >
                                        {errors.home_disk_size}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <TextField
                                    label="GitHub Token (Mandatory)"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.github_token}
                                    onChange={handleTextChange("github_token")}
                                    error={!!errors.github_token}
                                    helperText={
                                        errors.github_token ||
                                        "Provide a GitHub personal access token for Git operations within your workspace"
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <GitHubIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    mt: 2,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Creating..."
                                        : "Create Workspace"}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default WorkspaceCreateForm;
