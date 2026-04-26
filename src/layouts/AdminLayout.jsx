import {
  AlertTriangle,
  Archive,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Supaya di HP otomatis tertutup saat pertama kali load
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Monitor ukuran layar, kalau di-resize ke HP otomatis tutup sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/admin/kelola-pengajuan",
      name: "Verifikasi Surat",
      icon: <FileText size={20} />,
    },
    {
      path: "/admin/kelola-arsip",
      name: "Arsip Surat",
      icon: <Archive size={20} />,
    },
    {
      path: "/admin/kelola-penduduk",
      name: "Data Penduduk",
      icon: <Users size={20} />,
    },
    {
      path: "/admin/kelola-pengaduan",
      name: "Pengaduan Masuk",
      icon: <MessageSquare size={20} />,
    },
    {
      path: "/admin/kelola-berita",
      name: "Kelola Berita",
      icon: <Newspaper size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-hidden">
      {/* 👇 OVERLAY GELAP UNTUK HP (Muncul kalau sidebar buka di HP) 👇 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 👇 SIDEBAR RESPONSIVE 👇 */}
      <aside
        className={`bg-slate-900 text-white fixed h-full z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full w-64 md:translate-x-0 md:w-20" // Di HP ngumpet ke kiri, di Laptop nyusut jadi w-20
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold text-white whitespace-nowrap">
              Admin Panel
            </h1>
          ) : (
            <h1 className="text-xl font-bold text-white mx-auto hidden md:block">
              AP
            </h1>
          )}

          {/* Tombol Tutup di Laptop */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white hidden md:block"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Tombol Tutup khusus di HP */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2 overflow-y-auto h-[calc(100vh-160px)] custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Kalau di HP, pas klik menu langsung tutup sidebarnya
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
                title={!isSidebarOpen ? item.name : ""}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span
                  className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${
                    !isSidebarOpen && "md:hidden"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowLogoutModal(true)}
            title={!isSidebarOpen ? "Keluar" : ""}
            className="w-full flex items-center px-4 py-3 mt-8 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span
              className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${
                !isSidebarOpen && "md:hidden"
              }`}
            >
              Keluar
            </span>
          </button>
        </nav>
      </aside>

      {/* 👇 MAIN CONTENT WRAPPER RESPONSIVE 👇 */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20" // Di Laptop geser sesuai sidebar
        } ml-0`} // Di HP margin kiri selalu 0 biar full width
      >
        {/* Top Navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 w-full">
          <div className="flex items-center">
            {/* Tombol Menu Hamburger khusus muncul di HP */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 capitalize truncate max-w-[150px] sm:max-w-none">
              {location.pathname.split("/").pop().replace(/-/g, " ")}
            </h2>
          </div>

          <Link
            to="/admin/profil"
            className="flex items-center space-x-3 md:space-x-4 hover:bg-gray-100 p-2 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-200"
            title="Edit Profil Admin"
          >
            <span className="text-gray-600 text-xs md:text-sm hidden sm:block">
              Halo,{" "}
              <strong className="text-blue-600">
                {user?.email?.split("@")[0] || "Admin"}
              </strong>
            </span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md hover:scale-105 transition-transform">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Konfirmasi Keluar
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Apakah Anda yakin ingin keluar dari sistem Admin? Anda harus
                login kembali untuk masuk.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
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

export default AdminLayout;
