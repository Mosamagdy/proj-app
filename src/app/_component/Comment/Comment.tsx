"use client";
import React, { useRef, useState } from "react";
import {
  Avatar,
  CardHeader,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid2,
} from "@mui/material";
import { red } from "@mui/material/colors";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Comment({
  postDetails,
  singel,
}: {
  postDetails: Post;
  singel: boolean;
}) {
  const [btnSho, setbtnSho] = useState(true);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const contentElement = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [comments, setComments] = useState(postDetails.comments || []);

 function addComment() {
  const Data = contentElement.current?.value;
  if (!Data) return;

  const newComment = {
    content: Data,
    post: postDetails._id,
    commentCreator: {
      name: postDetails.commentCreator?.name || "",
      photo: postDetails.commentCreator?.photo || "",
    },
    createdAt: new Date().toISOString(),
  };

  axios
    .post(
      `${process.env.NEXT_PUBLIC_BASE_URL}comments`,
      { content: Data, post: postDetails._id },
      {
        headers: { token: localStorage.getItem("token") },
      }
    )
    .then(() => {
      toast.success("Comment added successfully");
     
    })
    .catch((error) => {
      console.error("Error:", error);
      toast.error("Failed to add comment");
    });
}

  function updateComment() {
    const Data = contentElement.current?.value;
    if (!Data || !editCommentId) {
      toast.error("No comment selected for update");
      return;
    }

    axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}comments/${editCommentId}`,
        { content: Data },
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
   .then(() => {
  toast.success("Comment added successfully");

  // هنا افترض عندك setComments لتحديث القائمة
  const addedComment = {
    content: Data,
    post: postDetails._id,
    commentCreator: {
      name: postDetails.commentCreator?.name || "",
      photo: postDetails.commentCreator?.photo || "",
    },
    createdAt: new Date().toISOString(),
  };

  setComments((prevComments) => [addedComment, ...prevComments]); // أو حسب طريقة العرض
})
      .catch((error) => {
        console.error("Error updating comment:", error);
        toast.error("Failed to update comment");
      });
  }

  function deleteComment(id: string) {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}comments/${id}`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(() => {
        toast.success("Comment deleted successfully");
        setComments((prev) => prev.filter((comment) => comment._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment");
      });
  }

  return (
    <Box sx={{ bgcolor: "#1a1a1a" }}>
      <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#1b1b1b", boxShadow: 3 }}>
        <Grid2 container spacing={2} alignItems="center">
          <Grid2 xs={12} md={9}>
            <TextField
              inputRef={contentElement}
              size="small"
              type="text"
              placeholder="Write a comment..."
              variant="outlined"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  "& fieldset": {
                    borderColor: "#8d8d8d",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFFD02",
                  },
                  input: {
                    color: "#fff",
                    "::placeholder": { color: "#8d8d8d" },
                  },
                },
              }}
            />
          </Grid2>
          <Grid2 xs={12} md={3} display="flex" justifyContent="center">
            {btnSho ? (
              <Button
                onClick={addComment}
                size="small"
                variant="contained"
                sx={{
                  borderRadius: 4,
                  bgcolor: "#ffeb3b",
                  color: "black",
                  "&:hover": { bgcolor: "#fdd835" },
                }}
              >
                Add Comment
              </Button>
            ) : (
              <Button
                onClick={updateComment}
                size="small"
                variant="contained"
                sx={{
                  borderRadius: 4,
                  bgcolor: "#2196f3",
                  color: "#fff",
                  "&:hover": { bgcolor: "#1976d2" },
                }}
              >
                Update Comment
              </Button>
            )}
          </Grid2>
        </Grid2>
      </Box>

      {(singel ? comments.slice(0, 1) : comments).map((comment) => (
        <Card
          key={comment._id}
          sx={{
            bgcolor: singel ? "grey.800" : "#4b4b4b",
            color: "#fff",
            mb: 2,
          }}
        >
          <CardHeader
            avatar={
              comment.commentCreator?.photo && (
                <Avatar
                  src={comment.commentCreator.photo}
                  alt={comment.commentCreator.name}
                  sx={{ bgcolor: red[500] }}
                />
              )
            }
            action={
              <>
                <Button
                  onClick={() => {
                    if (contentElement.current)
                      contentElement.current.value = comment.content;
                    setbtnSho(false);
                    setEditCommentId(comment._id);
                  }}
                  color="info"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteComment(comment._id)}
                  color="error"
                >
                  Delete
                </Button>
              </>
            }
            title={comment.commentCreator?.name || "Unknown"}
            subheader={
              comment.createdAt
                ? new Date(comment.createdAt).toLocaleString()
                : "No Date"
            }
            subheaderTypographyProps={{ style: { color: "#c9c9c9" } }}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {comment.content || "No Content"}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {comments.length > 1 && singel && (
        <Typography
          component={Link}
          href={`/Post/${postDetails._id}`}
          sx={{
            display: "block",
            textAlign: "center",
            mt: 2,
            color: "#90caf9",
          }}
        >
          All comments
        </Typography>
      )}
    </Box>
  );
}