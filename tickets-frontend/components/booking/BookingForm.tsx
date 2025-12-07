'use client';

import { useState, useEffect } from 'react'; // Tambah useEffect
import { Calendar, Ticket, Minus, Plus, ShoppingCart } from 'lucide-react';
import BookingModal from './BookingModal';
import { Destination } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function BookingForm({ destination }: { destination: Destination }) {
  const router = useRouter();
  const { token } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [visitDate, setVisitDate] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // --- TAMBAHAN BARU: DAPATKAN TANGGAL HARI INI (YYYY-MM-DD) ---
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);
  // -------------------------------------------------------------

  const totalPrice = destination.price * quantity;

  // --- FUNGSI BELI LANGSUNG ---
  const handleBook = () => {
    if (!token) {
        alert("Silakan login terlebih dahulu untuk memesan!");
        router.push('/login');
        return;
    }

    if (!visitDate) {
      alert('Silakan pilih tanggal kunjungan dulu!');
      return;
    }
    setIsOpen(true);
  };

  // --- FUNGSI TAMBAH KE KERANJANG ---
  const handleAddToCart = async () => {
    if (!token) {
        if(confirm("Anda harus login untuk menambah ke keranjang. Login sekarang?")) {
            router.push('/login');
        }
        return;
    }

    if (!visitDate) {
      alert('Silakan pilih tanggal kunjungan dulu!');
      return;
    }

    setIsAddingToCart(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination_id: destination.id,
          quantity: quantity,
          visit_date: visitDate,
        }),
      });

      if (res.ok) {
        alert('Berhasil masuk keranjang!');
        router.refresh(); 
      } else {
        const json = await res.json();
        if (res.status === 401) {
            alert("Sesi habis, silakan login ulang.");
            router.push('/login');
            return;
        }
        // Tampilkan pesan error spesifik dari Laravel (misal soal tanggal)
        alert('Gagal: ' + (json.message || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghubungi server');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <div className="sticky top-24 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-6">
        
        <div className="text-center border-b border-dashed border-gray-200 pb-6 mb-6">
          <p className="text-gray-500 text-sm mb-1 font-medium">Harga Tiket Masuk</p>
          <p className="text-4xl font-extrabold text-[#F57C00]">
            Rp {Number(destination.price).toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-400 mt-1">per orang</p>
        </div>

        <div className="space-y-4">
           {/* Input Tanggal */}
           <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <label className="text-xs font-bold text-[#0B2F5E] mb-1 block">Tanggal Kunjungan</label>
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0B2F5E]" />
                <input 
                    type="date" 
                    // --- TAMBAHKAN ATRIBUT MIN DISINI ---
                    min={minDate} 
                    // ------------------------------------
                    className="bg-transparent w-full text-sm font-medium text-gray-700 focus:outline-none"
                    onChange={(e) => setVisitDate(e.target.value)}
                />
            </div>
          </div>

          {/* Input Qty */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
             <span className="text-sm font-bold text-gray-600">Jumlah Tiket</span>
             <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"><Minus className="w-4 h-4 text-gray-600" /></button>
                <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-[#0B2F5E] shadow-sm flex items-center justify-center hover:bg-blue-900"><Plus className="w-4 h-4 text-white" /></button>
             </div>
          </div>

          <div className="flex justify-between items-center text-sm font-medium text-gray-600 px-1">
             <span>Total:</span>
             <span className="text-lg font-bold text-[#F57C00]">
                Rp {totalPrice.toLocaleString('id-ID')}
             </span>
          </div>

          <div className="flex flex-col gap-3">
            <button 
                onClick={handleBook}
                className="w-full bg-[#F57C00] hover:bg-[#E65100] text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
            >
                <Ticket className="w-5 h-5" /> Pesan Sekarang
            </button>
            
            <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-white border-2 border-[#0B2F5E] text-[#0B2F5E] hover:bg-blue-50 font-bold text-lg py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
                {isAddingToCart ? 'Menambahkan...' : (
                    <>
                        <ShoppingCart className="w-5 h-5" /> + Keranjang
                    </>
                )}
            </button>
          </div>

        </div>
      </div>

      <BookingModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        destination={destination}
        selectedDate={visitDate}
        quantity={quantity}
      />
    </>
  );
}