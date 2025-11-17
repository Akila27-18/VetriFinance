import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Mock login request
    setSuccess(true);

    // Save token (pretend login success)
    localStorage.setItem('token', 'mock-auth-token');

    // Redirect
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Log in to access your Vetri Finance dashboard.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded text-center">
            Login successful! Redirecting...
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email}</span>
          )}
        </div>

        {/* Password with show/hide button */}
        <div className="flex flex-col relative">
          <input
            type={showPass ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 pr-10 ${
              errors.password ? 'border-red-500' : ''
            }`}
          />

          {/* Toggle Button */}
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password}</span>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Login
        </button>

        {/* Links */}
        <div className="flex justify-between text-sm mt-1">
          <Link to="/signup" className="text-orange-500 hover:underline">
            Not registered? Sign up
          </Link>

          <Link to="/forgot-password" className="text-gray-600 hover:underline">
            Forgot password?
          </Link>
        </div>

      </form>
    </div>
  );
}
