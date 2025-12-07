'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import Auth
import Link from 'next/link';
import { 
  DollarSign, Ticket, Users, ShoppingBag, TrendingUp, 
  Calendar, User, Plus, Map, ArrowRight, MoreHorizontal,
  LogOut, ChevronDown, Bell // Tambah Icon Logout & Chevron
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface DashboardData {
  total_revenue: number;
  total_bookings: number;
  total_tickets_sold: number;
  total_users: number;
  recent_bookings: {
    id: number;
    booking_code: string;
    grand_total: number;
    status: string;
    created_at: string;
    user: { name: string; email: string; }
  }[];
}

const chartData = [
  { name: 'Sen', total: 400000 },
  { name: 'Sel', total: 300000 },
  { name: 'Rab', total: 200000 },
  { name: 'Kam', total: 278000 },
  { name: 'Jum', total: 189000 },
  { name: 'Sab', total: 239000 },
  { name: 'Min', total: 349000 },
];

export default function AdminDashboard() {
  const { token, user, logout } = useAuth(); // 1. Ambil user & fungsi logout
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk Dropdown Profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/dashboard', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const json = await res.json();
        if (res.ok) setStats(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchStats();
  }, [token]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#0B2F5E] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Menyiapkan Dashboard...</p>
        </div>
    </div>
  );

  if (!stats) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
            <h1 className="text-3xl font-extrabold text-[#0B2F5E]">Dashboard</h1>
            <p className="text-gray-500 mt-1">Pantau performa bisnis hari ini.</p>
        </div>
        
        <div className="flex gap-3 items-center">
            {/* Tombol Shortcut */}
            <Link href="/admin/destinations/create" className="hidden md:flex px-4 py-2.5 bg-[#0B2F5E] text-white font-bold rounded-xl hover:bg-[#09254A] transition items-center gap-2 shadow-lg shadow-blue-900/20 text-sm">
                <Plus size={16} /> Tambah Wisata
            </Link>

            {/* --- PROFIL ADMIN & LOGOUT (DROPDOWN) --- */}
            <div className="relative">
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 bg-white border border-gray-200 pl-2 pr-4 py-1.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                >
                    <div className="w-9 h-9 bg-blue-100 text-[#0B2F5E] rounded-lg flex items-center justify-center font-bold border border-blue-200">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-bold text-gray-700">{user?.name || 'Admin'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Administrator</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Isi Dropdown */}
                {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-3 py-2 border-b border-gray-100 mb-2">
                             <p className="font-bold text-sm text-[#0B2F5E]">{user?.name}</p>
                             <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                        
                        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition mb-1">
                            <ShoppingBag size={16} /> Lihat Website
                        </Link>

                        <button 
                            onClick={logout} 
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
                        >
                            <LogOut size={16} /> Keluar (Logout)
                        </button>
                    </div>
                )}
            </div>
            {/* ---------------------------------------- */}

        </div>
      </div>

      {/* --- STATISTIC CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Pendapatan" 
          value={`Rp ${Number(stats.total_revenue).toLocaleString('id-ID')}`} 
          icon={<DollarSign className="w-6 h-6 text-white" />} 
          gradient="from-emerald-400 to-emerald-600"
          trend="+12% bulan ini"
        />
        <StatCard 
          title="Transaksi Sukses" 
          value={stats.total_bookings} 
          icon={<ShoppingBag className="w-6 h-6 text-white" />} 
          gradient="from-blue-400 to-blue-600"
          trend="Order baru masuk"
        />
        <StatCard 
          title="Tiket Terjual" 
          value={stats.total_tickets_sold} 
          icon={<Ticket className="w-6 h-6 text-white" />} 
          gradient="from-orange-400 to-orange-600"
          trend="Tiket populer"
        />
        <StatCard 
          title="Pelanggan" 
          value={stats.total_users} 
          icon={<Users className="w-6 h-6 text-white" />} 
          gradient="from-purple-400 to-purple-600"
          trend="User aktif"
        />
      </div>

      {/* --- CONTENT GRID (CHART & TABLE) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: GRAFIK */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-[#0B2F5E]">Analitik Penjualan</h3>
                    <p className="text-sm text-gray-400">Ringkasan pendapatan 7 hari terakhir</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><MoreHorizontal size={20}/></button>
            </div>
            
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0B2F5E" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#0B2F5E" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(val)=> `Rp${val/1000}k`}/>
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                        />
                        <Area type="monotone" dataKey="total" stroke="#0B2F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* KOLOM KANAN: TRANSAKSI TERBARU */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-[#0B2F5E]">Transaksi Terbaru</h3>
                <Link href="/admin/bookings" className="text-xs font-bold text-[#F57C00] hover:underline flex items-center gap-1">
                    Lihat Semua <ArrowRight size={12}/>
                </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[350px] p-4 space-y-4">
                {stats.recent_bookings.length > 0 ? (
                    stats.recent_bookings.map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 text-[#0B2F5E] rounded-full flex items-center justify-center font-bold text-xs group-hover:bg-[#0B2F5E] group-hover:text-white transition-colors">
                                    {b.booking_code.substring(0, 2)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800 line-clamp-1">{b.user?.name || 'Guest'}</p>
                                    <p className="text-xs text-gray-400 font-mono">#{b.booking_code}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm text-[#0B2F5E]">Rp {Number(b.grand_total).toLocaleString('id-ID')}</p>
                                <p className={`text-[10px] font-bold uppercase ${
                                    b.status === 'success' ? 'text-green-600' : 'text-orange-500'
                                }`}>{b.status}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">Belum ada transaksi</div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}

// --- KOMPONEN KARTU PREMIUM ---
function StatCard({ title, value, icon, gradient, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-extrabold text-[#0B2F5E]">{value}</h3>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-transform`}>
            {icon}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs font-medium text-gray-400 relative z-10">
        <TrendingUp size={14} className="text-green-500" />
        <span className="text-green-600">{trend}</span>
      </div>
    </div>
  );
}