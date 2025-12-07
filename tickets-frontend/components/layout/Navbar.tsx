'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { LogOut, User, ShoppingCart, Ticket } from 'lucide-react'; // Tambah icon Ticket
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#0B2F5E]">Tiket<span className="text-[#F57C00]">Loka</span></span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-[#0B2F5E] font-medium transition">
              Beranda
            </Link>

            {/* --- PERBAIKAN: TAMPILKAN 'TIKET SAYA' LANGSUNG JIKA LOGIN --- */}
            {user && (
              <Link href="/tickets" className="text-gray-600 hover:text-[#0B2F5E] font-medium transition flex items-center gap-1">
                <Ticket className="w-4 h-4" /> Tiket Saya
              </Link>
            )}
            {/* ----------------------------------------------------------- */}

            <Link href="/cart" className="text-gray-600 hover:text-[#0B2F5E] transition relative">
                <ShoppingCart className="w-5 h-5"/>
            </Link>
            
            {/* LOGIC LOGIN/LOGOUT */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-[#0B2F5E] font-bold py-2">
                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                      <User className="w-4 h-4 text-[#0B2F5E]" />
                   </div>
                   <span className="max-w-[100px] truncate">{user.name}</span>
                </button>
                
                {/* Dropdown Menu (Muncul saat hover) */}
                <div className="absolute right-0 mt-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block p-2 animate-in fade-in slide-in-from-top-2">
                   {/* Kita tambahkan juga di sini sebagai cadangan */}
                   <Link href="/tickets" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Ticket className="w-4 h-4" /> Tiket Saya
                   </Link>
                   <div className="border-t my-1"></div>
                   <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-[#0B2F5E] font-bold hover:underline">Masuk</Link>
                <Link href="/register" className="bg-[#F57C00] text-white px-5 py-2 rounded-full font-bold hover:bg-[#E65100] transition shadow-md shadow-orange-200">
                  Daftar
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}