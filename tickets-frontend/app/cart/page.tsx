'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import { CartItem } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // 1. IMPORT CONTEXT

export default function CartPage() {
  const router = useRouter();
  const { token } = useAuth(); // 2. AMBIL TOKEN USER
  
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // 1. Fetch Data Cart (DENGAN TOKEN)
  useEffect(() => {
    const fetchCart = async () => {
      // Jika tidak ada token, stop (atau redirect login)
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/api/cart', {
            // 3. TAMBAHKAN HEADER AUTHORIZATION
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        
        const json = await res.json();
        if (res.ok) {
            setCarts(json.data);
        } else if (res.status === 401) {
            // Token expired
            router.push('/login');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, router]); // Jalankan ulang jika token berubah

  // 2. Fungsi Hapus Item (DENGAN TOKEN)
  const handleDelete = async (id: number) => {
    if(!confirm('Hapus item ini?')) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/cart/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // Wajib kirim token juga saat delete
          }
      });
      setCarts(carts.filter(item => item.id !== id));
      setSelectedIds(selectedIds.filter(selId => selId !== id));
    } catch (error) {
      alert('Gagal menghapus');
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const grandTotal = carts
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.total_price, 0);

  // 5. Logic Checkout (DENGAN TOKEN)
  const handleCheckout = async () => {
    if (selectedIds.length === 0) return alert('Pilih minimal 1 item!');
    
    setIsCheckingOut(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/checkout', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // Wajib kirim token saat checkout
        },
        body: JSON.stringify({
          cart_ids: selectedIds,
          payment_method: paymentMethod
        })
      });

      const json = await res.json();

      if (res.ok) {
        router.push(`/tickets/${json.booking_code}`);
      } else {
        alert('Checkout Gagal: ' + json.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold text-[#0B2F5E] mb-8">Keranjang Belanja</h1>

        {carts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-500 mb-4">Keranjang Anda masih kosong.</p>
            <Link href="/" className="text-[#F57C00] font-bold hover:underline">Jelajahi Wisata</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LIST ITEM */}
            <div className="flex-1 space-y-4">
              {carts.map((item) => (
                <div key={item.id} className={`bg-white p-4 rounded-2xl border transition-all flex gap-4 ${selectedIds.includes(item.id) ? 'border-[#F57C00] shadow-md' : 'border-gray-100 shadow-sm'}`}>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-[#F57C00] cursor-pointer"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </div>

                  <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.destination.image_url || ''} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#0B2F5E] line-clamp-1">{item.destination.name}</h3>
                    <div className="flex flex-col text-sm text-gray-500 mt-1 gap-1">
                      <div className="flex items-center gap-1">
                         <Calendar className="w-3 h-3" /> {item.visit_date}
                      </div>
                      <div className="flex items-center gap-1">
                         <MapPin className="w-3 h-3" /> {item.quantity} Tiket
                      </div>
                    </div>
                    <p className="text-[#F57C00] font-bold mt-2">Rp {item.total_price.toLocaleString('id-ID')}</p>
                  </div>

                  <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 h-fit">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* CHECKOUT BOX */}
            <div className="lg:w-80 h-fit bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="font-bold text-[#0B2F5E] mb-4">Ringkasan Belanja</h3>
              
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Total Item ({selectedIds.length})</span>
                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="border-t border-dashed my-4"></div>

              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Metode Bayar</p>
                <div className="space-y-2">
                    {['qris', 'transfer', 'cod'].map(method => (
                        <label key={method} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${paymentMethod === method ? 'border-[#F57C00] bg-orange-50' : 'border-gray-200'}`}>
                            <input type="radio" name="pay" value={method} checked={paymentMethod === method} onChange={e => setPaymentMethod(e.target.value)} className="accent-[#F57C00]"/>
                            <span className="capitalize">{method}</span>
                        </label>
                    ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-700">Grand Total</span>
                <span className="text-xl font-extrabold text-[#F57C00]">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={selectedIds.length === 0 || isCheckingOut}
                className="w-full bg-[#0B2F5E] hover:bg-[#061A35] text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isCheckingOut ? <Loader2 className="animate-spin w-4 h-4"/> : 'Checkout'}
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}