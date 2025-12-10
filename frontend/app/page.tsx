import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import EventCard, { Destination } from '@/components/ui/EventCard';

// 1. Fungsi Fetch Data dari Laravel
async function getDestinations(search?: string) {
  // Gunakan 127.0.0.1 untuk menghindari error fetch failed
  let url = 'http://127.0.0.1:8000/api/destinations';
  
  // Tambahkan query search jika ada
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }

  try {
    const res = await fetch(url, { 
      cache: 'no-store', // Data selalu fresh
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const json = await res.json();
    return json.data; // Mengembalikan array data

  } catch (error) {
    console.error("Gagal terhubung ke Server Laravel:", error);
    return []; // Return array kosong agar tidak crash
  }
}

// 2. Definisi Tipe Props (Next.js 15: searchParams adalah Promise)
type Props = {
  searchParams: Promise<{ q?: string }>
}

// 3. Komponen Utama Home
export default async function Home({ searchParams }: Props) {
  // WAJIB: Await searchParams di Next.js 15
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q;
  
  // Fetch data berdasarkan query pencarian
  const destinations: Destination[] = await getDestinations(query);

  return (
    <main className="min-h-screen bg-[#F8F9FC]">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Konten Utama */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header Section (Judul & Filter) */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0B2F5E]">
              {query ? `Hasil Pencarian: "${query}"` : 'Destinasi Populer'}
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              {query 
                ? 'Menampilkan wisata yang sesuai dengan kata kunci Anda' 
                : 'Jelajahi pilihan wisata terbaik dan terpopuler kami'
              }
            </p>
          </div>
          
          {!query && (
            <button className="hidden md:flex items-center gap-2 text-[#0B2F5E] font-semibold hover:text-[#F57C00] transition-colors">
              Lihat Semua Destinasi
            </button>
          )}
        </div>

        {/* Grid Data Wisata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.length > 0 ? (
            destinations.map((item) => (
              <EventCard key={item.id} data={item} />
            ))
          ) : (
            // Tampilan Empty State (Jika Data Kosong / Server Error)
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm text-center px-4">
              <div className="text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-off"><path d="M8.32 4.32 15 2l7 4-7 4-1.68-.96"/><path d="m2 8 2 2-2 2 2 2"/><path d="M15 10v9"/><path d="m22 8-5.35 3.06"/><path d="M22 17v-4"/><path d="M16 19 9 15l-7 4V9"/><path d="M2 2l20 20"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {query ? 'Tidak ditemukan' : 'Data Wisata Kosong'}
              </h3>
              <p className="text-gray-500 max-w-md">
                {query 
                  ? `Kami tidak dapat menemukan wisata dengan nama "${query}". Silakan coba kata kunci lain.`
                  : "Belum ada data wisata yang tersedia dari server, atau server Laravel sedang offline."
                }
              </p>
              {query && (
                <a href="/" className="mt-6 inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F57C00] hover:bg-[#E65100] transition-all">
                  Kembali ke Beranda
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B2F5E] text-white py-16 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="font-bold text-2xl mb-4 flex items-center justify-center gap-1">
              <span>Tiket</span><span className="text-[#F57C00]">Loka</span>
            </div>
          <p className="text-blue-200 text-sm">&copy; {new Date().getFullYear()} TiketLoka. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}