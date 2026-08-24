
const charNameInput = document.getElementById('charName');
const houseSel = document.getElementById('charHouse');
const areaSel  = document.getElementById('charArea');
const exploreBtn = document.getElementById('exploreBtn');
const warnBox = document.getElementById('warnBox');
const resultBox = document.getElementById('resultBox');
 
let hasExploredThisVisit = false; // ตัวแปรนี้อยู่ในหน่วยความจำเท่านั้น โหลดหน้าใหม่ = รีเซ็ตเป็น false อัตโนมัติ
 
 
/* -------------------------------------------------------------------------
   เติม dropdown บ้าน + พื้นที่ ตอนโหลดหน้า
------------------------------------------------------------------------- */
HOUSE_NAMES.forEach(function (h) {
  const o = document.createElement('option');
  o.value = h; o.textContent = h;
  houseSel.appendChild(o);
});
 
AREAS.forEach(function (a) {
  const o = document.createElement('option');
  o.value = a.id; o.textContent = a.name;
  areaSel.appendChild(o);
});
 
 
/* -------------------------------------------------------------------------
   ปุ่มสำรวจ
------------------------------------------------------------------------- */
exploreBtn.addEventListener('click', function () {
 
  // กันสำรวจซ้ำในการเข้าเว็บรอบเดียวกัน
  if (hasExploredThisVisit) {
    warnBox.innerHTML = '<div class="warn">คุณสำรวจไปแล้วในรอบนี้ โหลดหน้าใหม่ (refresh) เพื่อสำรวจอีกครั้ง</div>';
    return;
  }
 
  const name = charNameInput.value.trim();
  const house = houseSel.value;
  const areaId = areaSel.value;
 
  warnBox.innerHTML = '';
 
  if (!name || !house || !areaId) {
    warnBox.innerHTML = '<div class="warn">กรุณากรอกชื่อตัวละคร เลือกบ้าน และเลือกพื้นที่ให้ครบก่อนสำรวจ</div>';
    return;
  }
 
  const area = AREAS.find(function (a) { return a.id === areaId; });
 
  // ไอเทมหายากที่ถูกเก็บไปแล้ว (คำนวณจาก log ทั้งหมด)
  const log = loadExploreLog();
  const claimedRare = new Set(
    log.filter(function (e) { return e.rare; }).map(function (e) { return e.itemKey; })
  );
 
  // พูลที่สุ่มได้จริง = ของทั่วไปทั้งหมด + ของหายากที่ยังไม่มีใครเอาไป
  const availablePool = area.pool.filter(function (key) {
    const item = ITEM_LIBRARY[key];
    return !item.rare || !claimedRare.has(key);
  });
 
  if (availablePool.length === 0) {
    warnBox.innerHTML = '<div class="warn">พื้นที่นี้ไม่มีของเหลือให้สำรวจแล้ว</div>';
    return;
  }
 
  // ---- ตัดสินใจว่าจะได้ไอเทมอะไร ----
  
const resultKey = availablePool[Math.floor(Math.random() * availablePool.length)]; 
 
  const item = ITEM_LIBRARY[resultKey];
 
  // บันทึกผลลง log ทันที
  addExploreLogEntry({
    character: name,
    house: house,
    areaId: area.id,
    areaName: area.name,
    itemKey: resultKey,
    itemName: item.name,
    rare: item.rare,
    ts: Date.now()
  });
 
  hasExploredThisVisit = true;
  exploreBtn.disabled = true;
  exploreBtn.textContent = 'สำรวจไปแล้วในรอบนี้';
 
  renderResult(area, item);
});
 
 
/* -------------------------------------------------------------------------
   โชว์ผลลัพธ์
------------------------------------------------------------------------- */
function renderResult(area, item) {
  resultBox.innerHTML = `
    <div class="result">
      <div class="item-photo">
        <img src="${item.image}" alt="${item.name}">
        ${item.rare ? '<span class="rare-badge">ของหายาก</span>' : ''}
      </div>
      <div>
        <div class="tag">ผลการสำรวจ · ${area.name}</div>
        <h3>คุณเจอกับ...</h3>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
      </div>
    </div>
  `;
}