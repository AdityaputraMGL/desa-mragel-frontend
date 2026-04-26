import {
  Activity,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import pengajuanService from "../../services/pengajuanService";
// 👇 IMPORT LIBRARY GRAFIK
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
    byJenisSurat: [], // ✅ Tambahan data untuk grafik batang
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await pengajuanService.getStatistics();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DATA UNTUK PIE CHART (Status)
  const dataStatus = [
    { name: "Menunggu", value: stats.menunggu, color: "#F59E0B" }, // Kuning
    { name: "Selesai", value: stats.selesai, color: "#10B981" }, // Hijau
    { name: "Ditolak", value: stats.ditolak, color: "#EF4444" }, // Merah
  ];

  const cards = [
    {
      title: "Total Pengajuan",
      value: stats.total,
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-100",
      desc: "Semua surat masuk",
    },
    {
      title: "Menunggu Verifikasi",
      value: stats.menunggu,
      icon: <Clock className="w-8 h-8 text-yellow-600" />,
      bg: "bg-yellow-100",
      desc: "Perlu tindakan segera",
    },
    {
      title: "Selesai / Disetujui",
      value: stats.selesai,
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      bg: "bg-green-100",
      desc: "Surat berhasil terbit",
    },
    {
      title: "Ditolak",
      value: stats.ditolak,
      icon: <XCircle className="w-8 h-8 text-red-600" />,
      bg: "bg-red-100",
      desc: "Pengajuan bermasalah",
    },
  ];

  if (loading)
    return <div className="p-8 text-center">Memuat dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard Ringkasan
        </h1>
        <p className="text-gray-600">
          Pantau aktivitas pelayanan surat hari ini
        </p>
      </div>

      {/* 1. KARTU STATISTIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bg}`}>{card.icon}</div>
              <span className="text-3xl font-bold text-gray-800">
                {card.value}
              </span>
            </div>
            <h3 className="font-semibold text-gray-700">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* 2. AREA GRAFIK (BARU) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAFIK 1: Kategori Surat Terlaris (Bar Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Activity size={20} className="mr-2 text-blue-500" />
            Surat Paling Sering Diajukan
          </h3>
          <div className="h-72">
            {stats.byJenisSurat && stats.byJenisSurat.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.byJenisSurat}
                  layout="vertical"
                  margin={{ left: 10, right: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="jumlah"
                    fill="#3B82F6"
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Belum ada data pengajuan
              </div>
            )}
          </div>
        </div>

        {/* GRAFIK 2: Status Pengajuan (Pie Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp size={20} className="mr-2 text-green-500" />
            Persentase Status
          </h3>
          <div className="h-72 flex justify-center items-center">
            {stats.total === 0 ? (
              <p className="text-gray-400 italic">Belum ada data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 3. Banner Selamat Datang */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">
            Selamat Datang di Panel Admin! 👋
          </h2>
          <p className="text-slate-300 max-w-xl">
            Sistem ini membantu Anda mengelola administrasi desa dengan lebih
            efisien. Silakan cek menu "Verifikasi Surat" untuk memproses
            pengajuan warga.
          </p>
        </div>
        <TrendingUp className="absolute right-0 bottom-0 w-48 h-48 text-white opacity-5 -mr-10 -mb-10" />
      </div>
    </div>
  );
};

export default Dashboard;
