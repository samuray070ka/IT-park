// URL dan {id} ni olish
const itemId = new URL(window.location.href).searchParams.get('id'); // /item/{id} dan {id}ni olish
console.log('Item ID:', itemId);
 
// Backenddan ma'lumotni olish
fetch(`https://supposedly-bold-ocelot.ngrok-free.app/items/${itemId}`, {
    method: 'GET',
    headers: {
        'ngrok-skip-browser-warning': true,
    },
})
  .then(response => {
      if (!response.ok) {
          throw new Error('Ma\'lumotni olishda xatolik yuz berdi!');
      }
      return response.json();
  })
  .then(item => {
      // Ma'lumotlarni sahifada ko'rsatish
      document.getElementById('itemName').innerText = 'Nomi: ' + item.name;
      document.getElementById('itemFloor').innerText = 'Etaj raqami: ' + item.floor;
      document.getElementById('itemRoom').innerText = 'Tashkilot nomi: ' + item.room;
    
      // QR kod rasm URLini yangilash
      const qrImageElement = document.getElementById('qrImage');
      if (item.qrcode_url) {
          qrImageElement.src = item.qrcode_url; // Backenddan kelgan QR kod URL
          qrImageElement.alt = `QR Code for ${item.name}`;
      } else {
          qrImageElement.alt = 'QR Code mavjud emas';
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Ma\'lumotni olishda xato yuz berdi!');
  });
