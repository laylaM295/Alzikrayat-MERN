import { useState } from "react";
import { Link } from "react-router-dom";
import PhotoCard from "../components/PhotoCard";

const samplePhotos = [
  {
    _id: "1",
    image: "https://picsum.photos/id/1011/600/400",
    caption: "Beautiful Nature",
    username: "Ahmed",
    createdAt: "2026-11-17"
  },
  {
    _id: "2",
    image: "https://picsum.photos/id/1015/600/400",
    caption: "Mountain View",
    username: "Sara",
    createdAt: "2026-11-17"
  },
  {
    _id: "3",
    image: "https://picsum.photos/id/1016/600/400",
    caption: "Amazing Landscape",
    username: "Mohamed",
    createdAt: "2026-11-17"
  }
];

function Gallery() {

  const [layout, setLayout] = useState("grid");

  const photos = samplePhotos;

  return (
    <main className="gallery-page">

      <h1>Photo Gallery</h1>

      <p>Explore beautiful memories shared by our users.</p>

      <div className="gallery-controls">

        <button onClick={() => setLayout("grid")}>
          Grid View
        </button>

        <button onClick={() => setLayout("list")}>
          List View
        </button>

      </div>

      {photos.length === 0 ? (

        <p>No photos available yet.</p>

      ) : (

        <div className={`gallery gallery-${layout}`}>

          {photos.map((photo) => (

            <Link
              to={`/photos/${photo._id}`}
              key={photo._id}
              className="photo-link"
            >

              <PhotoCard photo={photo} />

            </Link>

          ))}

        </div>

      )}

    </main>
  );
}

export default Gallery;