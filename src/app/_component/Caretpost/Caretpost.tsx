"use client";

import { store } from "@/lib/store";
import {
  Avatar,
  Box,
  Button,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "var(--main-color)",
  color: "var(--foreground)",
  border: "2px solid var(--sec-color)",
  borderRadius: 6,
  boxShadow: "0 10px 30px rgba(0,0,0,.8)",
  p: 4,
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

export default function CaretPost() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const userData = useSelector(
    (state: ReturnType<typeof store.getState>) => state.auth.userData
  );

  const uploadImg = useRef<HTMLInputElement | null>(null);
  const bodyElement = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  async function handleCaretPost(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();

    if (uploadImg.current?.files?.[0]) {
      formData.append("image", uploadImg.current.files[0]);
    }
    if (bodyElement.current?.value) {
      formData.append("body", bodyElement.current.value);
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}posts`, formData, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success("Post added successfully");
      handleClose();
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add post");
    }
  }

  return (
    <>
      {/* كارت إنشاء بوست جديد */}
      <Paper
        onClick={handleOpen}
        sx={{
          my: 3,
          p: 2,
          bgcolor: "var(--main-color)",
          borderRadius: 4,
          border: "2px solid var(--mini-color)",
          color: "var(--foreground)",
          cursor: "pointer",
          "&:hover": {
            borderColor: "var(--sec-color)",
            boxShadow: "0 0 0 2px var(--sec-color)",
          },
        }}
      >
        <Grid2 container alignItems="center" spacing={2}>
          <Grid2 xs={2}>
            <Avatar
              src={userData?.photo}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid var(--sec-color)",
              }}
            />
          </Grid2>
          <Grid2 xs={10}>
            <Typography sx={{ color: "white" }}>
              What's on your mind?
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleCaretPost} sx={modalStyle}>
          {/* زرار رفع صورة */}
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              mb: 2,
              bgcolor: "var(--sec-color)",
              color: "#000",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "var(--sec-color)" },
            }}
          >
            Add Image
            <VisuallyHiddenInput type="file" ref={uploadImg} />
          </Button>

          {/* Textarea */}
          <textarea
            ref={bodyElement}
            placeholder="Add post..."
            rows={8}
            style={{
              width: "100%",
              background: "transparent",
              border: "2px dashed var(--mini-color)",
              color: "white",
              borderRadius: 6,
              padding: "10px 12px",
              resize: "vertical",
              outline: "none",
            }}
          />

          {/* زرار إضافة بوست */}
          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: "var(--sec-color)",
              color: "#000",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "var(--sec-color)" },
            }}
          >
            Add Post
          </Button>
        </Box>
      </Modal>
    </>
  );
}
