import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Only Gmail addresses are allowed");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const role = result.user?.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin"); // ✅ Admin
      } else {
        navigate("/all-complaints"); // ✅ Student + Warden
      }

    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfcfb] via-[#f0fdf4] to-[#f5f3ff] p-4 overflow-hidden">

      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-100px] right-[-80px] w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>

      <div className="w-full max-w-md relative z-10">

        <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl shadow-lg p-8">

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#e0e7ff] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="h-7 w-7 text-indigo-500" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mt-4">
              Smart Hostel
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Welcome back 👋
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 rounded-xl border bg-white/70"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border bg-white/70"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-[#d9f99d]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{" "}
            <Link to="/register" className="text-indigo-500">
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;