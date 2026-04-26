import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

//layout
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Berita from "./pages/Berita";
import ForgotPassword from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

// User Pages
import BuatPengaduan from "./pages/user/BuatPengaduan";
import UserDashboard from "./pages/user/Dashboard";
import PengajuanSurat from "./pages/user/PengajuanSurat";
import Profil from "./pages/user/Profil";
import Riwayat from "./pages/user/Riwayat";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import KelolaArsip from "./pages/admin/KelolaArsip";
import KelolaBerita from "./pages/admin/KelolaBerita";
import KelolaPenduduk from "./pages/admin/KelolaPenduduk";
import KelolaPengaduan from "./pages/admin/KelolaPengaduan";
import KelolaPengajuan from "./pages/admin/KelolaPengajuan";
import KelolaUser from "./pages/admin/KelolaUser";
import Laporan from "./pages/admin/Laporan";
import ProfilAdmin from "./pages/admin/ProfilAdmin";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/berita" element={<Berita />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Protected Routes - User */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/pengajuan-surat"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <PengajuanSurat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/buat-pengaduan"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <BuatPengaduan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/riwayat"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Riwayat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profil"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Profil />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin/Petugas (NEW STRUCTURE) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "petugas"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Halaman-halaman Admin (tanpa /admin lagi di path) */}
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="kelola-pengajuan" element={<KelolaPengajuan />} />
              <Route path="kelola-pengaduan" element={<KelolaPengaduan />} />
              <Route path="kelola-penduduk" element={<KelolaPenduduk />} />
              <Route path="laporan" element={<Laporan />} />
              <Route path="kelola-berita" element={<KelolaBerita />} />
              <Route path="profil" element={<ProfilAdmin />} />

              {/* 👇👇 FIX: Rute Kelola Arsip Dipindahkan ke Sini 👇👇 */}
              <Route path="kelola-arsip" element={<KelolaArsip />} />

              {/* Halaman Khusus Admin (Double Protection) */}
              <Route
                path="kelola-user"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <KelolaUser />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Toast Notification */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Dashboard Redirect based on role
const DashboardRedirect = () => {
  const { user } = useAuth();

  console.log("DashboardRedirect - User:", user);

  if (user?.role === "admin" || user?.role === "petugas") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/user/dashboard" replace />;
};

// 404 Page
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
        <a
          href="/"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default App;
