fetch('https://supposedly-bold-ocelot.ngrok-free.app/items', {
    method: 'GET',
    headers: {
        'ngrok-skip-browser-warning': true,
    },
})
  .then(response => {
      if (!response.ok) {
          throw new Error('Tarmoq xatoligi: ' + response.status);
      }
      return response.json();
  })
  .then(response => { 
      // API javobini konsolga chiqarish
      console.log('API javobi:', response);

      // items.items bo'yicha ma'lumotlarni olish
      const data = response.items || []; // 'items' massivini olish
      const qrCodeList = document.getElementById('qrCodeList');

      if (data.length === 0) {
          qrCodeList.innerHTML = '<p>Hech qanday ma\'lumot topilmadi.</p>';
          return;
      }

      // Ma'lumotni ko'rsatish
      data.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('qr-item');

          itemDiv.innerHTML = `
              <h3 class="qr_logo">Nomi: ${item.name}</h3>
              <p class="qr_logo">Etaj raqami: ${item.floor}</p>
              <p class="qr_logo">Tashkilot nomi: ${item.room}</p>
              <img src="${item.qrcode_url}" alt="QR Code for ${item.name}" class="qr-img">
              <hr>
              `;
          qrCodeList.appendChild(itemDiv);
      });

  })
  .catch(error => {
      console.error('Xatolik:', error);
      const qrCodeList = document.getElementById('qrCodeList');
      qrCodeList.innerHTML = '<p>Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.</p>';
  });
