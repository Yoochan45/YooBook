// Tunggu sampai seluruh konten HTML termuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {

    // Ambil semua elemen buku di grid dan simpan ke variabel 'books'
    const books = document.querySelectorAll('.book-item');

    // Ambil input search dari HTML
    const searchInput = document.getElementById('searchInput');

    // Ambil dropdown filter kategori dari HTML
    const categorySelect = document.getElementById('categoryFilter');

    // Fungsi untuk memfilter buku berdasarkan search dan kategori
    function filterBooks() {
        // Ambil teks yang diketik di search, ubah menjadi huruf kecil supaya case-insensitive
        const searchText = searchInput.value.toLowerCase();

        // Ambil kategori yang dipilih dari dropdown
        const selectedCategory = categorySelect.value;

        // Loop setiap buku untuk mengecek apakah cocok dengan filter
        books.forEach(book => {
            // Ambil judul buku, ubah ke huruf kecil
            const title = book.querySelector('.card-title').textContent.toLowerCase();

            // Ambil deskripsi buku, ubah ke huruf kecil
            const desc = book.querySelector('.card-text').textContent.toLowerCase();

            // Ambil kategori buku dari atribut data-category
            const bookCategory = book.dataset.category;

            // Cek apakah searchText ada di judul atau deskripsi
            const matchesSearch = title.includes(searchText) || desc.includes(searchText);

            // Cek apakah kategori cocok atau memilih "semua"
            const matchesCategory = selectedCategory === 'semua' || bookCategory === selectedCategory;

            // Jika kedua kondisi terpenuhi, tampilkan buku. Kalau tidak, sembunyikan.
            if (matchesSearch && matchesCategory) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
    }

    // Jalankan filterBooks setiap kali pengguna mengetik di search
    searchInput.addEventListener('input', filterBooks);

    // Jalankan filterBooks setiap kali pengguna mengubah kategori
    categorySelect.addEventListener('change', filterBooks);
});
