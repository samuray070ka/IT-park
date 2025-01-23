// DOM elementlar
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userNameElement = document.getElementById('userName'); 
// const logoutBtn = document.getElementById('logoutBtn');

// Backend API URL (odatda bu API endpoint bo'ladi)
const apiUrl = 'https://supposedly-bold-ocelot.ngrok-free.app/login'; // Bu URLni backendga moslang

// Login funksiyasi
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Bu xato berishi mumkin, agar passive listener bo'lsa
  
    const email = emailInput.value;
    const password = passwordInput.value;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      const { auth_token } = data;
  
      // Tokenni localStorage-ga saqlash
      localStorage.setItem('auth_token', auth_token);
  
      // Admin panelga yo'naltirish
      window.location.href = 'index.html';
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  }, { passive: false });  // passive false qo'shish