import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import CommentSection from "../components/CommentSection";
import "../styles/PhotoDetails.css";

const SERVER_URL = "http://localhost:5000";

function PhotoDetails() {
  const { id } = useParams();

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPhoto = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/photos/${id}`);

      setPhoto(response.photo || response.data || response);
    } catch (err) {
      setError(err.message || "Unable to load photo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, [id]);

  if (loading) {
    return <p>Loading photo details...</p>;
  }

  if (error || !photo) {
    return (
      <main className="photo-details">
        <p className="error-message">
          {error || "Photo not found."}
        </p>

        <Link to="/">Back to Home</Link>
      </main>
    );
  }

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
        "User"
      : "Alzikrayat User";

  return (
    <main className="photo-details">
      <Link to="/">Back to Home</Link>

      <article className="photo-details-card">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={photo.title || "Photo"}
            className="photo-details-image"
          />
        )}

        <div className="photo-details-content">
          <h1>{photo.title || "Untitled Memory"}</h1>

          <p>
            {photo.description || "No description available."}
          </p>

          <p>Uploaded by: {uploader}</p>

          {photo.dateTime && (
            <p>
              Date: {new Date(photo.dateTime).toLocaleDateString()}
            </p>
          )}
        </div>
      </article>

      <CommentSection photoId={id} />
    </main>
  );
}

export default PhotoDetails;