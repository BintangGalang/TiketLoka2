import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, ArrowLeft } from 'lucide-react'; // Kita tidak butuh icon Ticket/Calendar lagi disini karena sudah ada di BookingForm
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Metadata } from 'next';

// 1. IMPORT KOMPONEN BARU (PENTING)
import BookingForm from '@/components/booking/BookingForm'; 

// Interface Data
interface DestinationDetail {
  data: {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string;
    price: number;
    location: string;
    image_url: string | null;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    og_image: string | null;
  };
}

// Fungsi Fetch Data
async function getDestination(slug: string): Promise<DestinationDetail | null> {
  const res = await fetch(`http://127.0.0.1:8000/api/destinations/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const response = await getDestination(slug);
  
  if (!response) return { title: 'Wisata Tidak Ditemukan' };

  return {
    title: `${response.seo.title} - TiketLoka`,
    description: response.seo.description,
  };
}

// ... (Import dan kode atas tetap sama) ...

export default async function EventDetail({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const response = await getDestination(slug);

  if (!response) {
    notFound();
  }

  const { data } = response;
  
  // 1. Logika Gambar Fallback (Ini sudah Anda punya)
  const fallbackImage = 'https://images.unsplash.com/photo-1596423348633-8472df3b006c?auto=format&fit=crop&w=800';
  const imageSrc = data.image_url ? data.image_url : fallbackImage;

  // 2. PERBAIKAN: Buat objek baru yang 'bersih' untuk BookingForm
  // Kita menimpa 'image_url' asli (yang mungkin null) dengan 'imageSrc' (pasti string)
  const destinationForForm = {
    ...data,
    image_url: imageSrc, 
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* HEADER IMAGE */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={imageSrc} // Menggunakan gambar yang sudah pasti ada
          alt={data.name}
          fill
          className="object-cover"
          priority
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2F5E] via-[#0B2F5E]/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-white/80 hover:text-[#F57C00] mb-6 transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Beranda
                </Link>

                <span className="block w-fit bg-[#F57C00] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3 uppercase shadow-lg">
                    {data.category}
                </span>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
                    {data.name}
                </h1>

                <div className="flex items-center text-white/90 text-lg font-medium">
                    <MapPin className="w-5 h-5 mr-2 text-[#F57C00]" />
                    {data.location}
                </div>
            </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-2 bg-white rounded-t-3xl p-2 lg:p-0">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#0B2F5E] mb-4 border-b pb-2 border-gray-100">
                        Tentang Wisata
                    </h2>
                    <div className="prose prose-lg text-gray-600 max-w-none whitespace-pre-line leading-relaxed">
                        {data.description}
                    </div>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-bold text-[#0B2F5E] mb-3">Info Penting</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <li className="flex items-center gap-2">✓ Tiket berlaku seharian</li>
                        <li className="flex items-center gap-2">✓ Termasuk pajak & layanan</li>
                        <li className="flex items-center gap-2">✓ Bisa refund (S&K Berlaku)</li>
                        <li className="flex items-center gap-2">✓ Instant Confirmation</li>
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-1">
                {/* 3. Pass objek yang sudah dibersihkan ke sini */}
                <BookingForm destination={destinationForForm} />
            </div>

        </div>
      </div>
    </main>
  );
}