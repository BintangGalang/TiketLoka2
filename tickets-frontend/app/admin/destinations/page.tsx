'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, Edit, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Destination } from '@/types';

export default function AdminDestinations() {
  const { token } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Fetch Data
  async function fetchDestinations() {
    const res = await fetch('http://127.0.0.1:8000/api/destinations'); // Public route ok
    const json = await res.json();
    setDestinations(json.data);
  }

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Handle Delete
  const handleDelete = async (id: number) => {
    if(!confirm('Yakin hapus wisata ini?')) return;
    
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/destinations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if(res.ok) {
            alert('Berhasil dihapus');
            fetchDestinations(); // Refresh list
        } else {
            alert('Gagal menghapus');
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Wisata</h1>
        <Link href="/admin/destinations/create" className="bg-[#0B2F5E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#061A35]">
            <Plus size={18} /> Tambah Wisata
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th className="p-4">Gambar</th>
                    <th className="p-4">Nama Wisata</th>
                    <th className="p-4">Lokasi</th>
                    <th className="p-4">Harga</th>
                    <th className="p-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {destinations.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-4">
                            <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                <img src={item.image_url || ''} className="w-full h-full object-cover" />
                            </div>
                        </td>
                        <td className="p-4 font-bold text-gray-800">{item.name}</td>
                        <td className="p-4 text-gray-500 text-sm">
                            <div className="flex items-center gap-1"><MapPin size={14}/> {item.location}</div>
                        </td>
                        <td className="p-4 font-bold text-[#F57C00]">
                            Rp {Number(item.price).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                            <div className="flex justify-center gap-2">
                                <button className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}