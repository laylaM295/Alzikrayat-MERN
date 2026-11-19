import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry! The page you are looking for
          does not exist.
        </p>

        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;