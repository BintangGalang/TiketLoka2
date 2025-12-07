'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreateDestinationPage() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    location: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch kategori
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories')
      .then((res) => res.json())
      .then((json) => setCategories(json.data || json))
      .catch(console.error);
  }, []);

  // Handle input
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file
  const handleImageChange = (e: any) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    if (!image) {
      alert("Wajib upload gambar!");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category_id', formData.category_id);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('image', image);

      const res = await fetch('http://127.0.0.1:8000/api/admin/destinations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const json = await res.json();

      if (res.ok) {
        alert("Wisata berhasil ditambahkan!");
        router.push('/admin/destinations');
      } else {
        console.log(json);
        alert(json.message || "Gagal menyimpan data.");
      }

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/destinations" className="p-2 bg-white rounded-lg hover:bg-gray-50 border">
            <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Wisata Baru</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nama + Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Destinasi</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Contoh: Pantai Kuta"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black
                           placeholder-gray-400 focus:border-[#0B2F5E]"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
              <select
                name="category_id"
                required
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black 
                           placeholder-gray-400 focus:border-[#0B2F5E]"
                onChange={handleChange}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lokasi + Harga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi</label>
              <input
                type="text"
                name="location"
                required
                placeholder="Contoh: Badung, Bali"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black
                           placeholder-gray-400 focus:border-[#0B2F5E]"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rp)</label>
              <input
                type="number"
                name="price"
                required
                placeholder="50000"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black
                           placeholder-gray-400 focus:border-[#0B2F5E]"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Jelaskan keindahan wisata..."
              className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black
                         placeholder-gray-400 focus:border-[#0B2F5E]"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Gambar */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Foto Wisata</label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6
                            flex flex-col items-center justify-center text-center 
                            cursor-pointer hover:bg-gray-50 transition relative overflow-hidden">

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 object-contain rounded-lg shadow-sm"
                />
              ) : (
                <>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-[#0B2F5E]" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Format: PNG, JPG, WEBP (Max 2MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <hr />

          {/* Tombol */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#0B2F5E] text-white px-8 py-3 rounded-xl font-bold 
                         hover:bg-[#061A35] transition flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Save size={18} /> Simpan Data
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
