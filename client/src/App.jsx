import { Routes, Route } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadPhoto from "./pages/UploadPhoto";
import Profile from "./pages/Profile";
import PhotoDetails from "./pages/PhotoDetails";
import NotFound from "./pages/NotFound";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/gallery" element={<Gallery />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/photos/:id" element={<PhotoDetails />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
            />
          }
        >
          <Route path="/upload" element={<UploadPhoto />} />

          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;