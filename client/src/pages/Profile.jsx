import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PhotoCard from "../components/PhotoCard";
import "../styles/profile.css";

function Profile() {
  const { user, logout } = useAuth();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyPhotos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/photos/my");

      const photosData = Array.isArray(response)
        ? response
        : response?.photos || response?.data || [];

      setPhotos(photosData);
    } catch (err) {
      setError(err.message || "Unable to load your photos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPhotos();
  }, []);

  const handleDeletePhoto = async (photoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/photos/${photoId}`);

      setPhotos((previous) =>
        previous.filter((photo) => photo._id !== photoId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete photo.");
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-header">
        <h1>My Profile</h1>

        <h2>
          {user?.firstName ||
            user?.username ||
            user?.name ||
            "User"}
        </h2>

        <p>{user?.email}</p>

        <p>Total Photos: {photos.length}</p>

        <Link to="/upload" className="btn btn-primary">
          Upload New Photo
        </Link>

        <button
          type="button"
          onClick={logout}
          className="btn btn-secondary"
        >
          Logout
        </button>
      </section>

      <section className="profile-gallery">
        <h2>My Memories</h2>

        {loading && <p>Loading your photos...</p>}

        {error && (
          <div>
            <p className="error-message">{error}</p>

            <button type="button" onClick={fetchMyPhotos}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <p>You haven't uploaded any photos yet.</p>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="photos-grid">
            {photos.map((photo) => (
              <PhotoCard
                key={photo._id}
                photo={photo}
                onDelete={handleDeletePhoto}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;