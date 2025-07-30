"use client";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Modal, 
  IconButton, 
  ThemeProvider, 
  createTheme,
  Typography,
  Stack,
  Paper,
  Fade,
  Backdrop
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Post } from "@/interfieses/post";
import { yellow } from "@mui/material/colors";

// Dark theme styled menu
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    marginTop: theme.spacing(1),
    minWidth: 180,
    backgroundColor: "#1b1b1b",
    color: "#fff",
    border: "1px solid #333",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
    "& .MuiMenu-list": {
      padding: "8px 0",
    },
    "& .MuiMenuItem-root": {
      fontSize: "0.875rem",
      padding: "12px 16px",
      margin: "0 8px",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        color: "#aaa",
        marginRight: theme.spacing(1.5),
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        "& .MuiSvgIcon-root": {
          color: theme.palette.primary.main,
        },
      },
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
    },
  },
}));

// Confirmation modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  maxWidth: 500,
  bgcolor: "#1b1b1b",
  borderRadius: 3,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  p: 4,
  border: "1px solid #333",
};

// Dark theme for the component
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: yellow,
    background: {
      default: "#0f0f0f",
      paper: "#1b1b1b",
    },
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default function MoreOptinsComment({ 
  postDetails, 
  setbtnSho 
}: { 
  postDetails: Post; 
  setbtnSho: any; 
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setbtnSho(false);
    handleClose();
  };

  const handleDeleteClick = () => {
    setOpenConfirmModal(true);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}comments/${postDetails._id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success("Comment deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
      setOpenConfirmModal(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmModal(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <IconButton
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        sx={{ 
          color: "text.secondary",
          "&:hover": { 
            color: "text.primary",
            backgroundColor: alpha(yellow[400], 0.1)
          }
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit} disableRipple>
          <EditIcon />
          Edit Comment
        </MenuItem>
        <Divider sx={{ my: 0.5, backgroundColor: "#333" }} />
        <MenuItem onClick={handleDeleteClick} disableRipple sx={{ color: "#ef4444" }}>
          <DeleteIcon />
          Delete Comment
        </MenuItem>
      </StyledMenu>

      {/* Confirmation Modal */}
      <Modal 
        open={openConfirmModal} 
        onClose={handleCancelDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openConfirmModal}>
          <Paper sx={modalStyle}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <DeleteIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: "#ef4444", 
                    mb: 2 
                  }} 
                />
                <Typography variant="h6" component="h2" gutterBottom fontWeight={600}>
                  Delete Comment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Are you sure you want to delete this comment? This action cannot be undone.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="outlined" 
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  sx={{ 
                    minWidth: 100,
                    borderColor: "#555",
                    color: "text.secondary",
                    "&:hover": {
                      borderColor: "#777",
                      backgroundColor: alpha("#fff", 0.05)
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  sx={{ 
                    minWidth: 100,
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#dc2626",
                    }
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
}