const housesContainer = document.getElementById('housesContainer');
 
 

(async function () {

const log = await loadExploreLog();

HOUSES.forEach(function (house) {
 
  // 1) สร้างกล่องแม่ของบ้านนี้ 1 หลัง (ครอบทั้งหัวข้อ + เลือด + รูป + คำอธิบาย)
  const section = document.createElement('div');
  section.className = 'house-section';
 
  // 2) ใส่โครง HTML ของบ้านหลังนี้ทั้งหมดทีเดียว โดยดึงค่าจาก object "house"
  //    (ปลอดภัยเพราะข้อมูลมาจาก house-data.js ที่เราคุมเอง ไม่ใช่ข้อมูลจากคนอื่นพิมพ์เข้ามา)
  section.innerHTML = `
 
    <div class="house-main-row">
      <div class="house-health-box">
        <div class="label">สถานะบ้าน</div>
        <div class="health-icons" id="healthIcons-${house.id}"></div>
      </div>
 
      <div class="house-photo-frame">
        <img src="${house.image}" alt="${house.name}">
      </div>
    </div>
 
    <p class="house-description">${house.description}</p>

    <div class="house-owned-items">
    <div class="label">ของที่เก็บได้</div>
    <div class="item-card-grid" id="houseItems-${house.id}"></div>
  </div>
  `;
 
  // 3) เอาบล็อกที่สร้างเสร็จแล้ว ต่อท้ายเข้าไปในหน้าเว็บ
  housesContainer.appendChild(section);
 
  // 4) วาดไอคอนเลือดของบ้านหลังนี้ (หาช่องที่เพิ่งสร้างด้วย id เฉพาะของบ้านนี้)
  const iconsWrap = document.getElementById('healthIcons-' + house.id);
 
  for (let i = 1; i <= house.maxHealth; i++) {
    const icon = document.createElement('img');
    icon.src = house.bloodIcon;
    icon.alt = 'เลือดดวงที่ ' + i;
    icon.className = 'blood-icon';
 
    if (i > house.health) {
      icon.classList.add('empty');
    }

const itemsWrap = document.getElementById('houseItems-' + house.id);

const counts = {};
log.filter(function (e) {
  return e.house === house.name && !e.rare;   // เอาเฉพาะของทั่วไป ของบ้านนี้เท่านั้น
}).forEach(function (e) {
  counts[e.itemKey] = (counts[e.itemKey] || 0) + 1;
});

const itemKeys = Object.keys(counts);
if (itemKeys.length === 0) {
  itemsWrap.innerHTML = '<div class="empty-note">ยังไม่มีของที่เก็บได้</div>';
} else {
  itemsWrap.innerHTML = itemKeys.map(function (key) {
    const item = ITEM_LIBRARY[key];
    return `
      <div class="item-card">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-card-name">${item.name}</div>
        <div class="item-card-count">เก็บได้ ${counts[key]} ชิ้น</div>
      </div>
    `;
  }).join('');
}
 
    iconsWrap.appendChild(icon);
  }
 
});

})();
