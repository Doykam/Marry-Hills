
const COL_NAME  = "ชื่อตัวละคร";
const COL_ALTNAME = "ชื่อภาษาอื่น";
const COL_STATUS  = "สถานะ";
const COL_HOUSE = "บ้าน";
const COL_PHOTO = "รูปภาพ";
const COL_IG    = "ลิงก์ไอจี";
const COL_DOC   = "ลิงก์ฟอร์ม";
 
// รวมชื่อคอลัมน์พิเศษทั้งหมดไว้ในลิสต์เดียว ใช้เช็คว่า "อันไหนพิเศษ อันไหนทั่วไป"
const RESERVED_COLUMNS = [COL_NAME, COL_ALTNAME, COL_HOUSE, COL_PHOTO, COL_IG, COL_DOC, COL_STATUS];
 
const searchInput = document.getElementById('characterSearch');
const grid = document.getElementById('characterGrid');
 
let allCharacters = []; // เก็บข้อมูลทุกคนไว้ในตัวแปรนี้ หลังดึงมาจาก Sheet สำเร็จ
 
 
/* -------------------------------------------------------------------------
   ดึงข้อมูลจาก Google Sheet ด้วย PapaParse
   header:true ทำให้แต่ละแถวกลายเป็น object โดยอัตโนมัติ โดยใช้หัวตาราง
   (แถวที่ 1 ใน Sheet) เป็นชื่อ key เช่น row["ชื่อตัวละคร"], row["บ้าน"]
------------------------------------------------------------------------- */
Papa.parse(CHARACTER_SHEET_CSV_URL, {
  download: true,
  header: true,
  complete: function (results) {
    // กรองแถวว่าง ๆ ทิ้ง (เผื่อมีแถวเปล่าติดมาจาก Sheet)
    allCharacters = results.data.filter(function (row) {
      return row[COL_NAME] && row[COL_NAME].trim() !== "";
    });
    renderCharacters(allCharacters);
  },
  error: function (err) {
    grid.innerHTML = '<div class="character-empty">โหลดข้อมูลไม่สำเร็จ ลองเช็ค URL ใน sheet-config.js</div>';
    console.error(err);
  }
});
 
 
/* -------------------------------------------------------------------------
   วาดการ์ดทั้งหมดจาก array ที่ส่งเข้ามา
------------------------------------------------------------------------- */
function renderCharacters(list) {
  grid.innerHTML = "";
 
  if (list.length === 0) {
    grid.innerHTML = '<div class="character-empty">ไม่พบตัวละครที่ค้นหา</div>';
    return;
  }
 
  list.forEach(function (row) {
    grid.appendChild(buildCard(row));
  });
}
 
 
/* -------------------------------------------------------------------------
   สร้างการ์ด 1 ใบ จาก 1 แถวข้อมูล (row)
------------------------------------------------------------------------- */
function buildCard(row) {
  const card = document.createElement('div');
  card.className = 'character-card';
 
  // ---- ส่วนซ้าย: ชื่อ / บ้าน / สเตตัสทั่วไป ----
  const info = document.createElement('div');
  info.className = 'card-info';
 
  info.innerHTML = `
  <div class="card-eyebrow">MEMBER ID</div>
  <div class="card-name">${row[COL_NAME] || ''}</div>
  ${row[COL_ALTNAME] ? `<div class="card-altname">${row[COL_ALTNAME]}</div>` : ''}
  <div class="card-house">${row[COL_HOUSE] || ''}</div>
`;
 
  // วนดูทุกคอลัมน์ใน row นี้ ถ้าไม่ใช่คอลัมน์พิเศษ (RESERVED_COLUMNS) ให้โชว์เป็นแถวสเตตัสทั่วไป
  Object.keys(row).forEach(function (colName) {
    const isReserved = RESERVED_COLUMNS.indexOf(colName) !== -1;
    const value = row[colName];
 
    if (!isReserved && colName.trim() !== "" && value && value.trim() !== "") {
      const statRow = document.createElement('div');
      statRow.className = 'card-stat';
      statRow.innerHTML = `
        <span class="stat-label">${colName}</span>
        <span class="stat-value">${value}</span>
      `;
      info.appendChild(statRow);
    }
  });
 
  card.appendChild(info);
 
  // ---- ส่วนขวา: กรอบรูปภาพ ----
 const status = (row[COL_STATUS] || '').trim().toUpperCase();
const isDead = status === 'DEAD';

const photoWrap = document.createElement('div');
photoWrap.className = 'card-photo-wrap';

const photoBox = document.createElement('div');
photoBox.className = 'card-photo-box';
photoBox.innerHTML = `<img src="${row[COL_PHOTO] || ''}" alt="${row[COL_NAME] || ''}" class="${isDead ? 'dead' : ''}">`;
photoWrap.appendChild(photoBox);

const statusBadge = document.createElement('div');
statusBadge.className = 'status-badge ' + (isDead ? 'status-dead' : 'status-alive');
statusBadge.textContent = isDead ? 'DEAD' : 'ALIVE';
photoWrap.appendChild(statusBadge);

card.appendChild(photoWrap);

if (isDead) card.classList.add('dead');
 
  // ---- แถวลิงก์ด้านล่าง: IG / เอกสารเต็ม (โชว์เฉพาะอันที่มีลิงก์จริง) ----
  const hasIg  = row[COL_IG]  && row[COL_IG].trim()  !== "";
  const hasDoc = row[COL_DOC] && row[COL_DOC].trim() !== "";
 
  if (hasIg || hasDoc) {
    const links = document.createElement('div');
    links.className = 'card-links';
    if (hasIg)  links.innerHTML += `<a href="${row[COL_IG]}"  target="_blank" rel="noopener">Instagram</a>`;
    if (hasDoc) links.innerHTML += `<a href="${row[COL_DOC]}" target="_blank" rel="noopener">ข้อมูลฉบับเต็ม</a>`;
    card.appendChild(links);
  }
 
  return card;
}
 
 
/* -------------------------------------------------------------------------
   ช่องค้นหา — กรอง allCharacters ด้วยชื่อ แล้ววาดใหม่ทุกครั้งที่พิมพ์
------------------------------------------------------------------------- */
searchInput.addEventListener('input', function () {
  const q = searchInput.value.trim().toLowerCase();
 
  const filtered = allCharacters.filter(function (row) {
    return (row[COL_NAME] || '').toLowerCase().includes(q);
  });
 
  renderCharacters(filtered);
});
