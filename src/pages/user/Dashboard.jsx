import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logoLamongan from "../../assets/logo-lamongan.png"; // 👇 IMPORT LOGO LAMONGAN
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👇 2. STATE BARU UNTUK MODAL LOGOUT 👇
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load profile
      const profileResponse = await api.get("/auth/profile");
      setProfile(profileResponse.data.data);

      // Load dashboard data
      const dashboardResponse = await api.get("/dashboard/user");
      setDashboardData(dashboardResponse.data.data);

      console.log("✅ Dashboard data loaded:", dashboardResponse.data.data);
    } catch (error) {
      console.error("❌ Error loading dashboard:", error);
      setError(error.response?.data?.message || "Gagal memuat data dashboard");
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  // 👇 3. FUNGSI LOGOUT DIPERBARUI 👇
  const handleLogout = () => {
    setShowLogoutModal(false); // Tutup modal dulu
    logout();
    toast.success("Logout berhasil");
    navigate("/");
  };

  // Get stats from dashboard data
  const stats = dashboardData?.statistics || {
    pengajuan: { total: 0, menunggu: 0, diproses: 0, selesai: 0 },
    pengaduan: { total: 0, belum_diproses: 0, sedang_ditangani: 0, selesai: 0 },
  };

  const statCards = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Total Pengajuan Surat",
      count: stats.pengajuan.total,
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "Total Pengaduan",
      count: stats.pengaduan.total,
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <Clock className="w-8 h-8 text-yellow-600" />,
      title: "Sedang Diproses",
      count: stats.pengajuan.diproses + stats.pengaduan.sedang_ditangani,
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-600" />,
      title: "Selesai",
      count: stats.pengajuan.selesai + stats.pengaduan.selesai,
      color: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Ajukan Surat",
      link: "/user/pengajuan-surat",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "Buat Pengaduan",
      link: "/user/buat-pengaduan",
      color: "bg-green-600 hover:bg-green-700",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      title: "Lihat Riwayat",
      link: "/user/riwayat",
      color: "bg-gray-600 hover:bg-gray-700",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      menunggu: "bg-yellow-100 text-yellow-800",
      pending: "bg-yellow-100 text-yellow-800",
      diproses: "bg-blue-100 text-blue-800",
      sedang_ditangani: "bg-blue-100 text-blue-800",
      selesai: "bg-green-100 text-green-800",
      ditolak: "bg-red-100 text-red-800",
      belum_diproses: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get status text
  const getStatusText = (status) => {
    const texts = {
      menunggu: "Menunggu",
      pending: "Menunggu",
      diproses: "Diproses",
      sedang_ditangani: "Sedang Ditangani",
      selesai: "Selesai",
      ditolak: "Ditolak",
      belum_diproses: "Belum Diproses",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gagal Memuat Dashboard
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              {/* 👇 FIX: Ganti Kotak KM Jadi Logo Lamongan 👇 */}
              <img
                src={logoLamongan}
                alt="Logo Lamongan"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <div>
                <h1 className="font-bold text-gray-900 text-lg">
                  Kantor desa Mragel
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Dashboard Masyarakat
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/user/profil"
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {profile?.penduduk?.nama_lengkap?.split(" ")[0] ||
                    user?.email}
                </span>
              </Link>

              {/* 👇 4. TOMBOL KELUAR SEKARANG MEMBUKA MODAL 👇 */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden md:block">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang,{" "}
            {profile?.penduduk?.nama_lengkap?.split(" ")[0] || "Warga"}! 👋
          </h2>
          <p className="text-gray-600">
            Kelola pengajuan surat dan pengaduan Anda dengan mudah dan cepat.
          </p>
        </div>

        {/* Profile Card */}
        {profile?.penduduk && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            {/* Hiasan Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start justify-between relative z-10">
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <User className="mr-2" /> Informasi Profil
                  </h3>
                  <Link
                    to="/user/profil"
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition text-sm font-medium flex items-center border border-white/30"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit Profil
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">
                      NIK
                    </p>
                    <p className="font-bold text-lg tracking-wide">
                      {profile.penduduk.nik}
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">
                      Nama Lengkap
                    </p>
                    <p className="font-bold text-lg">
                      {profile.penduduk.nama_lengkap}
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">
                      Alamat
                    </p>
                    <p className="font-bold text-lg leading-tight">
                      {profile.penduduk.alamat_lengkap ||
                        `${profile.penduduk.alamat}, RT ${profile.penduduk.rt}/RW ${profile.penduduk.rw}`}
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p
                      className="font-bold text-lg truncate"
                      title={profile.email}
                    >
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1 duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <span className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.count}
                </span>
              </div>
              <p className="text-gray-500 font-medium">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Menu Cepat
              </h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${action.color} text-white px-6 py-4 rounded-xl text-left font-medium transition flex items-center shadow-md transform hover:scale-[1.02] duration-200`}
                  >
                    <div className="bg-white/20 p-2 rounded-lg mr-4">
                      {action.icon}
                    </div>
                    <span className="text-lg">{action.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Aktivitas Terbaru
                </h3>
                {dashboardData?.activities?.length > 0 && (
                  <Link
                    to="/user/riwayat"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  >
                    Lihat Semua →
                  </Link>
                )}
              </div>

              {!dashboardData?.activities?.length ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-4">
                    Belum ada aktivitas pengajuan
                  </p>
                  <Link
                    to="/user/pengajuan-surat"
                    className="inline-block bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                  >
                    + Buat Pengajuan Baru
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition group"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                            activity.type === "pengajuan"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {activity.type === "pengajuan" ? (
                            <FileText className="w-6 h-6" />
                          ) : (
                            <MessageSquare className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                            {activity.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">
                              {activity.nomor}
                            </span>
                            <span>•</span>
                            <span>{formatDate(activity.date)}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(
                          activity.status,
                        )}`}
                      >
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 👇👇 5. MODAL KONFIRMASI LOGOUT 👇👇 */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
            <div className="p-6 text-center">
              {/* Icon Peringatan */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Konfirmasi Keluar
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Apakah Anda yakin ingin keluar? Sesi Anda akan diakhiri dan
                harus login kembali.
              </p>

              {/* Tombol Aksi */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 w-full transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 w-full transition-colors flex justify-center items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
