# Self Payment Website 💳

Website sistem pembayaran mandiri dengan fitur scan QR code untuk melihat menu dan melakukan pemesanan. Dilengkapi dengan dashboard admin untuk mengelola menu dan transaksi. Dibangun menggunakan Next.js dan Supabase.

## 📱 Screenshots

### 🛍️ Client Pages

<table>
  <tr>
    <td width="50%">
      <h4>1. Hero Section</h4>
      <img src="/assets/1.png" width="100%">
      <p>Halaman utama dengan hero section yang menarik, menampilkan tagline dan call-to-action untuk scan QR code</p>
    </td>
    <td width="50%">
      <h4>2. How It Works</h4>
      <img src="/assets/2.png" width="100%">
      <p>Penjelasan cara menggunakan sistem self payment dengan langkah-langkah yang mudah dipahami</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>3. Menu List</h4>
      <img src="/assets/3.png" width="100%">
      <p>Daftar menu yang tersedia dengan gambar, deskripsi, dan harga. Customer dapat memilih dan menambahkan ke keranjang</p>
    </td>
    <td width="50%">
      <h4>4. Scan QR Table</h4>
      <img src="/assets/4.png" width="100%">
      <p>Fitur scan QR code untuk menentukan nomor meja dan memulai pemesanan</p>
    </td>
  </tr>
</table>

---

### 📊 Dashboard Admin

<table>
  <tr>
    <td width="50%">
      <h4>5. Dashboard Summary</h4>
      <img src="/assets/5.png" width="100%">
      <p>Ringkasan data penjualan, total transaksi, revenue, dan statistik penting lainnya</p>
    </td>
    <td width="50%">
      <h4>6. Order List</h4>
      <img src="/assets/6.png" width="100%">
      <p>Daftar semua pesanan yang masuk dengan status, nomor meja, dan detail pemesanan</p>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <h4>7. Menu Management</h4>
      <img src="/assets/7.png" width="100%">
      <p>Halaman untuk mengelola menu - tambah, edit, hapus item menu dengan gambar dan harga</p>
    </td>
  </tr>
</table>

---

## ✨ Fitur Utama

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>👤 Client Side</h3>
      <ul>
        <li>✅ <b>Hero Section</b> - Landing page yang menarik</li>
        <li>✅ <b>How It Works</b> - Panduan penggunaan sistem</li>
        <li>✅ <b>Scan QR Code</b> - Scan untuk pilih nomor meja</li>
        <li>✅ <b>Menu List</b> - Browse menu dengan gambar & harga</li>
        <li>✅ <b>Add to Cart</b> - Tambahkan menu ke keranjang</li>
        <li>✅ <b>Order Confirmation</b> - Konfirmasi pesanan sebelum submit</li>
        <li>✅ <b>Payment Status</b> - Tracking status pembayaran</li>
        <li>✅ <b>Responsive Design</b> - Optimal di semua device</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🔧 Dashboard Admin</h3>
      <ul>
        <li>✅ <b>Dashboard Summary</b> - Overview revenue & statistik</li>
        <li>✅ <b>Order Management</b> - Kelola pesanan masuk</li>
        <li>✅ <b>Menu Management</b> - CRUD menu items</li>
        <li>✅ <b>Table Management</b> - Kelola QR code meja</li>
        <li>✅ <b>Real-time Orders</b> - Notifikasi pesanan baru</li>
        <li>✅ <b>Sales Report</b> - Laporan penjualan</li>
        <li>✅ <b>Export Data</b> - Export ke Excel/PDF</li>
        <li>✅ <b>User Management</b> - Kelola admin & staff</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🚀 Tech Stack

<table>
  <tr>
    <td align="center" width="20%">
      <h4>⚡ Next.js 14</h4>
      <p>App Router</p>
    </td>
    <td align="center" width="20%">
      <h4>🗄️ Supabase</h4>
      <p>Database & Auth</p>
    </td>
    <td align="center" width="20%">
      <h4>🎨 Tailwind CSS</h4>
      <p>Styling</p>
    </td>
    <td align="center" width="20%">
      <h4>📘 TypeScript</h4>
      <p>Language</p>
    </td>
    <td align="center" width="20%">
      <h4>🚀 Vercel</h4>
      <p>Deployment</p>
    </td>
  </tr>
</table>

---

## 🎨 Features Implemented

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>Client Features</h3>
      <ul>
        <li>✅ QR Code Scanner untuk meja</li>
        <li>✅ Browse menu dengan filter kategori</li>
        <li>✅ Shopping cart system</li>
        <li>✅ Real-time order status</li>
        <li>✅ Payment integration</li>
        <li>✅ Order history</li>
        <li>✅ Rating & review menu</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>Dashboard Features</h3>
      <ul>
        <li>✅ Real-time order notifications</li>
        <li>✅ Sales analytics & charts</li>
        <li>✅ Menu CRUD operations</li>
        <li>✅ Order status management</li>
        <li>✅ Table QR code generator</li>
        <li>✅ Export reports (CSV/PDF)</li>
        <li>✅ Multi-user access control</li>
      </ul>
    </td>
  </tr>
</table>

---

## 💳 Payment Flow

<table>
  <tr>
    <td align="center" width="25%">
      <h4>1️⃣ Scan QR</h4>
      <p>Customer scan QR code di meja</p>
    </td>
    <td align="center" width="25%">
      <h4>2️⃣ Browse Menu</h4>
      <p>Pilih menu & tambah ke cart</p>
    </td>
    <td align="center" width="25%">
      <h4>3️⃣ Order</h4>
      <p>Konfirmasi & submit order</p>
    </td>
    <td align="center" width="25%">
      <h4>4️⃣ Payment</h4>
      <p>Bayar & terima konfirmasi</p>
    </td>
  </tr>
</table>

---

## ⚙️ Fitur Supabase

<table>
  <tr>
    <td align="center">✅ Authentication</td>
    <td align="center">✅ PostgreSQL Database</td>
    <td align="center">✅ Row Level Security</td>
  </tr>
  <tr>
    <td align="center">✅ Real-time Subscriptions</td>
    <td align="center">✅ Auto REST API</td>
    <td align="center">✅ Storage (Menu Images)</td>
  </tr>
</table>

---

## 🔒 Security & Performance

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🔐 Security</h3>
      <ul>
        <li>Row Level Security (RLS)</li>
        <li>Protected admin routes</li>
        <li>JWT authentication</li>
        <li>Input sanitization</li>
        <li>Secure payment gateway</li>
        <li>QR code encryption</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>⚡ Performance</h3>
      <ul>
        <li>Server-side rendering</li>
        <li>Image optimization</li>
        <li>Database indexing</li>
        <li>Edge caching</li>
        <li>Lazy loading menu items</li>
        <li>Real-time updates</li>
      </ul>
    </td>
  </tr>
</table>

---

<div align="center">
  <h3>👨‍💻 Developer</h3>
  <p>Dibuat dengan ❤️ menggunakan <b>Next.js</b> dan <b>Supabase</b></p>
  <p><i>Self Payment System for Modern Restaurants</i></p>
</div>
