import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (role) => {
    let demoEmail = '';
    if (role === 'student') demoEmail = 'student@example.com';
    if (role === 'admin') demoEmail = 'admin@example.com';
    if (role === 'warden') demoEmail = 'warden@example.com';
    
    setEmail(demoEmail);
    setPassword('password');
    
    setTimeout(() => {
      const form = document.getElementById('login-form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="h-6 w-6 text-white" strokeWidth={1.8} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mt-4">Smart Hostel</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">Demo access</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleDemoLogin('student')}
                className="px-4 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Student
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="px-4 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => handleDemoLogin('warden')}
                className="px-4 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Warden
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;