import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Upload.css";

function UploadPhoto() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please select a photo.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("photo", image);

      await api.post("/photos", formData);

      navigate("/");
    } catch (err) {
      setError(err.message || "Photo upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-page">
      <h1>Share a New Memory</h1>

      <form onSubmit={handleSubmit} className="upload-form">
        <div>
          <label htmlFor="title">Photo Title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter photo title"
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about this memory"
          />
        </div>

        <div>
          <label htmlFor="photo">Choose Photo</label>

          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
            required
          />
        </div>

        {image && (
          <p>Selected file: {image.name}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Photo"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}

export default UploadPhoto;