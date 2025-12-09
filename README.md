# QuoraClone - Simple Q&A Platform

Platform tanya jawab sederhana dengan fitur autentikasi.

## Fitur

### Untuk Semua User (Tanpa Login)
- ✅ Melihat semua pertanyaan dan jawaban
- ✅ Melihat jumlah upvotes dan jawaban
- ✅ Membaca detail pertanyaan

### Untuk User yang Sudah Login
- ✅ Membuat pertanyaan baru
- ✅ Memberikan jawaban pada pertanyaan
- ✅ Upvote pertanyaan
- ✅ Hapus pertanyaan sendiri
- ✅ Hapus jawaban sendiri
- ✅ Logout

## Struktur Folder

```
quoraclone/
├── public/
│   ├── index.html          # Halaman utama
│   ├── login.html          # Halaman login
│   ├── register.html       # Halaman register
│   └── style.css           # Styles
├── routes/
│   ├── authentication.js   # Auth routes (register, login, logout)
│   ├── posts.js           # Posts CRUD
│   ├── comments.js        # Comments CRUD
│   └── likes.js           # Like system
├── models/
│   ├── User.js            # User model
│   └── Post.js            # Post model (dengan nested comments)
├── middleware/
│   └── auth.js            # Auth middleware
├── server.js              # Main server
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
npm install express mongoose express-session bcrypt
```

### 2. Setup MongoDB

Pastikan MongoDB sudah running di `mongodb://localhost:27017/quoraclone`

Atau gunakan MongoDB Atlas dan ubah connection string di `server.js` dan `seed.js`

### 3. Seed Database (Optional)

Isi database dengan data dummy untuk testing:

```bash
node seed.js
```

Ini akan membuat:
- 4 user dummy
- 8 posts dengan berbagai topik
- Comments di setiap post

**Test Accounts:**
- Username: `john_doe` | Password: `password123`
- Username: `jane_smith` | Password: `password123`
- Username: `bob_wilson` | Password: `password123`
- Username: `alice_brown` | Password: `password123`

### 4. Jalankan Server

```bash
node server.js
```

Server akan berjalan di `http://localhost:3000`

### 5. Buka Browser

- Halaman utama: `http://localhost:3000/index.html`
- Login: `http://localhost:3000/login.html`
- Register: `http://localhost:3000/register.html`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get semua posts (public)
- `GET /api/posts/:id` - Get single post (public)
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)

### Comments
- `GET /api/comments/:postId` - Get all comments (public)
- `POST /api/comments/:postId` - Add comment (protected)
- `PUT /api/comments/:postId/:commentId` - Update comment (protected, owner only)
- `DELETE /api/comments/:postId/:commentId` - Delete comment (protected, owner only)

### Likes
- `POST /api/likes/:postId` - Like a post (public)
- `DELETE /api/likes/:postId` - Unlike a post (public)

## Keamanan

- Password di-hash menggunakan bcrypt
- Session-based authentication
- Protected routes hanya bisa diakses user yang login
- User hanya bisa edit/hapus post dan comment milik sendiri

## Environment Variables (Optional)

Buat file `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quoraclone
SESSION_SECRET=your-secret-key-here
```

## Notes

- Pastikan folder `public/` berisi semua file HTML dan CSS
- Session disimpan di memory (untuk production, gunakan session store seperti Redis)
- Untuk production, enable HTTPS dan set `cookie.secure: true`
