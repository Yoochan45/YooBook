// auth.js - Authentication Handler
// Semua fungsi di sini berhubungan dengan login, register, contact form, logout, dan update UI

// ===================== LOGIN =====================
async function handleLogin(event) {
    event.preventDefault(); // Mencegah form reload halaman (default behavior HTML)

    // Ambil data dari form login
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        // Kirim data login ke server (POST /login)
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (result.success) {
            // Jika login berhasil, simpan data user di localStorage (mirip session)
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Beri notifikasi sukses
            alert('Login berhasil! Selamat datang, ' + result.user.name);
            
            // Redirect ke halaman utama
            window.location.href = '/index.html';
        } else {
            // Jika gagal, tampilkan pesan error
            alert('Login gagal: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
}

// ===================== REGISTER =====================
async function handleRegister(event) {
    event.preventDefault(); // Mencegah reload

    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
        alert('Password dan konfirmasi password tidak sama!');
        return;
    }

    // Ambil data register
    const registerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: password
    };

    try {
        // Kirim data register ke server (POST /register)
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        const result = await response.json();

        if (result.success) {
            alert('Registrasi berhasil! Silakan login dengan akun Anda.');
            window.location.href = '/login.html';
        } else {
            alert('Registrasi gagal: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
    }
}

// ===================== CONTACT FORM =====================
async function handleContact(event) {
    event.preventDefault(); // Mencegah reload

    const formData = new FormData(event.target);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Validasi checkbox privacy
    const privacyChecked = formData.get('privacy');
    if (!privacyChecked) {
        alert('Anda harus menyetujui kebijakan privasi dan syarat & ketentuan.');
        return;
    }

    try {
        // Kirim contact form ke server (POST /contacts)
        const response = await fetch('/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (result.success) {
            // Jika berhasil, sembunyikan form & tampilkan pesan sukses
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';

            // Reset form setelah 3 detik
            setTimeout(() => {
                document.getElementById('contactForm').reset();
                document.getElementById('contactForm').style.display = 'block';
                document.getElementById('successMessage').style.display = 'none';
            }, 3000);
        } else {
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
            console.error('Contact error:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    }
}

// ===================== LOGOUT =====================
function handleLogout() {
    localStorage.removeItem('user'); // Hapus data user
    alert('Anda telah logout');
    window.location.href = '/index.html';
}

// ===================== UPDATE UI LOGIN =====================
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const authSection = document.getElementById('authSection');
    const loginBtn = document.getElementById('loginBtn');
    const profileSection = document.getElementById('profileSection');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');

    if (user && authSection && loginBtn && profileSection) {
        // User sudah login → tampilkan profile, sembunyikan tombol login
        loginBtn.style.display = 'none';
        profileSection.style.display = 'block';
        if (userName) userName.textContent = user.name;
        if (userEmail) userEmail.textContent = user.email;
    } else if (authSection && loginBtn && profileSection) {
        // User belum login → tampilkan login, sembunyikan profile
        loginBtn.style.display = 'block';
        profileSection.style.display = 'none';
    }
}

// ===================== EVENT LISTENERS =====================
document.addEventListener('DOMContentLoaded', function() {
    // Update UI login/register ketika halaman dimuat
    updateAuthUI();

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContact);

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Reset contact form
    const contactResetBtn = document.querySelector('button[type="reset"]');
    if (contactResetBtn) {
        contactResetBtn.addEventListener('click', function() {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
        });
    }
});

// ===================== HELPER =====================
// Toggle visibility password di form login/register
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'bi bi-eye-slash password-toggle';
    } else {
        field.type = 'password';
        icon.className = 'bi bi-eye password-toggle';
    }
}
