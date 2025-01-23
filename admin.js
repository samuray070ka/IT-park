document.getElementById('AdminForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Formani qayta yuklashni oldini olish
 
    const name = document.getElementById('firstName').value;
    const last_name = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const token = localStorage.getItem('auth_token'); // LocalStorage-dan tokenni olish

    // Super admin bo'lsa, admin qo'shish so'rovini yuboramiz
    try {
        const response = await fetch('https://supposedly-bold-ocelot.ngrok-free.app/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Authorizationni token bilan yuborish
            },
            body: JSON.stringify({
                name,
                last_name,
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error('Adminni qo‘shishda xatolik yuz berdi');
        }

        alert('Admin muvaffaqiyatli qo‘shildi!');
        window.location.href = 'index.html'; // Admin qo‘shilgandan so‘ng bosh sahifaga qaytish
    } catch (error) {
        alert('Xatolik: ' + error.message);
    }
});
