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
    role: "student",
    roomNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // 🔥 Gmail validation
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation
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

    if (formData.role === "student" && !formData.roomNumber) {
      setError("Room number is required for students");
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;

    const result = await register(userData);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-md">
            <Building2 className="h-6 w-6 text-white" />
          </div>

          <h1 className="text-xl font-semibold mt-4">
            Create Account
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Join Smart Hostel 🚀
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
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
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
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
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
          />

          {/* ROLE */}
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
          >
            <option value="student">Student</option>
            <option value="warden">Warden</option>
            <option value="admin">Admin</option>
          </select>

          {/* ROOM (only student) */}
          {formData.role === "student" && (
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
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />
          )}

          {/* PASSWORD */}
          <input
            type="password"
            required
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
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
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;