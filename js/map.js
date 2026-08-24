const mapTabs = document.getElementById('mapTabs');
const mapWrap = document.getElementById('map-Wrap');
const mapImg = document.getElementById('mapImg');

const modalOverlay = document.getElementById('MapModalOverlay');
const modalImg = document.getElementById('MapModalImg');
const modalName = document.getElementById('MapModalName');
const modalDesc = document.getElementById('MapModalDesc');
const modalClose = document.getElementById('MapModalClose');

let currentMapId = null;

MAPS.forEach(function (map) {
  const tabBtn = document.createElement('button');
  tabBtn.className = 'map-tab';
  tabBtn.textContent = map.label;
  tabBtn.dataset.mapId = map.id;
 
  tabBtn.addEventListener('click', function () {
    switchMap(map.id);
 });
 
  mapTabs.appendChild(tabBtn);
});

function switchMap(mapId) {
  const map = MAPS.find(function (m) { return m.id === mapId; });
  if (!map) return;
 
  currentMapId = mapId;
 
  // 2) เปลี่ยนรูปพื้นหลัง
  mapImg.src = map.image;
  mapImg.alt = map.label;
 
  // 3) ลบหมุดเก่าทั้งหมด (แต่ไม่ลบตัวรูป <img> เพราะมันอยู่ใน mapWrap เดียวกัน)
  document.querySelectorAll('.pin').forEach(function (pin) {
    pin.remove();
  });
 
  // 4) วาดหมุดใหม่ตามแผนที่ที่เลือก
  map.locations.forEach(function (loc) {
    const pin = document.createElement('div');
    pin.className = 'pin';
    pin.style.left = loc.x + '%';
    pin.style.top  = loc.y + '%';
    pin.innerHTML = '<span class="tooltip">' + loc.name + '</span>';
 
    pin.addEventListener('click', function () {
      openModal(loc);
    });
 
    mapWrap.appendChild(pin);
  });
 
  // 5) อัปเดตปุ่มแท็บ ให้ปุ่มที่เลือกมี class "active"
  document.querySelectorAll('.map-tab').forEach(function (tabBtn) {
    tabBtn.classList.toggle('active', tabBtn.dataset.mapId === mapId);
  });
}
 
// เปิดหน้ามาครั้งแรก ให้โชว์แผนที่ตัวแรกใน MAPS ก่อนเป็นค่าเริ่มต้น
switchMap(MAPS[0].id);
 
 
/* -------------------------------------------------------------------------
   เปิด/ปิด Modal (เหมือนเดิม ไม่เกี่ยวกับการสลับแผนที่)
------------------------------------------------------------------------- */
function openModal(loc) {
  modalImg.src = loc.image;
  modalImg.alt = loc.name;
  modalName.textContent = loc.name;
  modalDesc.textContent = loc.description;
  modalOverlay.classList.add('open');
}
 
function closeModal() {
  modalOverlay.classList.remove('open');
}
 
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) closeModal();
});



// เอาไว้หาพิกัด x y 


mapWrap.addEventListener('click', function (e) {
  const rect = mapWrap.getBoundingClientRect();
  const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
  const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
  console.log('map:', currentMapId, '  x:', xPercent.toFixed(1), '  y:', yPercent.toFixed(1));
});
