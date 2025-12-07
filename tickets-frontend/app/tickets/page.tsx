'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Calendar, ChevronRight, Ticket, Loader2, AlertCircle } from 'lucide-react';
import { Booking } from '@/types';
import { useAuth } from '@/context/AuthContext'; // 1. Import Auth

export default function MyTicketsPage() {
  const { token, isLoading: authLoading } = useAuth(); // 2. Ambil Token
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tunggu sampai status login selesai dicek
    if (authLoading) return;

    const fetchBookings = async () => {
      // Jika tidak ada token (belum login), stop loading
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/api/my-bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // 3. KIRIM TOKEN DISINI
          }
        });
        
        const json = await res.json();
        
        if (res.ok) {
            setBookings(json.data);
        } else {
            console.error("Gagal ambil tiket:", json.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, authLoading]); // Jalankan ulang jika token berubah

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-md mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold text-[#0B2F5E] mb-6">Tiket Saya</h1>

        {/* Loading State */}
        {(loading || authLoading) ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#F57C00]" /></div>
        ) : !token ? (
           /* State Belum Login */
           <div className="text-center py-10 text-gray-500 bg-white rounded-2xl shadow-sm p-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-[#F57C00]" />
            <p className="font-medium">Silakan login untuk melihat tiket Anda.</p>
            <Link href="/login" className="mt-4 inline-block bg-[#0B2F5E] text-white px-6 py-2 rounded-full font-bold">Login Sekarang</Link>
          </div>
        ) : bookings.length === 0 ? (
          /* State Tiket Kosong */
          <div className="text-center py-10 text-gray-500 bg-white rounded-2xl shadow-sm p-8">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Belum ada tiket aktif.</p>
            <Link href="/" className="text-[#F57C00] text-sm mt-2 block hover:underline">Cari wisata sekarang</Link>
          </div>
        ) : (
          /* List Tiket */
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link 
                href={`/tickets/${booking.booking_code}`} 
                key={booking.id}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-[#F57C00] transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${
                      booking.status === 'success' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-2 font-mono">#{booking.booking_code}</p>
                  </div>
                  <span className="text-[#F57C00] font-bold">
                    Rp {booking.grand_total.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-100 pt-3">
                  {booking.details.map((detail, idx) => (
                    <div key={idx} className="flex gap-3 mb-2 last:mb-0">
                      <div className="h-10 w-10 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                         <img src={detail.destination.image_url || ''} className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{detail.destination.name}</p>
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                          <Calendar className="w-3 h-3" />
                          {detail.visit_date} • {detail.quantity} pax
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-end">
                  <span className="text-xs font-bold text-[#0B2F5E] flex items-center">
                    Buka QR Code <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}