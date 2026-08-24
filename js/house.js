const housesContainer = document.getElementById('housesContainer');
 
 

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
 
    iconsWrap.appendChild(icon);
  }
 
});