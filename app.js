let scene, camera, renderer, sphere, isMouseDown = false, prevX = 0, prevY = 0;
let zoomFactor = 1; 
const zoomLimits = { min: 0.5, max: 2 }; 
const cameraLimits = { near: 120, far: 400 }; 

const namanganCoords = { lat: 40.1034, lon: 71.7796 };

const itParkParams = {
  height: 30,
  width: 10, 
  depth: 10, 
  color: 0x00ff00 
};

let itParkBuilding;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('banner').appendChild(renderer.domElement);

  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = Math.random() * 2000 - 1000;
    positions[i * 3 + 1] = Math.random() * 2000 - 1000;
    positions[i * 3 + 2] = Math.random() * 2000 - 1000;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 1 });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  const radius = 100; 
  const segments = 32;
  const texture = new THREE.TextureLoader().load(
    'https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg'
  );

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x444444, 
    emissive: 0x444444 
  });

  const sphereGeometry = new THREE.SphereGeometry(radius, segments, segments);
  sphere = new THREE.Mesh(sphereGeometry, material);
  scene.add(sphere);

  const itParkGeometry = new THREE.BoxGeometry(itParkParams.width, itParkParams.height, itParkParams.depth);
  const itParkMaterial = new THREE.MeshBasicMaterial({ color: itParkParams.color });
  itParkBuilding = new THREE.Mesh(itParkGeometry, itParkMaterial);

  const namanganPosition = geoTo3DCoords(namanganCoords.lat, namanganCoords.lon, radius + itParkParams.height / 2);
  itParkBuilding.position.set(namanganPosition.x, namanganPosition.y, namanganPosition.z);

  scene.add(itParkBuilding);

  camera.position.z = 200;

  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
  pointLight.position.set(0, 0, 200);
  scene.add(pointLight);

  animate();
}

function geoTo3DCoords(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
}

function enforceCameraLimits() {
  camera.position.z = Math.max(cameraLimits.near, Math.min(camera.position.z, cameraLimits.far));
}

// Animatsiya
function animate() {
  requestAnimationFrame(animate);

  itParkBuilding.visible = camera.position.z < 300;

  sphere.rotation.y += 0.001;

  enforceCameraLimits();

  renderer.render(scene, camera);
}

document.addEventListener('wheel', (event) => {
  if (event.deltaY > 0) {
    zoomFactor += 0.05;
  } else {
    zoomFactor -= 0.05;
  }

  zoomFactor = Math.max(zoomLimits.min, Math.min(zoomFactor, zoomLimits.max)); 
  camera.position.z = 300 * zoomFactor;

  event.preventDefault();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();


function validateNumberInput(inputId) {
  const inputField = document.getElementById(inputId);
  inputField.value = inputField.value.replace(/[^0-9]/g, '');
}
 
function validateSingleDigit(inputId) {
  const inputField = document.getElementById(inputId);
  inputField.value = inputField.value.replace(/[^0-9]/g, '').slice(0, 1);
}

document.getElementById('roomForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const etaj = parseInt(document.getElementById('etaj').value);
  const xona = document.getElementById('xona').value;

  const formData = {
      name: name,
      floor: etaj,
      room: xona
  };

  const token = localStorage.getItem('auth_token'); // LocalStorage-dan tokenni olish
fetch('https://supposedly-bold-ocelot.ngrok-free.app/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Authorizationni token bilan yuborish
  },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    alert('Ma\'lumot yuborildi!');
    console.log('Success:', data);

    // qrcode_url ni olish va HTML'dagi a tagiga qo'yish
    const qrcodeUrl = data.qrcode_url;
    const aTag = document.getElementById('qrcodeLink'); // a tegini ID bo'yicha olish
    aTag.href = qrcodeUrl; // a tegining href atributiga qrcode_url ni qo'yish
})
.catch((error) => {
    alert('Xato yuz berdi!');
    console.error('Error:', error);
});
})



// URL'dan id ni olish
const logoutBtn = document.getElementById('logoutBtn');
document.addEventListener('DOMContentLoaded', () => {
  // DOM elementlarini olish
  const token = localStorage.getItem('auth_token');
//   const logoutBtn = document.getElementById('logoutBtn'); // Bu yerda logoutBtn elementini olish

  if (!token) {
    // Agar token mavjud bo'lmasa, login sahifasiga yo'naltirish
    window.location.href = 'login.html';
  }
  logoutBtn.addEventListener("click", ()=> {
    localStorage.removeItem('auth_token')
    window.location.href = 'login.html';
  })
});