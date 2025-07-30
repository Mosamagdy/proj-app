// app/(social)/posts/page.tsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Avatar,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ThemeProvider,
  createTheme,
  Stack,
  Chip,
  Button,
  Container,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Caretpost from "../_component/Caretpost/Caretpost";
import CardComponent from "../_component/CardCombonnt/CartCmponent";
import { Post } from "@/interfieses/post";
import { useSelector } from "react-redux";
import { store } from "@/lib/store";

export default function PostsPage() {
  /* ------------------------------------------------------------------ */
  /*  POSTS FETCHING LOGIC                                              */
  /* ------------------------------------------------------------------ */
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const POSTS_PER_PAGE = 15;
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;

  // Initial fetch
  useEffect(() => {
    fetchPosts(1, true);
  }, [token]);

  // Fetch posts function
  const fetchPosts = async (pageNum: number, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}posts?limit=${POSTS_PER_PAGE}&page=${pageNum}`,
        {
          headers: token ? { token } : undefined,
        }
      );
      
      const newPosts = response.data.posts;
      
      if (isInitial) {
        setPostsData(newPosts);
      } else {
        setPostsData(prev => [...prev, ...newPosts]);
      }
      
      // Check if there are more posts
      if (newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
      
      setPage(pageNum);
      setError(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more posts
  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // Load when 1000px from bottom
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, loadingMore]);

  /* ------------------------------------------------------------------ */
  /*  DERIVED LISTS                                                     */
  /* ------------------------------------------------------------------ */
  // Unique users for Stories bar
  const storiesUsers = useMemo(() => {
    const map = new Map<string, any>();
    postsData.forEach((p) => {
      const u = (p as any).user;
      if (u && !map.has(u.id)) {
        map.set(u.id, u);
      }
    });
    return Array.from(map.values()).slice(0, 10);
  }, [postsData]);

  // Recent activity uses first 6 posts already
  const recentActivity = useMemo(() => postsData.slice(0, 6), [postsData]);

  /* ------------------------------------------------------------------ */
  /*  USER DATA FROM REDUX STORE                                        */
  /* ------------------------------------------------------------------ */
  const userData = useSelector((state: ReturnType<typeof store.getState>) => state.auth.userData);
  const avatarSrc = userData?.photo || "https://i.pravatar.cc/150?img=8";

  /* ------------------------------------------------------------------ */
  /*  THEME                                                             */
  /* ------------------------------------------------------------------ */
  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: yellow,
          background: {
            default: "#0f0f0f",
            paper: "#1b1b1b",
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: "Inter, sans-serif",
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: "100vh", p: 2, bgcolor: "background.default" }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} justifyContent="center">
            {/* ---------------------------------------------------------------- */}
            {/*  LEFT SIDEBAR – Dynamic Profile Card                             */}
            {/* ---------------------------------------------------------------- */}
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  textAlign: "center",
                  display: { xs: "none", md: "block" } 
                }}
              >
                {/* Avatar */}
                {userData ? (
                  <Avatar src={avatarSrc} alt={userData.name} sx={{ width: 96, height: 96, mb: 2, mx: "auto" }} />
                ) : (
                  <Skeleton variant="circular" width={96} height={96} sx={{ mb: 2, mx: "auto", bgcolor: "#333" }} />
                )}

                {/* Name */}
                {userData ? (
                  <Typography variant="h6">{userData.name}</Typography>
                ) : (
                  <Skeleton width={120} height={28} sx={{ mx: "auto", bgcolor: "#333" }} />
                )}

                {/* Username */}
                {userData ? (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    @{userData.username || userData.name?.toLowerCase().replace(/\s+/g, "_")}
                  </Typography>
                ) : (
                  <Skeleton width={90} height={20} sx={{ mx: "auto", mb: 1, bgcolor: "#333" }} />
                )}

                {/* Followers / Following Stats */}
                <Stack direction="row" justifyContent="center" spacing={4} my={2}>
                  <Box>
                    <Typography fontWeight={700}>{userData?.followersCount ?? "500"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Followers
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>{userData?.followingCount ?? "100"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Following
                    </Typography>
                  </Box>
                </Stack>

                {/* Bio / Tagline */}
                {userData ? (
                  <Typography variant="body2" mb={2}>
                    {userData.bio || "⭐ Hello, I'm a member of our community ⭐"}
                  </Typography>
                ) : (
                  <Skeleton width="80%" height={18} sx={{ mx: "auto", my: 1, bgcolor: "#333" }} />
                )}

                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mb: 3 }}
                  onClick={() => router.push('/')}
                >
                  My Profile
                </Button>

                <Typography variant="subtitle2" align="left" gutterBottom>
                  Skills
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {(userData?.skills || [
                    "UX Designer",
                    "Front‑end & Back‑End Developer",
                    "3‑d coder",
                    "UI Designer",
                  ]).map((skill: string) => (
                    <Chip key={skill} label={skill} variant="outlined" />
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* ---------------------------------------------------------------- */}
            {/*  CENTER FEED                                                     */}
            {/* ---------------------------------------------------------------- */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                {/* Stories Bar */}
                <Paper elevation={1} sx={{ p: 2, bgcolor: "background.paper" }}>
                  <Typography variant="subtitle2" mb={2}>
                    Stories
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ overflowX: "auto", pb: 1 }}>
                    {loading && (
                      <Stack direction="row" spacing={2}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} variant="circular" width={56} height={56} />
                        ))}
                      </Stack>
                    )}
                    {!loading && storiesUsers.length === 0 && (
                      <Typography color="text.secondary">No Stories Available</Typography>
                    )}
                    {!loading && storiesUsers.map((u) => (
                      <Tooltip key={u.id} title={u.name} arrow>
                        <Avatar
                          src={u.avatarUrl || u.photo || "https://i.pravatar.cc/50"}
                          alt={u.name}
                          sx={{ 
                            width: 56, 
                            height: 56,
                            border: 2, 
                            borderColor: "primary.main", 
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Stack>
                </Paper>

                {/* Create Post / Caretpost */}
                <Caretpost />

                {/* Feed */}
                {loading && (
                  <Stack spacing={2}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Paper key={i} elevation={1} sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Stack>
                            <Skeleton width={120} height={16} />
                            <Skeleton width={80} height={14} />
                          </Stack>
                        </Stack>
                        <Skeleton width="100%" height={200} variant="rectangular" />
                      </Paper>
                    ))}
                  </Stack>
                )}
                {error && (
                  <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="error">Failed to load posts.</Typography>
                    <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                      Retry
                    </Button>
                  </Paper>
                )}
                {!loading && !error && postsData.length === 0 && (
                  <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary">No posts available.</Typography>
                  </Paper>
                )}
                {!loading && !error && postsData.map((post) => (
                  <CardComponent key={post.id} singel postDetails={post} />
                ))}
                
                {/* Load More Button & Loading More State */}
                {!loading && !error && hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {loadingMore ? (
                      <Stack spacing={2} sx={{ width: '100%' }}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Stack>
                              <Skeleton width={120} height={16} />
                              <Skeleton width={80} height={14} />
                            </Stack>
                          </Stack>
                          <Skeleton width="100%" height={200} variant="rectangular" />
                        </Paper>
                      </Stack>
                    ) : (
                      <Button 
                        variant="outlined" 
                        onClick={loadMorePosts}
                        sx={{ mb: 2 }}
                      >
                        Load More Posts
                      </Button>
                    )}
                  </Box>
                )}
                
                {/* No More Posts Message */}
                {!loading && !error && !hasMore && postsData.length > 0 && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    align="center" 
                    sx={{ mt: 2, mb: 2 }}
                  >
                    No more posts to load
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* ---------------------------------------------------------------- */}
            {/*  RIGHT SIDEBAR – Recent Activity                                 */}
            {/* ---------------------------------------------------------------- */}
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1" mb={2}>
                  Recent Activity
                </Typography>
                <List dense>
                  {recentActivity.length === 0 && !loading && (
                    <Typography color="text.secondary" align="center">
                      No recent activity
                    </Typography>
                  )}
                  {recentActivity.map((p) => (
                    <ListItem key={p.id} sx={{ mb: 1, bgcolor: "background.paper", borderRadius: 2 }}>
                      <ListItemAvatar>
                        <Avatar src={p.user?.avatarUrl || p.user?.photo || "https://i.pravatar.cc/40"} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={p.user?.name || "Unknown"}
                        secondary={p.createdAt ? new Date(p.createdAt).toLocaleTimeString() : ""}
                      />
                      <IconButton size="small">
                        <MoreHorizRoundedIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* ------------------------------------------------------------------- */}
        {/*  BOTTOM FLOATING NAVIGATION (MOBILE)                                */}
        {/* ------------------------------------------------------------------- */}
       
      </Box>
    </ThemeProvider>
  );
}