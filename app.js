let scene, camera, renderer, sphere, isMouseDown = false, prevX = 0, prevY = 0;
let zoomFactor = 1; // Zoom darajasi
const zoomLimits = { min: 0.5, max: 2 }; // Zoom chegaralari
const cameraLimits = { near: 120, far: 400 }; // Kamera chegaralari

// Namanganning geolokatsiyasi (Latitude, Longitude)
const namanganCoords = { lat: 40.1034, lon: 71.7796 };

// IT Park binosini yaratish uchun parametrlari
const itParkParams = {
  height: 30, // Bino balandligi
  width: 10, // Bino kengligi
  depth: 10, // Bino chuqurligi
  color: 0x00ff00 // Yashil rang
};

let itParkBuilding;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('banner').appendChild(renderer.domElement);

  // Koinot fonini yaratish
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = Math.random() * 2000 - 1000; // X
    positions[i * 3 + 1] = Math.random() * 2000 - 1000; // Y
    positions[i * 3 + 2] = Math.random() * 2000 - 1000; // Z
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 1 });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Yer sharini yaratish
  const radius = 100; // Yer radiusi
  const segments = 32;
  const texture = new THREE.TextureLoader().load(
    'https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg'
  );

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x444444, // Qoraroq rang
    emissive: 0x444444 // Tungi yorug'lik effektini yaratadi
  });

  const sphereGeometry = new THREE.SphereGeometry(radius, segments, segments);
  sphere = new THREE.Mesh(sphereGeometry, material);
  scene.add(sphere);

  // IT Park binosini Namanganga joylashtirish
  const itParkGeometry = new THREE.BoxGeometry(itParkParams.width, itParkParams.height, itParkParams.depth);
  const itParkMaterial = new THREE.MeshBasicMaterial({ color: itParkParams.color });
  itParkBuilding = new THREE.Mesh(itParkGeometry, itParkMaterial);

  const namanganPosition = geoTo3DCoords(namanganCoords.lat, namanganCoords.lon, radius + itParkParams.height / 2);
  itParkBuilding.position.set(namanganPosition.x, namanganPosition.y, namanganPosition.z);

  scene.add(itParkBuilding);

  // Kamera sozlash
  camera.position.z = 200;

  // Yorug'likni qo'shish
  const ambientLight = new THREE.AmbientLight(0x333333); // Yumshoq yorug'lik
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
  pointLight.position.set(0, 0, 200);
  scene.add(pointLight);

  animate();
}

// Geolokatsiyani 3D koordinatalarga o'tkazish
function geoTo3DCoords(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
}

// Kamera chegaralarini sozlash funksiyasi
function enforceCameraLimits() {
  camera.position.z = Math.max(cameraLimits.near, Math.min(camera.position.z, cameraLimits.far));
}

// Animatsiya
function animate() {
  requestAnimationFrame(animate);

  // IT Park binosini ko'rinadigan qilish
  itParkBuilding.visible = camera.position.z < 300;

  // Globusning avtomatik aylanishi
  sphere.rotation.y += 0.001;

  // Kamera chegaralarini tekshirish
  enforceCameraLimits();

  renderer.render(scene, camera);
}

// Zoom qilish
document.addEventListener('wheel', (event) => {
  if (event.deltaY > 0) {
    zoomFactor += 0.05;
  } else {
    zoomFactor -= 0.05;
  }

  zoomFactor = Math.max(zoomLimits.min, Math.min(zoomFactor, zoomLimits.max)); // Zoomni cheklash
  camera.position.z = 300 * zoomFactor;

  event.preventDefault();
});

// Sahna o'lchamini o'zgartirish
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();


// Raqamlarni faqat raqamlar bilan cheklash
function validateNumberInput(inputId) {
  const inputField = document.getElementById(inputId);
  // Faqat raqamlar kiritilishi uchun boshqa belgilarni olib tashlash
  inputField.value = inputField.value.replace(/[^0-9]/g, '');
}

// Faol inputlar uchun faqat bitta raqamni qabul qilish
function validateSingleDigit(inputId) {
  const inputField = document.getElementById(inputId);
  // Faol maydonda faqat bitta raqamni qabul qilish, boshqa belgilarni olib tashlash
  inputField.value = inputField.value.replace(/[^0-9]/g, '').slice(0, 1);
}

// Forma yuborilganda ma'lumotlarni tekshirish
document.getElementById('roomForm').addEventListener('submit', function(event) {
  event.preventDefault();  // Formni yuborishni to'xtatish

  // Forma maydonlaridan ma'lumotlarni olish
  const name = document.getElementById('name').value;
  const etaj = parseInt(document.getElementById('etaj').value);
  const xona = document.getElementById('xona').value;

  // Backendga yuborish uchun ma'lumotlarni tayyorlash
  const formData = {
      name: name,
      etaj: etaj,
      xona: xona
  };

  // Ma'lumotlarni backendga yuborish
  fetch('172.18.0.1:8080/items', {  // Backend URL ni o'zgartiring
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
      alert('Ma\'lumot yuborildi!');
      console.log('Success:', data);
  })
  .catch((error) => {
      alert('Xato yuz berdi!');
      console.error('Error:', error);
  });
});


