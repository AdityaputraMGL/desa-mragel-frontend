import {
  ArrowRight,
  Calendar,
  ChevronRight,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoLamongan from "../assets/logo-lamongan.png";
import fotoMragel from "../assets/mragel.jpeg";
import api, { IMAGE_URL } from "../services/api";

const Landing = () => {
  // State untuk Popup Berita
  const [selectedBerita, setSelectedBerita] = useState(null);

  // State untuk Data Berita dari Database
  const [beritaList, setBeritaList] = useState([]);

  // FETCH BERITA DARI BACKEND
  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await api.get("/berita");
        // Ambil 3 berita terbaru saja
        setBeritaList(response.data.data.slice(0, 3));
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
      }
    };

    fetchBerita();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-primary-600" />,
      title: "Pelayanan Surat Online",
      description:
        "Ajukan berbagai jenis surat keterangan secara online tanpa harus datang ke kantor desa",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "Pengaduan Masyarakat",
      description:
        "Sampaikan aspirasi dan pengaduan Anda dengan mudah dan dapatkan respon langsung",
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-600" />,
      title: "Tracking Status",
      description:
        "Pantau status pengajuan surat dan pengaduan Anda secara real-time dari HP",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Data Aman & Valid",
      description:
        "Sistem keamanan terenkripsi dan tanda tangan digital yang sah secara hukum",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans scroll-smooth">
      {/* NAVBAR */}
      <nav className="fixed w-full top-0 z-[100] bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              {/* Logo Lamongan Navbar */}
              <img
                src={logoLamongan}
                alt="Logo Lamongan"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
              {/* Tulisan dikembalikan ke versi original */}
              <div>
                <h1 className="font-bold text-gray-900 leading-none text-lg">
                  Desa Mragel
                </h1>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Kec. Sukorame, Kab. Lamongan
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#beranda"
                className="text-gray-600 hover:text-primary-600 font-semibold text-sm transition-colors border-b-2 border-transparent hover:border-primary-600 pb-1"
              >
                Beranda
              </a>
              <a
                href="#layanan"
                className="text-gray-600 hover:text-primary-600 font-semibold text-sm transition-colors border-b-2 border-transparent hover:border-primary-600 pb-1"
              >
                Layanan
              </a>
              <a
                href="#berita"
                className="text-gray-600 hover:text-primary-600 font-semibold text-sm transition-colors border-b-2 border-transparent hover:border-primary-600 pb-1"
              >
                Berita
              </a>
              <a
                href="#kontak"
                className="text-gray-600 hover:text-primary-600 font-semibold text-sm transition-colors border-b-2 border-transparent hover:border-primary-600 pb-1"
              >
                Kontak
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 font-bold transition px-2 py-2 text-sm"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-all font-bold shadow-md hover:shadow-lg text-sm transform hover:-translate-y-0.5"
              >
                Daftar Akun
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="beranda"
        className="pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 to-white scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left px-4 sm:px-6 lg:px-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 border border-blue-200">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Sistem Pelayanan Digital Desa
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                Urus Administrasi <br className="hidden lg:block" />
                <span className="text-primary-600">Lebih Cepat</span> &
                Transparan
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Platform resmi Pemerintah Desa Mragel untuk memudahkan warga
                dalam pengajuan surat keterangan dan penyampaian aspirasi secara
                online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#layanan"
                  className="bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition font-semibold text-lg border border-gray-200 flex items-center justify-center hover:border-gray-300"
                >
                  Lihat Layanan
                </a>
              </div>
            </div>
            <div className="relative mt-10 lg:mt-0 px-4 sm:px-6 lg:px-0">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition duration-500">
                <img
                  src={fotoMragel}
                  alt="Kantor Desa Mragel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAYANAN */}
      <section id="layanan" className="py-20 bg-white relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4 sm:px-6 lg:px-0">
            <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-2">
              Layanan Kami
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Desa Digital
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai kemudahan yang kami sediakan untuk memenuhi kebutuhan
              administrasi kependudukan Anda secara efisien.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-0">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 group hover:bg-white"
              >
                <div className="mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BERITA DESA */}
      <section id="berita" className="py-24 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 px-4 sm:px-6 lg:px-0">
            <div>
              <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-2">
                Kabar Desa
              </h2>
              <h3 className="text-3xl font-bold text-gray-900">
                Berita & Informasi Terkini
              </h3>
            </div>
            <Link
              to="/berita"
              className="hidden md:flex items-center text-primary-700 font-medium hover:underline"
            >
              Lihat Semua Berita <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-0">
            {beritaList.length === 0 && (
              <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">
                  Belum ada berita yang dipublikasikan.
                </p>
              </div>
            )}

            {beritaList.map((berita) => (
              <div
                key={berita.id_berita}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
              >
                <div
                  className="relative h-52 bg-gray-200 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedBerita(berita)}
                >
                  <img
                    src={
                      berita.gambar
                        ? `${IMAGE_URL}${berita.gambar}`
                        : "https://via.placeholder.com/400x300?text=No+Image" // Fallback aman
                    }
                    alt={berita.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-primary-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
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
                    className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition leading-snug line-clamp-2 cursor-pointer"
                    onClick={() => setSelectedBerita(berita)}
                  >
                    {berita.judul}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {berita.isi_berita}
                  </p>

                  <button
                    onClick={() => setSelectedBerita(berita)}
                    className="inline-flex items-center text-primary-600 font-bold text-sm hover:text-primary-800 transition group/link"
                  >
                    Baca Selengkapnya
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              to="/berita"
              className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-50 w-full"
            >
              Lihat Semua Berita <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-primary-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-500 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-400 blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Siap untuk Memulai?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Daftar sekarang dan nikmati kemudahan layanan administrasi desa
            dalam genggaman Anda.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-900 px-10 py-4 rounded-full hover:bg-primary-50 transition font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Daftar Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="kontak"
        className="bg-gray-900 text-white pt-20 pb-10 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-16 px-4 sm:px-6 lg:px-0">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                {/* Logo Lamongan Footer */}
                <img
                  src={logoLamongan}
                  alt="Logo Lamongan"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm"
                />
                <span className="text-2xl font-bold">Desa Mragel</span>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Mewujudkan Desa Mragel yang Maju, Mandiri, dan Sejahtera melalui
                pelayanan publik yang prima dan inovasi digital.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-1">Alamat Kantor</h5>
                    <p className="text-gray-400 text-sm">
                      Desa Mragel, Kec. Sukorame, Kab. Lamongan,
                      <br />
                      Jawa Timur 62276
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-1">Telepon / WhatsApp</h5>
                    <p className="text-gray-400 text-sm">
                      +62 815-5466-8378 (Pelayanan)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-1">Email</h5>
                    <p className="text-gray-400 text-sm">
                      kantordesamragel@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border-4 border-gray-700 h-[300px] lg:h-full relative shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965568.7124336286!2d110.87295257812505!3d-7.325925299999989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7825b4801f0a25%3A0xa55c60f226f6354!2sBalai%20Desa%20Mragel!5e1!3m2!1sid!2sid!4v1771169401931!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Desa Mragel"
                className="filter grayscale hover:grayscale-0 transition duration-500"
              ></iframe>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 px-4 sm:px-6 lg:px-0">
            <p>© 2026 Pemerintah Desa Mragel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* KOMPONEN POPUP (MODAL) BERITA */}
      {selectedBerita && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedBerita(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-64 sm:h-80 w-full bg-gray-200">
              <img
                src={
                  selectedBerita.gambar
                    ? `${IMAGE_URL}${selectedBerita.gambar}`
                    : "https://via.placeholder.com/800x400?text=No+Image"
                }
                alt={selectedBerita.judul}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=No+Image";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block">
                  {selectedBerita.kategori}
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {selectedBerita.judul}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
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

              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedBerita.isi_berita}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedBerita(null)}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition"
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

export default Landing;
