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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
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
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/admin/kelola-pengajuan",
      name: "Verifikasi Surat",
      icon: <FileText size={18} />,
    },
    {
      path: "/admin/kelola-arsip",
      name: "Arsip Surat",
      icon: <Archive size={18} />,
    },
    {
      path: "/admin/kelola-penduduk",
      name: "Data Penduduk",
      icon: <Users size={18} />,
    },
    {
      path: "/admin/kelola-pengaduan",
      name: "Pengaduan Masuk",
      icon: <MessageSquare size={18} />,
    },
    {
      path: "/admin/kelola-berita",
      name: "Kelola Berita",
      icon: <Newspaper size={18} />,
    },
  ];

  const pageName = location.pathname.split("/").pop().replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
      {/* Overlay HP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed h-full z-40 flex flex-col transition-all duration-300 ease-in-out
          bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900
          ${isSidebarOpen ? "translate-x-0 w-60" : "-translate-x-full w-60 md:translate-x-0 md:w-16"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-blue-700/50">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow">
                <span className="text-blue-700 font-extrabold text-sm">BM</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">
                  Admin Panel
                </p>
                <p className="text-blue-300 text-xs mt-0.5">Desa Mragel</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow mx-auto hidden md:flex">
              <span className="text-blue-700 font-extrabold text-sm">BM</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-blue-300 hover:text-white hidden md:block p-1 rounded-lg hover:bg-blue-700/50 transition"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-blue-300 hover:text-white md:hidden p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                title={!isSidebarOpen ? item.name : ""}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md font-semibold"
                      : "text-blue-200 hover:bg-blue-700/50 hover:text-white"
                  }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? "md:hidden" : ""}`}
                >
                  {item.name}
                </span>
                {isActive && isSidebarOpen && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-blue-700/50">
          <button
            onClick={() => setShowLogoutModal(true)}
            title={!isSidebarOpen ? "Keluar" : ""}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span
              className={`text-sm font-medium whitespace-nowrap ${!isSidebarOpen ? "md:hidden" : ""}`}
            >
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ml-0 ${isSidebarOpen ? "md:ml-60" : "md:ml-16"}`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base font-semibold text-gray-700 capitalize">
              {pageName}
            </h2>
          </div>
          <Link
            to="/admin/profil"
            className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-xl transition border border-transparent hover:border-gray-200"
          >
            <span className="text-sm text-gray-500 hidden sm:block">
              Halo,{" "}
              <strong className="text-blue-600">
                {user?.email?.split("@")[0] || "Admin"}
              </strong>
            </span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
          </Link>
        </header>

        <main className="p-4 md:p-6 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Konfirmasi Keluar
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Yakin ingin keluar dari Admin Panel?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
