// auth.js - Authentication Handler

// Fungsi untuk menangani login
async function handleLogin(event) {
    event.preventDefault(); // Mencegah form reload halaman
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (result.success) {
            // Simpan data user ke localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Tampilkan pesan sukses
            alert('Login berhasil! Selamat datang, ' + result.user.name);
            
            // Redirect ke halaman utama
            window.location.href = '/index.html';
        } else {
            // Tampilkan pesan error
            alert('Login gagal: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
}

// Fungsi untuk menangani register
async function handleRegister(event) {
    event.preventDefault(); // Mencegah form reload halaman
    
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
        alert('Password dan konfirmasi password tidak sama!');
        return;
    }

    const registerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: password
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });

        const result = await response.json();

        if (result.success) {
            // Tampilkan pesan sukses
            alert('Registrasi berhasil! Silakan login dengan akun Anda.');
            
            // Redirect ke halaman login
            window.location.href = '/login.html';
        } else {
            // Tampilkan pesan error
            alert('Registrasi gagal: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
    }
}

// Fungsi untuk menangani contact form
async function handleContact(event) {
    event.preventDefault(); // Mencegah form reload halaman
    async function handleContact(event) {
    console.log('Contact form submitted!'); // Debug line
    event.preventDefault(); // Ini harus jalan
    // ... rest of code
}
    
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
        const response = await fetch('/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (result.success) {
            // Sembunyikan form dan tampilkan pesan sukses
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
            
            // Reset form setelah 3 detik dan tampilkan kembali
            setTimeout(() => {
                document.getElementById('contactForm').reset();
                document.getElementById('contactForm').style.display = 'block';
                document.getElementById('successMessage').style.display = 'none';
            }, 3000);
        } else {
            // Tampilkan pesan error
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

// Fungsi untuk logout
function handleLogout() {
    localStorage.removeItem('user');
    alert('Anda telah logout');
    window.location.href = '/index.html';
}

// Fungsi untuk update UI berdasarkan status login
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const authSection = document.getElementById('authSection');
    const loginBtn = document.getElementById('loginBtn');
    const profileSection = document.getElementById('profileSection');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');

    if (user && authSection && loginBtn && profileSection) {
        // User sudah login
        loginBtn.style.display = 'none';
        profileSection.style.display = 'block';
        if (userName) userName.textContent = user.name;
        if (userEmail) userEmail.textContent = user.email;
    } else if (authSection && loginBtn && profileSection) {
        // User belum login
        loginBtn.style.display = 'block';
        profileSection.style.display = 'none';
    }
}

// Event listeners yang akan dijalankan ketika DOM sudah siap
document.addEventListener('DOMContentLoaded', function() {
    // Update UI berdasarkan status login
    updateAuthUI();

    // Event listener untuk form login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener untuk form register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Event listener untuk form contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }

    // Event listener untuk logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Event listener untuk reset form contact
    const contactResetBtn = document.querySelector('button[type="reset"]');
    if (contactResetBtn) {
        contactResetBtn.addEventListener('click', function() {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
        });
    }
});

// Fungsi helper untuk toggle password visibility (sudah ada di HTML)
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