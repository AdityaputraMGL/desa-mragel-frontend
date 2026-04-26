import { AlertCircle, ArrowLeft, Send, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BuatPengaduan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Infrastruktur",
    isi_pengaduan: "",
  });
  const [fotoBukti, setFotoBukti] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("judul", formData.judul);
      submitData.append("kategori", formData.kategori);
      submitData.append("isi_pengaduan", formData.isi_pengaduan);

      // Memasukkan file foto ke dalam paket kiriman
      if (fotoBukti) {
        submitData.append("foto_bukti", fotoBukti);
      }

      // 👇 INI DIA PENYAKITNYA! HEADERS INI WAJIB ADA BIAR FOTO GAK DIBUANG SERVER 👇
      await api.post("/pengaduan", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Laporan berhasil dikirim!");
      navigate("/user/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal mengirim laporan. Coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white flex items-center">
            <AlertCircle className="mr-2" /> Layanan Pengaduan Warga
          </h1>
          <p className="text-red-100 text-sm mt-1">
            Sampaikan aspirasi, keluhan, atau laporan Anda kepada perangkat
            desa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Laporan
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Contoh: Jalan Rusak di RT 02"
              value={formData.judul}
              onChange={(e) =>
                setFormData({ ...formData, judul: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Pengaduan
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              value={formData.kategori}
              onChange={(e) =>
                setFormData({ ...formData, kategori: e.target.value })
              }
            >
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Pelayanan Publik">Pelayanan Publik</option>
              <option value="Keamanan & Ketertiban">
                Keamanan & Ketertiban
              </option>
              <option value="Sosial & Bantuan">Sosial & Bantuan</option>
              <option value="Lingkungan & Kebersihan">
                Lingkungan & Kebersihan
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isi Laporan / Detail
            </label>
            <textarea
              required
              rows="6"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Jelaskan detail kejadian, lokasi, dan waktu..."
              value={formData.isi_pengaduan}
              onChange={(e) =>
                setFormData({ ...formData, isi_pengaduan: e.target.value })
              }
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Bukti Laporan (Opsional)
            </label>
            <div className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 flex items-center">
              <Upload size={18} className="text-gray-500 mr-2" />
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => setFotoBukti(e.target.files[0])}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: JPG/PNG.</p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center shadow-md transition-colors"
            >
              {loading ? (
                "Mengirim..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" /> Kirim Laporan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuatPengaduan;
