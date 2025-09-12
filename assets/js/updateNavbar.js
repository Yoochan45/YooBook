// updateNavbar.js - Fungsi untuk update navbar berdasarkan status login

function updateNavbar() {
    // Ambil data user dari localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // Ambil elemen-elemen navbar
    const loginBtn = document.getElementById('loginBtn');
    const profileSection = document.getElementById('profileSection');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    if (user) {
        // User sudah login - tampilkan profile, sembunyikan login
        if (loginBtn) loginBtn.style.display = 'none';
        if (profileSection) profileSection.style.display = 'block';
        
        // Update data user di dropdown
        if (userName) userName.textContent = user.name;
        if (userEmail) userEmail.textContent = user.email;
        
        console.log('Navbar updated: User logged in as', user.name);
    } else {
        // User belum login - tampilkan login, sembunyikan profile
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (profileSection) profileSection.style.display = 'none';
        
        console.log('Navbar updated: User not logged in');
    }
}

// Fungsi untuk logout (dipanggil dari dropdown)
function handleNavbarLogout() {
    // Hapus data user dari localStorage
    localStorage.removeItem('user');
    
    // Update navbar kembali ke state belum login
    updateNavbar();
    
    // Tampilkan pesan dan redirect
    alert('Anda telah logout');
    window.location.href = '/index.html';
}

// Auto-run saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    
    // Tambahkan event listener untuk logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavbarLogout();
        });
    }
});

// Export fungsi agar bisa dipanggil dari file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateNavbar, handleNavbarLogout };
}