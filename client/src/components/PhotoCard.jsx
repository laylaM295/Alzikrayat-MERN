import { Link } from "react-router-dom";

const SERVER_URL = "http://localhost:5000";

function PhotoCard({ photo, onDelete }) {
  const photoId = photo._id || photo.id;
  const imageFile = photo.fileName || photo.image;

  const imageUrl = imageFile
    ? imageFile.startsWith("http")
      ? imageFile
      : `${SERVER_URL}/uploads/${imageFile}`
    : "";

  const uploader =
    typeof photo.userId === "object" && photo.userId
      ? photo.userId.username ||
        photo.userId.firstName ||
        photo.userId.name ||
        "User"
      : "Alzikrayat User";

  return (
    <article className="photo-card">
      <Link to={`/photos/${photoId}`} className="photo-card-link">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={photo.title || "Shared memory"}
            className="photo-card-image"
          />
        ) : (
          <div className="photo-image-placeholder">
            No Image Available
          </div>
        )}

        <div className="photo-card-content">
          <h3>{photo.title || "Untitled Memory"}</h3>

          <p>
            {photo.description || "No description available."}
          </p>
        </div>
      </Link>

      <div className="photo-card-footer">
        <span>By: {uploader}</span>

        {onDelete && (
          <button
            type="button"
            className="delete-photo-btn"
            onClick={() => onDelete(photoId)}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

export default PhotoCard;