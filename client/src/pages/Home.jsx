import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPhotos } from "../services/api";
import PhotoCard from "../components/PhotoCard";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";


function Home() {
  const { user, isAuthenticated } = useAuth();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPhotos();

      const photosData = Array.isArray(response)
        ? response
        : response?.photos || response?.data || [];

      setPhotos(photosData);
    } catch (err) {
      setError(
        err.message || "Failed to load photos. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <main className="home-page">
      <section className="hero">
        <h1>Welcome to Alzikrayat</h1>

        <p>
          Share your beautiful memories and discover
          amazing moments captured by others.
        </p>

        {isAuthenticated ? (
          <div>
            <h3>
              Welcome back,{" "}
              {user?.username || user?.firstName || user?.name || "User"}!
            </h3>

            <Link to="/upload" className="btn btn-primary">
              Share a Photo
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/register" className="btn btn-primary">
              Join Alzikrayat
            </Link>

            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        )}
      </section>

      <section className="home-gallery">
        <h2>Recent Memories</h2>

        {loading && <p>Loading photos...</p>}

        {error && (
          <div>
            <p className="error-message">{error}</p>

            <button type="button" onClick={fetchPhotos}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <p>No photos available yet. Be the first to share!</p>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="photos-grid">
            {photos.map((photo) => (
              <PhotoCard
                key={photo._id || photo.id}
                photo={photo}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;