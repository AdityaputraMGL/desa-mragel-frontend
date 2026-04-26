import { ArrowLeft, Lock, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Pastikan sudah install react-hot-toast
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Profil = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("biodata"); // 'biodata' atau 'password'

  // State Form Biodata
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    alamat_lengkap: "",
    pekerjaan: "",
  });

  // State Form Password (BARU)
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      const data = response.data.data;
      setProfile(data);
      setFormData({
        nama_lengkap: data.penduduk?.nama_lengkap || "",
        email: data.email || "",
        alamat_lengkap: data.penduduk?.alamat_lengkap || "",
        pekerjaan: data.penduduk?.pekerjaan || "",
      });
    } catch (error) {
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE BIODATA ---
  const handleBioChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/profile", formData);
      toast.success("Profil berhasil diperbarui!");
      loadProfile(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal update profil");
    }
  };

  // --- GANTI PASSWORD (LOGIKA BARU) ---
  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();

    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    if (passData.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    try {
      // Backend Endpoint: /auth/change-password
      await api.put("/auth/change-password", {
        oldPassword: passData.oldPassword, // Dulu: password_lama
        newPassword: passData.newPassword,
      });
      toast.success("Password berhasil diganti!");

      // Reset Form Password
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setActiveTab("biodata"); // Kembali ke tab biodata
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal ganti password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          to="/user/dashboard"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* SIDEBAR KIRI */}
          <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-100 p-6 text-center md:text-left">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {profile?.penduduk?.nama_lengkap}
              </h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("biodata")}
                className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === "biodata" ? "bg-white shadow text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-200"}`}
              >
                <User size={18} className="mr-3" /> Biodata Diri
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center p-3 rounded-lg transition ${activeTab === "password" ? "bg-white shadow text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-200"}`}
              >
                <Lock size={18} className="mr-3" /> Ganti Password
              </button>
            </nav>
          </div>

          {/* KONTEN KANAN */}
          <div className="w-full md:w-2/3 p-8">
            {/* --- TAB BIODATA --- */}
            {activeTab === "biodata" && (
              <form onSubmit={handleBioSubmit} className="space-y-5">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
                  Edit Informasi Pribadi
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleBioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Tidak dapat diubah)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat_lengkap"
                    rows="3"
                    value={formData.alamat_lengkap}
                    onChange={handleBioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleBioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Save size={18} className="mr-2" /> Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* --- TAB PASSWORD --- */}
            {activeTab === "password" && (
              <form onSubmit={handlePassSubmit} className="space-y-5">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
                  Keamanan Akun
                </h3>

                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-4">
                  Pastikan password baru minimal 6 karakter.
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passData.oldPassword}
                    onChange={handlePassChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passData.newPassword}
                    onChange={handlePassChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passData.confirmPassword}
                    onChange={handlePassChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <Lock size={18} className="mr-2" /> Ganti Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
