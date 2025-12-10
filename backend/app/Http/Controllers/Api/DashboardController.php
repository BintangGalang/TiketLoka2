<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\BookingDetail;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        // --- 1. SIAPKAN FILTER TANGGAL ---
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Fungsi Closure untuk menerapkan filter tanggal berulang kali (agar kode rapi)
        $applyDateFilter = function($query) use ($startDate, $endDate) {
            if ($startDate && $endDate) {
                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
                $query->whereBetween('created_at', [$start, $end]);
            }
        };

        // --- 2. HITUNG STATISTIK ---

        // A. Total Pendapatan (Status Success + Filter Tanggal)
        $revenueQuery = Booking::where('status', 'success');
        $applyDateFilter($revenueQuery);
        $totalRevenue = $revenueQuery->sum('grand_total');

        // B. Total Booking Sukses (Status Success + Filter Tanggal)
        $bookingsQuery = Booking::where('status', 'success');
        $applyDateFilter($bookingsQuery);
        $totalBookings = $bookingsQuery->count();

        // C. Total Tiket Terjual (Dari BookingDetail + Filter Tanggal di Booking)
        $ticketsQuery = BookingDetail::whereHas('booking', function ($q) use ($startDate, $endDate) {
            $q->where('status', 'success');
            if ($startDate && $endDate) {
                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
                $q->whereBetween('created_at', [$start, $end]);
            }
        });
        $totalTicketsSold = $ticketsQuery->sum('quantity');

        // D. Total User (Biasanya tidak difilter tanggal transaksi, tapi total user terdaftar)
        // Jika ingin difilter berdasarkan tanggal daftar, tambahkan logic serupa.
        $totalUsers = User::where('role', 'customer')->count();

        // --- 3. AMBIL DATA TABEL (RECENT BOOKINGS) ---
        
        $recentQuery = Booking::with(['user', 'details.destination']); // <--- PENTING: Load Relasi Destinasi
        
        // Terapkan filter tanggal juga ke tabel ini
        $applyDateFilter($recentQuery);

        $recentBookings = $recentQuery
            ->orderBy('created_at', 'desc')
            ->take(5) // Ambil 5 teratas (atau sesuai kebutuhan)
            ->get();

        return response()->json([
            'data' => [
                'total_revenue' => $totalRevenue,
                'total_bookings' => $totalBookings,
                'total_tickets_sold' => (int) $totalTicketsSold,
                'total_users' => $totalUsers,
                'recent_bookings' => $recentBookings
            ]
        ]);
    }
}