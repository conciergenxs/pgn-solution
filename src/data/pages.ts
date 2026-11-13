// Partnership, Articles, Careers and Contact — verbatim copy from the original site.

export const partnership = {
  hero: {
    title: 'Partnership',
    text: 'Mari kita ciptakan nilai untuk pelanggan bersama. Kolaborasi membantu kita dalam berbagai cara. Kami sangat tertarik untuk membangun kepercayaan dengan berbagai pemangku kepentingan yang memiliki minat terhadap perusahaan kami.',
    // The original page has no header image; this reuses an original project photo.
    image: '/media/media/1665721044-dji-0916.jpg',
  },
  // Summary shown on the original "Informasi" page
  summary: 'PT PGAS Solution membuka peluang bagi semua pihak untuk berkorelasi dengan PGAS Solution untuk mendukung kerjanya sesuai dengan kompetensinya.',
  procedureTitle: 'Tata Cara',
  procedures: [
    { title: 'Registrasi Penyedia Barang/Jasa', action: 'Download', href: 'https://www.pgn-solution.co.id/template/partnership/registrasi_penyedia_barang_jasa.pdf', kind: 'pdf' },
    { title: 'Pedoman Pendaftaran', action: 'Download', href: 'https://www.pgn-solution.co.id/template/partnership/pedoman_pendaftaran_penyedia_barang_jasa.pdf', kind: 'pdf' },
    { title: 'Pgas Procurement Integrated System', action: 'Detail', href: 'https://pis.pgnsolution.co.id/', kind: 'link' },
    { title: 'Pedoman Prakualifikasi CHSEMS', action: 'Download', href: 'https://www.pgn-solution.co.id/template/documents/Coaching_Clinic_CHSEMS_2022.pdf', kind: 'pdf' },
    { title: 'Pendaftaran Prakualifikasi CHSEMS', action: 'Link', href: 'https://cosmo.pgnsolution.co.id/', kind: 'link' },
  ],
  // The five procedures shown as three topics (indexes into `procedures`). Topic names reuse
  // existing copy: the section's original eyebrow, the system's name, the shared part of 4 and 5.
  procedureGroups: [
    { title: 'Penyedia Barang/Jasa', items: [0, 1] },
    { title: 'Pgas Procurement Integrated System', items: [2] },
    { title: 'Prakualifikasi CHSEMS', items: [3, 4] },
  ],
  announcementTitle: 'Pengumuman',
  // The original page lists no announcements ("ANNOUNCEMENT NOT FOUND").
  announcements: [] as { title: string; date: string; href: string }[],
};

export const articlesPage = {
  hero: {
    title: 'Informasi',
    text: 'Kami menyediakan akses ke informasi tentang kegiatan kami dan memberikan kebutuhan informasi dari komunitas kami. Anda dapat tetap mengikuti perkembangan kami dengan berlangganan peringatan email kami atau mengikuti kami di media sosial.',
    image: '/media/header/1693382477-informasi.jpg',
  },
  social: {
    title: 'Ingin tahu info terbaru kami?',
    text: 'Ikuti PT PGAS Solution melalui berbagai saluran media sosial dan lihat aktivitas terbaru kami',
  },
  pressTitle: 'Press Release',
  newsTitle: 'Berita Terbaru',
  galleryTitle: 'Galeri',
};

export const careers = {
  hero: {
    title: 'Karir',
    text: 'Kami Solutionation Hadir untuk Memberikan Solusi',
    image: '/media/header/1693381865-karis.jpg',
  },
  workWith: {
    eyebrow: 'Bekerja dengan PT PGAS Solution',
    title: 'Percaya pada nilai Perusahaan dan menjadi bagian dari tim kami',
    text: 'Di PT PGAS Solution, kami menjunjung tinggi budaya "SOLUTION". Kami adalah tim profesional yang siap untuk menyelesaikan tugas-tugas sulit, mengembangkan dan mendapatkan pencapaian terbaru setiap hari.',
    images: [
      '/media/brand/career-ourachivment-01.jpg',
      '/media/brand/career-ourachivment-02.jpg',
      '/media/brand/career-ourachivment-03.jpg',
      '/media/brand/career-ourachivment-04.jpg',
    ],
  },
  achievement: {
    title: 'Prestasi kami tidak dibuat oleh satu orang',
    text: 'Kami adalah perusahaan yang digerakkan oleh orang-orang. Bisnis PGAS Solution terus berkembang, karenanya, Kami selalu tertarik untuk mempertahankan profesional yang berkualitas dan berbakat.',
  },
  vacancy: {
    eyebrow: 'Lowongan',
    title: 'Tempat untuk mengeksplorasi ide-ide inovatif, memelihara, dan mengembangkan bakat Anda',
    text: 'Mulailah karir di mana Anda akan mendapatkan setiap kesempatan untuk tumbuh dan meningkatkan keterampilan Anda. Lihat lowongan yang tersedia.',
  },
  // Application form fields exactly as on the original "APPLY" form.
  form: {
    education: ['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3'],
    status: ['Magang', 'Permanen'],
    sex: ['Laki-laki', 'Perempuan'],
  },
};

export type Job = {
  slug: string;
  title: string;
  status: 'Magang' | 'Permanen';
  location?: string;
  deadline?: string;
  description: string; // HTML
};

// The original site lists no open vacancies at the time of migration.
// Add entries here to publish them; each gets a detail page at /careers/opportunities/<slug>.
export const jobs: Job[] = [];

export const contact = {
  hero: {
    title: 'Kontak',
    text: 'Kami selalu terbuka untuk kerja sama dan menyambut proyek-proyek baru yang menarik. Hubungi kami dengan cara apa pun yang nyaman bagi Anda dan tim kami siap menjawab pertanyaan Anda.',
    image: '/media/media/1607326150-dji-0003.jpg',
  },
  headquarters: {
    name: 'PT PGAS Solution',
    address: 'Komplek Perkantoran PGN Gedung C, Jl K.H. Zainul Arifin No. 20 Jakarta Barat, 11140 Indonesia',
    phone: '+6221 6385 4572 / 4506',
    fax: '+6221 6385 4572 / 4506',
    email: 'info@pgn-solution.co.id',
  },
  areasTitle: 'Area Operasional',
  areas: [
    { city: 'Klender', address: 'Jl. Swadaya PLN No. 5 Klender, Kel. Jatinegara, Kec. Cakung - Jakarta Timur (Gedung PGN)', phone: '-', fax: '-' },
    { city: 'Jakarta', address: 'Komplek PGN Jl. Daan Mogot Gang Macan No. 2 RT. 3/RW. 5 Duri Kepa, Kebon Jeruk - Jakarta Barat 11510', phone: '(021) 29579631', fax: '-' },
    { city: 'Bogor', address: 'Komplek Perkantoran Gas Negara Jl. MA Salmun No.41 Kel. Ciwaringin, Kec. Bogor Tengah', phone: '(0251) 7531249', fax: '-' },
    { city: 'Bekasi', address: 'Jl. Raya Pekayon No.52, RT.009/RW.001, Pekayon Jaya, Kec. Bekasi Sel., Kota Bks, Jawa Barat 17148', phone: '-', fax: '-' },
    { city: 'Karawang', address: 'Kantor PGN Area Karawang Jl. A Yani No. 54 Bay Pass, Karang Pawitan - Karawang Barat', phone: '(0267) 8604364', fax: '-' },
    { city: 'Cirebon', address: 'Jl. Veteran No. 2  Kel. Kebon Baru, Kec. Kejaksan - Kota Cirebon 45124', phone: '(0231) 233517', fax: '-' },
    { city: 'Tangerang', address: 'Komplek Mahkota Mas Jl. M.H. Thamrin Blok C No. 12 RT. 1/ RW. 006, Cikokol, Tangerang - Banten 15117', phone: '+62 21 53158077/78', fax: '-' },
    { city: 'Cilegon', address: 'Gedung  PT Perusahaan Gas Negara Lt.2  Jalan Lingkar Selatan Km 0.5 Kedaleman, Cibeber, Cilegon Banten 42442', phone: '-', fax: '-' },
    { city: 'Palembang', address: 'Jl. Merdeka No. 10 B, Kel. Talang Semut, Kec. Bukit Kecil, Palembang - Sumatera Selatan 30135 (Gedung PGN)', phone: '(0711) 5630351', fax: '-' },
    { city: 'Lampung', address: 'Jl. Gatot Subroto No. 115 Kel. Tanjung Gading, Kec. Kedamaian - Kota Bandar Lampung', phone: '(0721) 5607892', fax: '-' },
    { city: 'Surabaya', address: 'Jalan Raya Ngagel No.129-131, Kec. Wonokromo, Surabaya', phone: '(031) 5040531', fax: '-' },
    { city: 'Sidoarjo', address: 'Perumahan Taman Pinang Indah Blok C3 No. 7 Sidoarjo Kec. Sidoarjo, Kelurahan Banjarbendo, Kota Sidoarjo 61225', phone: '(031) 8073084', fax: '-' },
    { city: 'Pasuruan', address: 'Jl. RA Kartini No.72 (Ruko3&4), Desa Latek, Kec. Bangil, Pasuruan, Jawa Timur', phone: '+62 343 427422', fax: '-' },
    { city: 'Medan', address: 'Jl.KL Yos Sudarso Lorong XII No.18, Gelugur, Medan 20115 Telp.  (Gedung PGN)', phone: '(061) 44032635', fax: '-' },
    { city: 'Batam', address: 'Gedung PGN, Lt. 4 Jl. Raja Isa, Batam Center, Batam, Kepulauan Riau (Gedung PGN)', phone: '-', fax: '-' },
    { city: 'Semarang', address: 'Jl. Pemuda No. 100, Kembangsari, Kecamatan Semarang Tengah, Kota Semarang, Jawa Tengah 50133', phone: '-', fax: '-' },
    { city: 'Sorong', address: 'Jl. Nangka No.10, Kel Malawili, Distrik Aimas, Kab. Sorong, Papua Barat 98457', phone: '-', fax: '-' },
    { city: 'Tarakan', address: 'Jl. Mulawarman No 14 B, Tarakan, Kalimantan Utara 77111', phone: '-', fax: '-' },
    { city: 'Riau (Dumai)', address: 'Jl. S.Moh Amin (Janur Kuning) No. 113, Kel. Jaya Mukti, Kec. Dumai Timur, Kota Dumai, Riau 28826', phone: '-', fax: '-' },
    { city: 'Kalimantan', address: 'Jl. Ki Hajar Dewantara, Muara Badak, Kabupaten Kutai Kartanegara, Kalimantan Timur 75382', phone: '-', fax: '-' },
    { city: 'Gresik', address: 'Jl. Cerme Kidul Gang. V No. 24 Cerme Kidul Kec. Cerme  Kab. Gresik - Jawa Timur', phone: '-', fax: '-' },
    { city: 'Siak', address: 'Jl. Jaya Perkasa No. 202, Perawang Kec. Tualang, Kab. Siak, Prov. Riau', phone: '-', fax: '-' },
    { city: 'Pelalawan', address: 'Jl. Sultan Syarif Hasyim Kel. Pangkalan Kerinci Barat, Kec. Pangkalan Kerinci, Kab. Pelalawan 28381', phone: '-', fax: '-' },
  ],
  hotline: {
    title: 'Hotline Center',
    text: 'Untuk tanggapan cepat, silakan hubungi pusat hotline kami',
    number: '+6281211888645',
    href: 'https://wa.me/+6281211888645',
    note: '*Mohon maaf untuk pusat hotline kami sementara hanya melalui chat terimakasih.',
  },
  formTitle: 'atau tinggalkan pesan',
};
