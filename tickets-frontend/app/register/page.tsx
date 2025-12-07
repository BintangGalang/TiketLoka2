'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          throw new Error(firstError[0]);
        }
        throw new Error(data.message || 'Registrasi gagal');
      }

      login(data.access_token, data.user);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#F57C00] p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Buat Akun Baru</h1>
          <p className="text-orange-100 text-sm">Mulai petualangan wisatamu!</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nama */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                name="name"
                type="text"
                placeholder="Nama Lengkap"
                required
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00]"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00]"
              />
            </div>

            {/* Nomor HP */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                name="phone_number"
                type="text"
                placeholder="Nomor WhatsApp"
                required
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                name="password"
                type="password"
                placeholder="Password (Min. 8)"
                required
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00]"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                name="password_confirmation"
                type="password"
                placeholder="Ulangi Password"
                required
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0B2F5E] hover:bg-[#061A35] text-white font-bold py-3 rounded-xl mt-2 transition-all flex justify-center disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Daftar Akun'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#F57C00] font-bold hover:underline">
              Login disini
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
