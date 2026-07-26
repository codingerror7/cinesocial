"use client"
import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';     //image optimization in nextjs, lazy loading, responsive images, making images light-weight and more efficient image handling.
import { useRouter } from 'next/navigation';
import Loader from '@/Components/Loader'
import { api, getAuthToken } from '@/utils/api.js';
import { useAuth } from '@/context/AuthContext.js';
import { usePopup } from '@/context/PopupContext.js';
import { Share2 } from 'lucide-react';
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";


const getFrontendOrigin = () =>
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000';

const isValidAvatarUrl = (url) => {
  return (
    typeof url === 'string' &&
    url.trim() !== '' &&
    url.trim().toLowerCase() !== 'url_to_avatar' &&
    url.trim() !== ' ' &&
    (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))
  );
};

const normalizeAvatar = (rawAvatar, userName) => {
  if (isValidAvatarUrl(rawAvatar)) {
    if (rawAvatar.startsWith('/')) {
      return `${getFrontendOrigin()}${rawAvatar}`;
    }
    return rawAvatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName || 'Anonymous'
  )}&background=6366f1&color=fff&size=128`;
};

const sanitizeMediaUrl = (mediaUrl) => {
  if (typeof mediaUrl !== 'string') return null;
  const trimmed = mediaUrl.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'url_to_avatar') return null;
  if (trimmed.startsWith('/')) {
    return `${getFrontendOrigin()}${trimmed}`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return null;
};

const sanitizePost = (post) => {
  if (!post || typeof post !== 'object') return post;

  const userName = post.user?.userName || post.user?.name || 'Anonymous';
  const avatar = normalizeAvatar(post.user?.avatar, userName);

  const sanitizedMedia = Array.isArray(post.media)
    ? post.media
        .map((mediaUrl) => sanitizeMediaUrl(mediaUrl))
        .filter(Boolean)
    : [];

  return {
    ...post,
    user: {
      ...post.user,
      avatar,
      userName: post.user?.userName || userName,
      title: post.user?.title || 'Cinephile',
    },
    media: sanitizedMedia,
    likesCount: typeof post.likesCount === 'number' ? post.likesCount : 0,
    commentsCount: typeof post.commentsCount === 'number' ? post.commentsCount : 0,
    isLiked: typeof post.isLiked === 'boolean' ? post.isLiked : false,
  };
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    console.warn('Unable to read stored user from localStorage:', error);
    return null;
  }
};

const Avatar = ({ src, alt = 'avatar', size = 44, small = false }) => {
  const [errored, setErrored] = useState(false);
  const finalSize = small ? size - 12 : size;

  if (!src || errored) {
    return (
      <span
        style={{ width: finalSize, height: finalSize, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        className={small ? 'text-sm' : 'text-lg'}
        aria-hidden
      >
        👤
      </span>
    );
  }

  return (
    <Image
    loading='lazy'
      src={src}
      alt={alt}
      width={finalSize}
      height={finalSize}
      className="rounded-full object-cover w-full h-full"
      onError={() => setErrored(true)}
      unoptimized={true}
    />
  );
};

const Postcard = () => {
  const router = useRouter();
  const [postData, setpostData] = useState([]);   // jab multiple data backend se aa rha hai tab empty array use krte hain and jab single document aa rha tab null use krte hain.
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [processingLikes, setProcessingLikes] = useState({});
  const loadMoreRef = useRef(null);
  const [likeAnimation, setLikeAnimation] = useState({});
  const [commentModalPostId, setCommentModalPostId] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentPosting, setCommentPosting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const { user } = useAuth();
  const { showModal, showToast } = usePopup();

  const handleLike = async (postId) => {
    if (!postId) {
      console.warn("Missing postId for like toggle");
      return;
    }

    if (!user?._id) {
      showModal("login");
      return;
    }

    const post = postData.find((item) => item._id === postId || item.id === postId);
    const currentlyLiked = post?.isLiked || false;
    const currentCount = Number(post?.likesCount ?? 0);

    // Do not block here if access token is missing — allow the API call to trigger
    // the interceptor refresh logic which will obtain a new access token if possible.

    setProcessingLikes((prev) => ({ ...prev, [postId]: true }));
    setLikeAnimation((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => setLikeAnimation((prev) => ({ ...prev, [postId]: false })), 600);

    try {
      const res = await api.post(`/api/like/${postId}`);

      const liked = typeof res.data?.liked === "boolean" ? res.data.liked : !currentlyLiked;
      const likesCount = typeof res.data?.likesCount === "number" ? res.data.likesCount : currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

      setpostData((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => {
              const id = item._id || item.id;
              if (id !== postId) return item;
              return {
                ...item,
                isLiked: liked,
                likesCount,
              };
            })
          : prev
      );
    } catch (err) {
      const resp = err?.response;
      console.error("Error toggling like on post:", resp?.data || err.message || err);
      if (resp?.status === 401) {
        console.warn('Like failed: unauthorized. Clearing token and please login.');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accesstoken');
          localStorage.removeItem('accessToken');
        }
      }
    } finally {
      setProcessingLikes((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    }
  };

  const handleShareClick = (postId) => {
    const postLink = `${getFrontendOrigin()}/Post/${postId}`;
    if (window.innerWidth < 640) {
      showModal("bottomSheetActions", {
        title: "Share Options",
        actions: [
          {
            label: "Copy Link",
            icon: Share2,
            onClick: () => {
              navigator.clipboard.writeText(postLink)
                .then(() => showToast("success", "Post link copied successfully", 2000))
                .catch(() => showToast("error", "Failed to copy link"));
            }
          },
          {
            label: "Share on WhatsApp",
            onClick: () => {
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out this post on CineSocial: " + postLink)}`, "_blank");
            }
          },
          {
            label: "Share on Twitter",
            onClick: () => {
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out this post on CineSocial: " + postLink)}`, "_blank");
            }
          }
        ]
      });
    } else {
      navigator.clipboard.writeText(postLink)
        .then(() => {
          showToast("success", "Post link copied successfully", 2000);
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
          showToast("error", "Failed to copy link");
        });
    }
  };

  const parseFeedResponse = (responseData) => {
    const rawPosts = Array.isArray(responseData?.post)
      ? responseData.post
      : Array.isArray(responseData?.posts)
      ? responseData.posts
      : Array.isArray(responseData)
      ? responseData
      : [];

    if (!Array.isArray(rawPosts)) {
      console.warn('Unexpected feed response shape:', responseData);
    }

    return {
      posts: Array.isArray(rawPosts) ? rawPosts : [],
      nextCursor: responseData?.nextCursor ?? null,
      hasMore: responseData?.hasMore === true,
    };
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setFeedError("");
      try {
        const response = await api.get('/api/post/feed');
        console.log('📥 Initial feed response:', response.data);
        const { posts, nextCursor: cursor, hasMore: more } = parseFeedResponse(response.data);
        console.log('✅ Parsed initial feed:', { postsCount: posts.length, cursor, hasMore: more });

        const processedPosts = posts.map((post) => sanitizePost(post));

        if (isMounted) {
          setpostData(processedPosts);
          setNextCursor(cursor);
          setHasMore(more && posts.length > 0);
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
        if (isMounted) {
          setpostData([]);
          setFeedError('Failed to load posts. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchMorePosts = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMore) {
      console.warn('⚠️ Cannot fetch more:', { hasMore, nextCursor, loadingMore });
      return;
    }

    console.log('🔄 Fetching more posts with cursor:', nextCursor);
    setLoadingMore(true);
    setFeedError("");

    try {
      const url = `/api/post/feed?cursor=${encodeURIComponent(nextCursor)}`;
      console.log('📤 Request URL:', url);
      const response = await api.get(url);
      console.log('📥 Pagination response:', response.data);
      const { posts, nextCursor: cursor, hasMore: more } = parseFeedResponse(response.data);
      console.log('✅ Parsed pagination:', { postsCount: posts.length, nextCursor: cursor, hasMore: more });
      
      const processedPosts = posts.map((post) => sanitizePost(post));

      setpostData((prev) => {
        const updated = Array.isArray(prev) ? [...prev, ...processedPosts] : processedPosts;
        console.log('📊 Updated postData length:', updated.length);
        return updated;
      });
      setNextCursor(cursor);
      setHasMore(more && posts.length > 0);
      console.log('✨ State updated:', { newHasMore: more && posts.length > 0, newCursor: cursor });
    } catch (error) {
      console.error('❌ Error loading more posts:', error);
      setFeedError('Unable to load more posts. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor]);

  useEffect(() => {
    if (!loadMoreRef.current) {
      console.warn('⚠️ loadMoreRef not available');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log('👁️ Observer fired:', { isIntersecting: entry.isIntersecting, hasMore, loadingMore, nextCursor });
        if (entry.isIntersecting && hasMore && !loadingMore && nextCursor) {
          console.log('🎯 Triggering fetchMorePosts');
          fetchMorePosts();
        }
      },
      {
        rootMargin: '300px',
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);
    console.log('👁️ Observer attached to sentinel element');

    return () => {
      observer.disconnect();
      console.log('👁️ Observer disconnected');
    };
  }, [hasMore, loadingMore, nextCursor, fetchMorePosts]);

  const handleOpenComments = async (postId) => {
    if (!user?._id) {
      showModal("login");
      return;
    }
    setCommentError("");
    setCommentInput("");
    setCommentModalPostId(postId);

    if (commentsByPost[postId]) {
      return;
    }

    setCommentLoading(true);
    try {
      const response = await api.get(`/api/comments/${postId}`);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: Array.isArray(response.data) ? response.data : [],
      }));
    } catch (error) {
      const resp = error?.response;
      console.error('Error fetching comments:', resp?.data || error.message || error);
      setCommentError(resp?.data?.message || 'Failed to load comments.');
      setCommentsByPost((prev) => ({ ...prev, [postId]: [] }));
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const trimmed = commentInput.trim();
    if (!trimmed) {
      setCommentError('Comment cannot be empty.');
      return;
    }

    const currentUser = user || getStoredUser();
    if (!currentUser?._id) {
      setCommentError('Please log in to post comments.');
      return;
    }

    setCommentError("");
    setCommentPosting(true);

    try {
      const response = await api.post(`/api/comment/${postId}`, {
        userId: currentUser._id,
        userName: currentUser.name || currentUser.userName || 'Anonymous',
        avatar: currentUser.avatar || '',
        content: trimmed,
      });

      const createdComment = response.data?.comment;
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [createdComment, ...(prev[postId] || [])],
      }));
      setCommentInput("");
      showToast("success", "Comment added successfully");
      setpostData((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => {
              if ((item._id || item.id) !== postId) return item;
              return {
                ...item,
                commentsCount: Number(item.commentsCount || 0) + 1,
              };
            })
          : prev
      );
    } catch (err) {
      const resp = err?.response;
      console.error('Error posting comment:', resp?.data || err.message || err);
      const serverMessage = resp?.data?.message || resp?.data || err?.message || 'Unable to send comment.';
      setCommentError(typeof serverMessage === 'string' ? serverMessage : 'Unable to send comment.');
    } finally {
      setCommentPosting(false);
    }
  };

  const handleCloseComments = () => {
    setCommentModalPostId(null);
    setCommentError("");
  };

  const renderComments = (postId) => {
    const comments = commentsByPost[postId] || [];
    return (
      <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3">
        {commentLoading ? (
          <Loader message="Loading comments..." minHeightClass="min-h-[140px]" />
        ) : comments.length === 0 ? (
          <p className="text-white/70">No comments yet. Be the first to comment.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id || comment.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center text-sm">
                  {comment.user?.avatar ? (
                    <Image
                      src={comment.user.avatar}
                      alt={comment.user.userName || 'avatar'}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      unoptimized={true}
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{comment.user?.userName || 'Anonymous'}</p>
                  <p className="text-[11px] text-white/60">{new Date(comment.commentedAt || comment.createdAt || Date.now()).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-white/80 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    );
  };

  const getCurrentComments = (postId) => commentsByPost[postId] || [];

  const isCommentModalOpen = (postId) => commentModalPostId === postId;

  const commentPostUser = user || getStoredUser();

  const renderCommentModal = (postId) => {
    if (!isCommentModalOpen(postId)) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Comments</h3>
              <p className="text-sm text-white/60">Post a new comment or read the conversation.</p>
            </div>
            <button
              onClick={handleCloseComments}
              className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/80 hover:bg-white/5"
            >
              Close
            </button>
          </div>
          {renderComments(postId)}
          <div className="mt-4 rounded-3xl border border-white/10 bg-black/50 p-3">
            {commentError ? <p className="mb-2 text-sm text-red-400">{commentError}</p> : null}
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={commentPostUser?._id ? 'Write a comment...' : 'Log in to post comments.'}
              className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-black/70 p-3 text-white outline-none placeholder:text-white/40"
              disabled={!commentPostUser?._id}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-white/50">
                {commentPostUser?._id ? `Commenting as ${commentPostUser.name || commentPostUser.userName}` : 'You must be logged in to comment.'}
              </span>
              <button
                onClick={() => handleCommentSubmit(postId)}
                disabled={commentPosting || !commentInput.trim() || !commentPostUser?._id}
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commentPosting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentComments = commentModalPostId ? getCurrentComments(commentModalPostId) : [];

  const handleVote = async (postId, optionIndex) => {
    if (!postId) {
      console.warn('Missing postId for vote');
      return;
    }

    if (!user?._id) {
      showModal("login");
      return;
    }

    if (!Number.isInteger(optionIndex) || optionIndex < 0) {
      console.warn('Invalid poll option index', optionIndex);
      return;
    }

    try {
      const res = await api.post(`/api/post/vote/${postId}`, { optionIndex });
      const updatedPost = res.data?.post || res.data?.updatedPost;

      if (!updatedPost) {
        console.warn('Vote response missing updated post', res.data);
        return;
      }

      const sanitizedUpdatedPost = sanitizePost(updatedPost);

      setpostData(prev =>
        Array.isArray(prev)
          ? prev.map(p => {
              const id = p._id || p.id;
              return id === postId ? sanitizedUpdatedPost : p;
            })
          : prev
      );
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
  <>
    <div className="w-full max-sm:px-0 overflow-x-hidden">
      {loading ? (
        <Loader message="Loading posts..." minHeightClass="min-h-[260px]" />
      ) : feedError ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/80">
          <p>{feedError}</p>
        </div>
      ) : Array.isArray(postData) && postData.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/80">
          <p>No posts available yet.</p>
        </div>
      ) : (
        <>
          {Array.isArray(postData) &&
            postData.map((post) => (
          <div
  key={post._id}
  className="
    group relative overflow-hidden
    rounded-3xl max-sm:rounded-2xl border border-white/[0.08]
    bg-black/30
    backdrop-blur-xl
    shadow-[0_10px_40px_rgba(0,0,0,0.45)]
    hover:border-white/[0.14]
    hover:shadow-[0_15px_60px_rgba(0,0,0,0.55)]
    transition-all duration-500
    p-3 sm:p-5 mb-4
  "
>

  {/* subtle glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none">
    <div className="absolute -top-20 left-0 w-52 h-52 bg-orange-500/10 blur-3xl rounded-full" />
  </div>

  {/* TOP */}
  <div className="relative z-10 flex items-start justify-between gap-3">

    {/* LEFT */}
    <div className="flex items-center gap-3 min-w-0 flex-1">

      {/* Avatar */}
      <div className="
        relative shrink-0
        rounded-full p-[2px]
      ">
        <div className="
          w-10 h-10 sm:w-12 sm:h-12
          rounded-full overflow-hidden
          bg-black/40 border border-white/10
        ">
          <Avatar
          loading='lazy'
            src={post.user?.avatar}
            alt={post.user?.userName || "avatar"}
            size={60}
          />
        </div>
      </div>

      {/* USER INFO */}
      <div className="flex flex-col min-w-0">

        <h2 className="
          text-[15px] sm:text-[17px]
          font-semibold tracking-wide
          text-white truncate
        ">
          {post.user?.userName || "Anonymous"}
        </h2>

        <div className="flex items-center gap-2 mt-0.5">

          <span className="
            text-[11px] sm:text-xs
            text-orange-300/90
            bg-orange-500/10
            border border-orange-400/10
            px-2 py-[2px]
            rounded-full
            truncate
          ">
            {post.user?.title || "Cinephile"}
          </span>

          <span className="text-[10px] text-white/30">
            •
          </span>

          <span className="text-[10px] sm:text-xs text-white/40">
            Film Enthusiast
          </span>
        </div>

      </div>
    </div>

    {/* POST TYPE */}
    <div className="
      text-[10px] sm:text-xs
      px-3 py-1.5
      rounded-full
      border border-white/10
      bg-white/[0.03]
      text-white/70
      backdrop-blur-md
      whitespace-nowrap
      shrink-0
    ">
      {post.postType === "poll" ? " Poll" : " Post"}
    </div>
  </div>

  {/* TITLE */}
  <h1 className="
    relative z-10
    mt-5
    text-[20px] sm:text-2xl
    font-bold
    leading-tight
    tracking-tight
    text-white
    px-1
  ">
    {post.title || "Untitled"}
  </h1>

  {/* CONTENT */}
  <p className="
    relative z-10
    mt-3
    text-[14px] sm:text-[15px]
    leading-7
    text-white/75
    whitespace-pre-wrap
    break-words
    px-1
  ">
    {post.content}
  </p>

  {/* MEDIA */}
  {post.media?.length > 0 &&
    post.media[0] &&
    typeof post.media[0] === "string" &&
    post.media[0].trim() !== "" && (

      <div className="relative mt-5">

        <div className="
          overflow-hidden rounded-2xl
          border border-white/10
          bg-black/30
        ">

          <Image
          loading='lazy'
            src={post.media[0]}
            alt="post media"
            width={800}
            height={600}
            className="
              w-full h-auto object-cover
              max-h-[550px]
              transition duration-700
              group-hover:scale-[1.02]
            "
            priority={false}
            quality={75}
            optimized={true}
            onError={(e) => {
              console.error(
                "Image failed to load from URL:",
                post.media[0]
              );
              e.currentTarget.style.display = "none";
            }}
          />

        </div>

      </div>
    )}

  {/* POLL */}
  {post.postType === "poll" && post.poll?.options && (
    <div className="mt-5 space-y-3">

      {post.poll.options.map((opt, i) => {

        const totalVotes = post.poll.options.reduce(
          (sum, o) => sum + o.votes,
          0
        );

        const percentage = totalVotes
          ? Math.round((opt.votes / totalVotes) * 100)
          : 0;

        return (
          <div
            key={i}
            onClick={() => handleVote(post._id || post.id, i)}
            className="
              relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-white/[0.03]
              p-3 cursor-pointer
              hover:bg-white/[0.05]
              transition-all duration-300
            "
          >

            <div
              className="
                absolute top-0 left-0 h-full
                bg-gradient-to-r from-orange-500/30 to-orange-400/10
              "
              style={{ width: `${percentage}%` }}
            />

            <div className="
              relative z-10
              flex items-center justify-between gap-4
            ">
              <span className="
                text-sm sm:text-[15px]
                text-white/90
              ">
                {opt.text}
              </span>

              <span className="
                text-xs sm:text-sm
                font-medium
                text-orange-300
              ">
                {percentage}%
              </span>
            </div>

          </div>
        );
      })}
    </div>
  )}

  {/* ACTIONS */}
  <div className="
    relative z-10
    flex items-center gap-6
    mt-5 pt-4
    border-t border-white/10
  ">

    {/* LIKE */}
    <button
      onClick={() => handleLike(post._id || post.id)}
      disabled={processingLikes[post._id || post.id]}
      className="
        flex items-center gap-2
        text-white/60 hover:text-orange-300
        transition duration-300
        disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed
      "
    >
      <span 
        style={{
          display: 'inline-block',
          animation: likeAnimation[post._id || post.id] ? 'likePopBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
        }}
        className="text-lg sm:text-xl"
      >
        {post.isLiked ? <AiFillLike /> : <AiOutlineLike />}
      </span>

      <span className="text-sm font-medium">
        {post.likesCount}
      </span>
    </button>

    {/* COMMENT */}
    <button
      onClick={() => handleOpenComments(post._id || post.id)}
      className="
        flex items-center gap-2
        text-white/60 hover:text-purple-300
        transition duration-300 cursor-pointer
      "
    >
      <span className="text-lg sm:text-xl">
        <FaRegComment />
      </span>

      <span className="text-sm font-medium">
        {post.commentsCount}
      </span>
    </button>

    {/* SHARE */}
    <button
      onClick={() => handleShareClick(post._id || post.id)}
      className="
        flex items-center gap-2
        text-white/60 hover:text-blue-300
        transition duration-300 cursor-pointer
      "
    >
      <span className="text-lg sm:text-xl">
        <Share2 className="w-4.5 h-4.5" />
      </span>

      <span className="text-sm font-medium">
        Share
      </span>
    </button>
  </div>

  {/* DATE */}
  <p className="
    relative z-10
    mt-4
    text-[11px]
    text-white/35
  ">
    {new Date(
      post.postedAt ||
      post.createdAt ||
      Date.now()
    ).toLocaleString()}
  </p>
</div>
        ))}

          {postData.length > 0 && (
            <div
              ref={loadMoreRef}
              className="flex justify-center mt-6 text-sm text-white/60"
            >
              {loadingMore
                ? 'Loading more posts…'
                : hasMore
                ? 'Scroll to load more posts…'
                : 'No more posts to load.'}
            </div>
          )}
        </>
      )}
    </div>

    {/* Comment Modal - Rendered outside post loop, positioned relative to viewport */}
    {commentModalPostId && renderCommentModal(commentModalPostId)}
  </>
);
}

export default Postcard;

const styles = `
  @keyframes likePopBounce {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    25% {
      transform: scale(1.35) rotate(10deg);
    }
    50% {
      transform: scale(1.2) rotate(-5deg);
    }
    75% {
      transform: scale(1.15);
      filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.8));
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}