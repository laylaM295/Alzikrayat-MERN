import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import socket from "../services/socket";
import "../styles/CommentSection.css";

function addCommentOnce(previous, incoming) {
  if (!incoming?._id) return previous;

  const alreadyExists = previous.some(
    (comment) => comment._id === incoming._id
  );

  if (alreadyExists) return previous;

  return [incoming, ...previous];
}

function CommentSection({ photoId }) {
  const { user, isAuthenticated } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [socketConnected, setSocketConnected] = useState(socket.connected);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/comments/${photoId}`);

      const loadedComments = Array.isArray(response)
        ? response
        : response?.comments || response?.data || [];

      setComments((previous) => {
        const loadedIds = new Set(loadedComments.map((comment) => comment._id));

        const liveCommentsNotInResponse = previous.filter(
          (comment) => !loadedIds.has(comment._id)
        );

        return [...loadedComments, ...liveCommentsNotInResponse];
      });

    } catch (err) {
      setError(err.message || "Unable to load comments.");

    } finally {
      setLoading(false);
    }
  }, [photoId]);

  useEffect(() => {
    if (!photoId) return undefined;

    let isActive = true;

    const handleConnect = () => {
      setSocketConnected(true);

      socket.emit("joinPhoto", photoId, (result) => {
        if (isActive && !result?.success) {
          setError(result?.message || "Could not join real-time comments.");
        }
      });
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleNewComment = (newComment) => {
      if (
        newComment?.photoId?.toString() !== photoId &&
        newComment?.photoId?._id?.toString() !== photoId
      ) {
        return;
      }

      setComments((previous) => addCommentOnce(previous, newComment));
    };

    const handleCommentDeleted = ({
      commentId,
      photoId: deletedPhotoId,
    }) => {
      if (deletedPhotoId?.toString() !== photoId) return;

      setComments((previous) =>
        previous.filter((comment) => comment._id !== commentId)
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newComment", handleNewComment);
    socket.on("commentDeleted", handleCommentDeleted);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    fetchComments();

    return () => {
      isActive = false;

      socket.emit("leavePhoto", photoId);

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newComment", handleNewComment);
      socket.off("commentDeleted", handleCommentDeleted);
    };

  }, [photoId, fetchComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post(`/comments/${photoId}`, {
        comment: trimmedText,
      });

      // The server broadcasts this comment to the room.
      // The API response is also used as a fallback.
      const savedComment = response?.comment;

      if (savedComment) {
        setComments((previous) =>
          addCommentOnce(previous, savedComment)
        );
      }

      setText("");

    } catch (err) {
      setError(err.message || "Failed to add comment.");

    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/comments/${commentId}`);

      setComments((previous) =>
        previous.filter((comment) => comment._id !== commentId)
      );

    } catch (err) {
      setError(err.message || "Failed to delete comment.");
    }
  };

  return (
    <section className="comments-section">

      <div className="comments-heading">
        <h2>Comments ({comments.length})</h2>

        <span
          className={`realtime-status ${
            socketConnected ? "connected" : "disconnected"
          }`}
          aria-live="polite"
        >
          {socketConnected
            ? "Live updates connected"
            : "Connecting to live updates..."}
        </span>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form">

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write your comment..."
            required
            maxLength={1000}
          />

          <button
            type="submit"
            disabled={submitting || !text.trim()}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>

        </form>
      ) : (
        <p>Please login to write a comment.</p>
      )}

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading comments...</p>

      ) : comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>

      ) : (
        <div className="comments-list">

          {comments.map((comment) => {

            const author =
              typeof comment.userId === "object"
                ? comment.userId
                : null;

            const authorName = author
              ? `${author.firstName || ""} ${
                  author.lastName || ""
                }`.trim() ||
                author.username ||
                "User"
              : "User";

            const isOwner =
              user?._id?.toString() === author?._id?.toString();

            return (
              <article
                key={comment._id}
                className="comment-card"
              >

                <h4>{authorName}</h4>

                <p>{comment.comment}</p>

                {comment.dateTime && (
                  <small>
                    {new Date(comment.dateTime).toLocaleString()}
                  </small>
                )}

                {isOwner && (
                  <button
                    type="button"
                    className="delete-comment-btn"
                    onClick={() => handleDelete(comment._id)}
                  >
                    Delete
                  </button>
                )}

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default CommentSection;