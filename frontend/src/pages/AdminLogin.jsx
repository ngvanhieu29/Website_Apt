import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { adminLogin } from '../api/admin';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await adminLogin(
        username,
        password
      );

      localStorage.setItem(
        'adminToken',
        data.token
      );

      localStorage.setItem(
        'adminUser',
        JSON.stringify(data.admin)
      );

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">

          <div className="text-4xl mb-3">
            🏠
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Admin Login
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Apartment Rental Management
          </p>

        </div>


        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading
              ? 'Đang đăng nhập...'
              : 'Đăng nhập'}
          </button>

        </form>

      </div>

    </div>
  );
}