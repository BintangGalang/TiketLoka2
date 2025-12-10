import { Search } from 'lucide-react';

export default function HeroSection() {
  return (
    // Background Gradient Biru
    <div className="relative bg-gradient-to-br from-[#0B2F5E] via-[#0F3A70] to-[#061A35] pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Jelajahi Wisata <span className="text-[#F57C00]">Tanpa Batas</span>
        </h1>
        <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Platform pemesanan tiket wisata termudah. Temukan destinasi impianmu dan pesan tiketnya sekarang juga di TiketLoka.
        </p>

        {/* Search Bar Widget */}
        <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 ring-1 ring-gray-200/50">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Mau liburan ke mana?" 
              className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2F5E]/20 border-transparent text-gray-800 placeholder:text-gray-400"
            />
          </div>
          
          {/* TOMBOL CARI TIKET (FIXED) */}
          {/* Menggunakan bg-[#F57C00] agar oranye-nya pasti keluar */}
          <button className="bg-[#F57C00] hover:bg-[#E65100] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
            Cari Tiket
          </button>
        </div>
      </div>
    </div>
  );
}