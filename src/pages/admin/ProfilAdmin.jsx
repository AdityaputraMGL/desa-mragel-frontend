import { Lock, Mail, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ProfilAdmin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    passwordLama: "",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  // Ambil data email saat ini dari state Auth
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi jika mau ganti password
    if (
      formData.passwordBaru &&
      formData.passwordBaru !== formData.konfirmasiPassword
    ) {
      toast.error("Konfirmasi password baru tidak cocok!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Menyimpan perubahan...");

    try {
      // Mengirim request update ke backend (Pastikan endpoint ini ada di backend Abang)
      await api.put("/auth/update-profile", {
        email: formData.email,
        passwordLama: formData.passwordLama,
        passwordBaru: formData.passwordBaru,
      });

      toast.success("Profil berhasil diperbarui!", { id: toastId });

      // Kosongkan kolom password setelah sukses
      setFormData((prev) => ({
        ...prev,
        passwordLama: "",
        passwordBaru: "",
        konfirmasiPassword: "",
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui profil.",
        { id: toastId },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Pengaturan Profil
        </h1>
        <p className="text-gray-500 mt-1">
          Kelola informasi akun dan keamanan Admin Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Card */}
        <div className="bg-slate-900 px-6 py-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 pattern-dots"></div>
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-800 shadow-xl relative z-10">
            {formData.email.charAt(0).toUpperCase() || "A"}
          </div>
          <h2 className="mt-4 text-xl font-bold text-white relative z-10">
            Administrator
          </h2>
          <p className="text-slate-400 relative z-10 text-sm">
            Level Akses: Root
          </p>
        </div>

        {/* Form Profil */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Bagian Email */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <User className="mr-2 text-blue-600" size={20} /> Informasi Dasar
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Bagian Password */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <Lock className="mr-2 text-blue-600" size={20} /> Keamanan &
              Password
            </h3>
            <p className="text-xs text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              *Kosongkan semua kolom password di bawah ini jika Anda tidak ingin
              mengubah password saat ini.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password Lama
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Masukkan password saat ini..."
                  value={formData.passwordLama}
                  onChange={(e) =>
                    setFormData({ ...formData, passwordLama: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Minimal 6 karakter"
                    value={formData.passwordBaru}
                    onChange={(e) =>
                      setFormData({ ...formData, passwordBaru: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ulangi password baru"
                    value={formData.konfirmasiPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        konfirmasiPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md disabled:opacity-50"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save size={20} className="mr-2" /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilAdmin;
