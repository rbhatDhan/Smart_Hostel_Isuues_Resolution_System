import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // ✅ fixed
    roomNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Only Gmail addresses are allowed");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.roomNumber) {
      setError("Room number is required");
      return;
    }

    setLoading(true);

    // ✅ FORCE ROLE = STUDENT (even if tampered)
    const { confirmPassword, ...userData } = {
      ...formData,
      role: "student",
    };

    const result = await register(userData);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfcfb] via-[#f0fdf4] to-[#f5f3ff] p-4">

      <div className="w-full max-w-md">

        <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl shadow-lg p-8">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#e0e7ff] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="h-7 w-7 text-indigo-500" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mt-4">
              Create Account
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Join Smart Hostel 🚀
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />

            {/* EMAIL */}
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />

            {/* ROOM (ONLY FIELD NOW) */}
            <input
              type="text"
              placeholder="Room Number (e.g., A-101)"
              value={formData.roomNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roomNumber: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />

            {/* PASSWORD */}
            <input
              type="password"
              required
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />

            {/* CONFIRM PASSWORD */}
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-gray-800 bg-[#d9f99d] hover:bg-[#bef264] transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 hover:text-indigo-700 font-medium transition"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Register;