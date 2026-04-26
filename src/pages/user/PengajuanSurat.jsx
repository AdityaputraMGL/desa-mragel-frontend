import { AlertCircle, ArrowLeft, FileText, Send, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import pengajuanService from "../../services/pengajuanService";

const FORM_FIELDS = {
  // ID 1: Surat Keterangan Domisili (SKD)
  1: [
    {
      name: "alamat_domisili",
      label: "Alamat Domisili Sekarang",
      type: "textarea",
    },
    {
      name: "status_tempat_tinggal",
      label: "Status Tempat Tinggal (Milik Sendiri/Sewa/Numpang)",
      type: "text",
    },
  ],

  // ID 2: Surat Keterangan Usaha (SKU)
  2: [
    { name: "nama_usaha", label: "Nama Usaha", type: "text" },
    {
      name: "jenis_usaha",
      label: "Jenis Usaha (Cth: Dagang Sembako)",
      type: "text",
    },
    { name: "alamat_usaha", label: "Alamat Lokasi Usaha", type: "textarea" },
    { name: "lama_usaha", label: "Sudah Berjalan Berapa Lama?", type: "text" },
  ],

  // ID 3: Surat Keterangan Tidak Mampu (SKTM)
  3: [
    { name: "pekerjaan", label: "Pekerjaan Saat Ini", type: "text" },
    {
      name: "penghasilan",
      label: "Rata-rata Penghasilan per Bulan (Rp)",
      type: "number",
    },
    {
      name: "nama_anak",
      label: "Nama Anak (Jika untuk sekolah)",
      type: "text",
    },
    { name: "sekolah_tujuan", label: "Sekolah/Instansi Tujuan", type: "text" },
  ],

  // ID 6: Surat Keterangan Pindah (SKP)
  6: [
    { name: "alamat_tujuan", label: "Alamat Tujuan Pindah", type: "textarea" },
    { name: "alasan_pindah", label: "Alasan Pindah", type: "text" },
    {
      name: "jumlah_pengikut",
      label: "Jumlah Keluarga yang Mengikuti",
      type: "number",
    },
  ],

  // ID 8: Surat Keterangan Penghasilan (SKPeng)
  8: [
    { name: "pekerjaan", label: "Pekerjaan", type: "text" },
    {
      name: "penghasilan_angka",
      label: "Jumlah Penghasilan (Angka)",
      type: "number",
    },
    {
      name: "penghasilan_terbilang",
      label: "Jumlah Penghasilan (Huruf)",
      type: "text",
    },
  ],

  // Default fields
  default: [
    {
      name: "keterangan",
      label: "Keterangan Tambahan / Detail Informasi",
      type: "textarea",
    },
  ],
};

const PengajuanSurat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Pilih Jenis Surat, 2: Isi Form
  const [jenisSurat, setJenisSurat] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State untuk form data dasar
  const [formData, setFormData] = useState({
    id_jenis_surat: "",
    keperluan: "",
    data_surat: {},
  });

  // State khusus untuk File Upload
  const [fileKtp, setFileKtp] = useState(null);
  const [fileKk, setFileKk] = useState(null);

  useEffect(() => {
    loadJenisSurat();
  }, []);

  const loadJenisSurat = async () => {
    try {
      setLoading(true);
      const response = await pengajuanService.getJenisSurat();
      setJenisSurat(response.data || []);
    } catch (error) {
      console.error("Error loading jenis surat:", error);
      toast.error("Gagal memuat jenis surat");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJenis = (jenis) => {
    setSelectedJenis(jenis);
    setFormData({
      ...formData,
      id_jenis_surat: jenis.id_jenis_surat,
    });
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDataSuratChange = (field, value) => {
    setFormData({
      ...formData,
      data_surat: {
        ...formData.data_surat,
        [field]: value,
      },
    });
  };

  // --- LOGIC BARU: Handle Submit dengan FormData ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasi Input Dasar
    if (!formData.id_jenis_surat) {
      toast.error("Pilih jenis surat terlebih dahulu");
      return;
    }
    if (!formData.keperluan || formData.keperluan.trim() === "") {
      toast.error("Keperluan harus diisi");
      return;
    }

    // 2. Validasi File (Wajib Upload)
    if (!fileKtp || !fileKk) {
      toast.error("Mohon upload foto KTP dan KK sebagai syarat!");
      return;
    }

    try {
      setSubmitting(true);

      // 3. Bungkus data ke dalam FormData (Wajib untuk upload file)
      const submitData = new FormData();

      // Masukkan data teks
      submitData.append("id_jenis_surat", formData.id_jenis_surat);
      submitData.append("keperluan", formData.keperluan);

      // Masukkan Data Dinamis (sebagai string JSON, sesuai backend kita tadi)
      submitData.append("data_surat", JSON.stringify(formData.data_surat));

      // Masukkan File
      submitData.append("file_ktp", fileKtp);
      submitData.append("file_kk", fileKk);

      // 4. Kirim ke Service
      // Pastikan service anda menerima FormData (biasanya axios otomatis handle)
      const response = await pengajuanService.createPengajuan(submitData);

      if (response.success) {
        toast.success("Pengajuan surat berhasil dibuat!");
        navigate("/user/riwayat");
      }
    } catch (error) {
      console.error("Error submitting pengajuan:", error);
      toast.error(error.message || "Gagal mengajukan surat");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/user/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pengajuan Surat</h1>
          <p className="text-gray-600 mt-2">
            Ajukan surat keterangan dan administrasi desa
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span
                className={`font-medium ${
                  step >= 1 ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Pilih Jenis Surat
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div
                className={`h-full transition-all ${
                  step >= 2 ? "bg-primary-600 w-full" : "bg-gray-200 w-0"
                }`}
              ></div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={`font-medium ${
                  step >= 2 ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Isi Data & Upload
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Pilih Jenis Surat */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Pilih Jenis Surat
            </h2>

            {jenisSurat.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Belum ada jenis surat yang tersedia
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {jenisSurat.map((jenis) => (
                  <button
                    key={jenis.id_jenis_surat}
                    onClick={() => handleSelectJenis(jenis)}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {jenis.nama_surat}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Kode: {jenis.kode_surat}
                        </p>
                        {jenis.deskripsi && (
                          <p className="text-sm text-gray-500 mt-2">
                            {jenis.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Form Data */}
        {step === 2 && (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedJenis?.nama_surat}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Kode: {selectedJenis?.kode_surat}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ganti Jenis Surat
                </button>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Informasi Penting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Pastikan data yang Anda isi sudah benar</li>
                      <li>
                        Wajib upload Foto KTP dan KK yang jelas (tidak buram)
                      </li>
                      <li>
                        Surat akan diproses setelah verifikasi oleh petugas
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Keperluan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keperluan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="keperluan"
                    value={formData.keperluan}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Jelaskan keperluan pengajuan surat ini..."
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Contoh: Untuk keperluan melamar pekerjaan
                  </p>
                </div>

                {/* Additional Fields - Can be customized per jenis surat */}
                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="font-medium text-gray-900">
                    Data Pelengkap Surat
                  </h3>

                  {/* Render Dynamic Fields */}
                  {(
                    FORM_FIELDS[formData.id_jenis_surat] ||
                    FORM_FIELDS["default"]
                  ).map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData.data_surat[field.name] || ""}
                          onChange={(e) =>
                            handleDataSuratChange(field.name, e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          rows={3}
                          placeholder={`Masukkan ${field.label}`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData.data_surat[field.name] || ""}
                          onChange={(e) =>
                            handleDataSuratChange(field.name, e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder={`Masukkan ${field.label}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* --- AREA UPLOAD FILE (BARU) --- */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Dokumen Persyaratan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input KTP */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Scan/Foto KTP{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFileKtp(e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Format: JPG/PNG, Max 2MB
                      </p>
                    </div>

                    {/* Input KK */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Scan/Foto KK{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFileKk(e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Format: JPG/PNG, Max 2MB
                      </p>
                    </div>
                  </div>
                </div>
                {/* --- BATAS AKHIR AREA UPLOAD --- */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Ajukan Surat</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PengajuanSurat;
