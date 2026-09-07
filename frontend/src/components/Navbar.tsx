import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          Streamly
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/upload"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                Upload
              </Link>

              <Link
                to="/profile"
                className="text-sm text-gray-300 hover:text-white"
              >
                {user?.name || "Profile"}
              </Link>

              <button
                onClick={logout}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-sm text-gray-300 hover:text-white"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
