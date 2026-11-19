import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function CommentSection({ photoId }) {
  const { user, isAuthenticated } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/comments/${photoId}`);

      setComments(
        Array.isArray(response)
          ? response
          : response?.comments || response?.data || []
      );
    } catch (err) {
      setError(err.message || "Unable to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [photoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setSubmitting(true);
      setError("");

      await api.post(`/comments/${photoId}`, {
        comment: text.trim(),
      });

      setText("");
      await fetchComments();
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
      <h2>Comments ({comments.length})</h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your comment..."
            required
          />

          <button type="submit" disabled={submitting}>
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
              ? `${author.firstName || ""} ${author.lastName || ""}`.trim() ||
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