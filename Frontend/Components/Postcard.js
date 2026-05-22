"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';     //image optimization in nextjs, lazy loading, responsive images, making images light-weight and more efficient image handling.
import { api, getAuthToken } from '@/utils/api.js';
import { useAuth } from '@/context/AuthContext.js';
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
      src={src}
      alt={alt}
      width={finalSize}
      height={finalSize}
      className="rounded-full object-cover w-full h-full"
      onError={() => setErrored(true)}
      unoptimized={typeof src === 'string' && src.startsWith(getFrontendOrigin())}
    />
  );
};

const Postcard = () => {
  const [postData, setpostData] = useState([]);   // jab multiple data backend se aa rha hai tab empty array use krte hain and jab single document aa rha tab null use krte hain.
  const [loading, setLoading] = useState(true);
  const [processingLikes, setProcessingLikes] = useState({});
  const [commentModalPostId, setCommentModalPostId] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentPosting, setCommentPosting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const { user } = useAuth();

  const handleLike = async (postId) => {
    if (!postId) {
      console.warn("Missing postId for like toggle");
      return;
    }

    const post = postData.find((item) => item._id === postId || item.id === postId);
    const currentlyLiked = post?.isLiked || false;
    const currentCount = Number(post?.likesCount ?? 0);

    // Do not block here if access token is missing — allow the API call to trigger
    // the interceptor refresh logic which will obtain a new access token if possible.

    setProcessingLikes((prev) => ({ ...prev, [postId]: true }));

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/post/feed');
        const posts = response.data.post;
        console.log("Raw posts from backend:", posts);

        // Process posts and ensure avatars are available
        const processedPosts = posts.map((post) => sanitizePost(post));

        console.log("Processed posts with avatars:", processedPosts);
        setpostData(processedPosts);
      } catch (error) {
        console.error('Error fetching post data:', error);
        setpostData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenComments = async (postId) => {
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
          <p className="text-white/70">Loading comments...</p>
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
                      unoptimized={typeof comment.user.avatar === 'string' && comment.user.avatar.startsWith(getFrontendOrigin())}
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
        <p className="text-center text-xl sm:text-base text-white/70 py-6 overflow-hidden">
          Loading...
        </p>
      ) : (
        Array.isArray(postData) &&
        postData.map((post) => (
          <div
            key={post._id}
            className="p-3 sm:p-4 border border-white/10 rounded-2xl mb-4 bg-black/30 font-[gilroy] w-full overflow-hidden max-sm:rounded-xl"
          >
            {/* TOP */}
            <div className="w-full flex items-start justify-between gap-3">
              
              {/* LEFT */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="border border-white/10 rounded-full w-10 h-10 sm:w-11 sm:h-11 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                  <Avatar src={post.user?.avatar} alt={post.user?.userName || 'avatar'} size={44} />
                </div>

                <div className="flex flex-col min-w-0 overflow-hidden">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-white/80 truncate">
                    {post.user?.userName || "Anonymous"}
                  </h2>

                  <span className="text-[10px] sm:text-xs text-white/40 font-normal truncate">
                    {post.user?.title || "Cinephile"}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <p className="text-[10px] sm:text-sm text-white/70 whitespace-nowrap shrink-0">
                {post.postType === "poll" ? "📊 Poll" : "📝 Post"}
              </p>
            </div>

            {/* TITLE */}
            <h1 className="text-[17px] sm:text-xl font-bold text-white mt-4 px-1 sm:px-3 leading-snug break-words">
              {post.title || "Untitled"}
            </h1>

            {/* CONTENT */}
            <p className="text-[13px] sm:text-base text-white/85 mt-2 px-1 sm:px-3 py-1 leading-relaxed break-words whitespace-pre-wrap">
              {post.content}
            </p>

            {/* MEDIA */}
            {post.media?.length > 0 &&
              post.media[0] &&
              typeof post.media[0] === "string" &&
              post.media[0].trim() !== "" && (
                <div className="relative mt-3 mb-2">
                  <div className="relative w-full bg-black/30 rounded-xl overflow-hidden">
                    <Image
                      src={post.media[0]}
                      alt="post media"
                      width={800}
                      height={600}
                      className="rounded-xl w-full h-auto object-cover max-h-[520px] max-sm:max-h-[350px]"
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

                  {/* MEDIA USER OVERLAY */}
                  <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full max-w-[80%]">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                      <Avatar src={post.user?.avatar} alt={post.user?.userName || 'avatar'} size={32} small />
                    </div>

                    <span className="text-[10px] sm:text-xs text-white/90 font-medium truncate">
                      {post.user?.userName || "Anonymous"}
                    </span>
                  </div>
                </div>
              )}

            {/* POLL */}
            {post.postType === "poll" && post.poll?.options && (
              <div className="mt-3 space-y-2">
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
                      className="relative p-2.5 sm:p-3 bg-white/5 rounded-xl cursor-pointer overflow-hidden"
                    >
                      <div
                        className="absolute top-0 left-0 h-full bg-orange-500/30"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative flex items-center justify-between gap-3">
                        <span className="text-[13px] sm:text-base text-white break-words flex-1">
                          {opt.text}
                        </span>

                        <span className="text-[11px] sm:text-sm text-white/80 shrink-0">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between mb-1 mt-2 px-4 gap-4 w-25">
              <button
                onClick={() => handleLike(post._id || post.id)}
                disabled={processingLikes[post._id || post.id]}
                className="text-white/80 hover:text-white text-md lg:text-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={post.isLiked ? "Unlike post" : "Like post"}
              >
                {post.isLiked ? <AiFillLike /> : <AiOutlineLike />}
              </button>
              <p className="text-white/80 text-md lg:text-lg font-medium">
                {post.likesCount}
              </p>
              <button
                onClick={() => handleOpenComments(post._id || post.id)}
                className="text-white/80 hover:text-white text-md lg:text-xl cursor-pointer"
                aria-label="View comments"
              >
                <FaRegComment />
              </button>
              <p className="text-white/80 text-md lg:text-lg font-medium">
                {post.commentsCount}
              </p>
            </div>

            {renderCommentModal(post._id || post.id)}

            {/* DATE AND TIME */}
            <p className="text-[8px] sm:text-sm text-white/60 py-2 border-t border-white/10 mt-4">
              {new Date(post.postedAt || post.createdAt || Date.now()).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  </>
);
}

export default Postcard;