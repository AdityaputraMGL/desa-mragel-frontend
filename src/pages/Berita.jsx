import { ArrowLeft, Calendar, ChevronRight, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Pastikan path ini benar
import api, { IMAGE_URL } from "../services/api";

const Berita = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Semua Berita
  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await api.get("/berita");
        setBeritaList(response.data.data); // Ambil semua data
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBerita();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar Simple */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">BM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Desa Mragel</span>
          </div>
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-primary-600 font-medium transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Beranda
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-primary-900 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Arsip Berita Desa</h1>
        <p className="text-primary-100 text-lg">
          Update informasi terbaru seputar kegiatan dan pengumuman Desa Mragel
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : beritaList.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Belum ada berita yang tersedia.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {beritaList.map((berita) => (
              <div
                key={berita.id_berita}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
              >
                <div
                  className="relative h-52 bg-gray-200 cursor-pointer"
                  onClick={() => setSelectedBerita(berita)}
                >
                  <img
                    src={
                      berita.gambar
                        ? `${IMAGE_URL}${berita.gambar}`
                        : fotoDefault
                    }
                    alt={berita.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = fotoDefault;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase">
                      {berita.kategori}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-gray-500 text-xs mb-4 space-x-4 border-b border-gray-50 pb-4">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary-500" />{" "}
                      {formatDate(berita.tanggal_posting)}
                    </span>
                    <span className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 text-primary-500" />{" "}
                      {berita.penulis}
                    </span>
                  </div>
                  <h4
                    className="text-lg font-bold text-gray-900 mb-3 cursor-pointer hover:text-primary-600"
                    onClick={() => setSelectedBerita(berita)}
                  >
                    {berita.judul}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {berita.isi_berita}
                  </p>
                  <button
                    onClick={() => setSelectedBerita(berita)}
                    className="text-primary-600 font-bold text-sm inline-flex items-center hover:underline"
                  >
                    Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal (Copy-Paste dari Landing) */}
      {selectedBerita && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedBerita(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative h-64 sm:h-80 w-full bg-gray-200">
              <img
                src={
                  selectedBerita.gambar
                    ? `${IMAGE_URL}${selectedBerita.gambar}`
                    : fotoDefault
                }
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = fotoDefault;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block">
                  {selectedBerita.kategori}
                </span>
                <h2 className="text-2xl font-bold text-white">
                  {selectedBerita.judul}
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center text-gray-500 text-sm mb-6 space-x-6 border-b border-gray-100 pb-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary-600" />{" "}
                  {formatDate(selectedBerita.tanggal_posting)}
                </span>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary-600" />{" "}
                  {selectedBerita.penulis}
                </span>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line">
                {selectedBerita.isi_berita}
              </div>
              <div className="mt-8 pt-6 border-t flex justify-end">
                <button
                  onClick={() => setSelectedBerita(null)}
                  className="bg-gray-100 px-6 py-2 rounded-lg hover:bg-gray-200"
                >
                  Tutup Berita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Berita;
