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
  TextField,
  Stack,
  Paper,
  Container,
  Fade,
  Backdrop
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Post } from "@/interfieses/post";
import { yellow } from "@mui/material/colors";

// Modal styles to match the app theme
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxWidth: 600,
  bgcolor: "#1b1b1b",
  borderRadius: 3,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  p: 4,
  border: "1px solid #333",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2a2a2a",
            "& fieldset": {
              borderColor: "#444",
            },
            "&:hover fieldset": {
              borderColor: "#666",
            },
            "&.Mui-focused fieldset": {
              borderColor: yellow[400],
            },
          },
        },
      },
    },
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

export default function MerOption({ postDetails }: { postDetails: Post }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const uploadImg = React.useRef<HTMLInputElement | null>(null);
  const [postBody, setPostBody] = React.useState(postDetails.body || "");
  const [openModel, setOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const handleOpenModel = () => {
    setOpen(true);
    handleClose();
  };

  const handleCloseModel = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${postDetails._id}`, {
          headers: { token: localStorage.getItem("token") },
        })
        .then(() => {
          toast.success("Post deleted successfully");
          router.refresh();
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
          toast.error("Failed to delete post");
        });
    }
    handleClose();
  }

  function handleUpdatePost(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData();

    if (uploadImg.current?.files?.[0]) {
      formData.append("image", uploadImg.current.files[0]);
    }

    if (postBody.trim()) {
      formData.append("body", postBody);
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${postDetails._id}`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(() => {
        toast.success("Post updated successfully");
        handleCloseModel();
        router.refresh();
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        toast.error("Failed to update post");
      })
      .finally(() => {
        setIsUpdating(false);
      });
  }

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
        <MenuItem onClick={handleOpenModel} disableRipple>
          <EditIcon />
          Edit Post
        </MenuItem>
        <Divider sx={{ my: 0.5, backgroundColor: "#333" }} />
        <MenuItem onClick={handleDelete} disableRipple sx={{ color: "#ef4444" }}>
          <DeleteIcon />
          Delete Post
        </MenuItem>
      </StyledMenu>

      <Modal 
        open={openModel} 
        onClose={handleCloseModel}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModel}>
          <Paper sx={modalStyle}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight={600}>
              Edit Post
            </Typography>
            
            <Stack component="form" onSubmit={handleUpdatePost} spacing={3}>
              {/* Image Upload Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Update Image
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ 
                    py: 1.5,
                    borderStyle: "dashed",
                    borderColor: "#555",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: alpha(yellow[400], 0.05)
                    }
                  }}
                >
                  Choose New Image
                  <VisuallyHiddenInput 
                    type="file" 
                    ref={uploadImg} 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                
                {/* Image Preview */}
                {selectedImage && (
                  <Box mt={2} textAlign="center">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: "100%", 
                        maxHeight: "200px", 
                        borderRadius: "8px",
                        border: "1px solid #333"
                      }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Text Content Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Post Content
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  placeholder="What's on your mind?"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#2a2a2a",
                    }
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  onClick={handleCloseModel}
                  disabled={isUpdating}
                  sx={{ 
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
                  type="submit" 
                  variant="contained"
                  disabled={isUpdating || (!postBody.trim() && !uploadImg.current?.files?.[0])}
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: yellow[600],
                    color: "#000",
                    "&:hover": {
                      backgroundColor: yellow[700],
                    }
                  }}
                >
                  {isUpdating ? "Updating..." : "Update Post"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
}