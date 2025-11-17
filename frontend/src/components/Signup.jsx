import React, { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Simple validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Mock submit
    console.log('Form submitted', formData);
    setSuccess(true);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Create your Vetri Finance account to start managing money together.
      </p>

      <form
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-2 text-center">
            Account created successfully!
          </div>
        )}

        <div className="flex flex-col">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
        </div>

        <div className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
        </div>

        <div className="flex flex-col">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
