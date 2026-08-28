/* =========================================================================
   explore-storage.js
   เปลี่ยนจาก localStorage เป็นดึง/บันทึกผ่าน Google Apps Script Web App
   ต้องโหลด api-config.js (มี APPS_SCRIPT_URL) ก่อนไฟล์นี้เสมอ
   ========================================================================= */

// แปลงแถวจาก Sheet (หัวคอลัมน์ภาษาไทย) ให้เป็น object แบบเดิมที่โค้ดหน้าอื่นใช้อยู่
function mapExploreRow(row) {
  return {
    character: row["ตัวละคร"],
    house: row["บ้าน"],
    areaName: row["พื้นที่"],
    itemKey: row["รหัสไอเทม"],
    itemName: row["สิ่งที่พบ"],
    rare: row["ของหายาก"] === true || row["ของหายาก"] === "TRUE"
  };
}

async function loadExploreLog() {
  const res = await fetch(APPS_SCRIPT_URL + "?action=explore");
  const rows = await res.json();
  return rows.map(mapExploreRow);
}

async function addExploreLogEntry(entry) {
  await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "explore",
      data: {
        "ตัวละคร": entry.character,
        "บ้าน": entry.house,
        "พื้นที่": entry.areaName,
        "รหัสไอเทม": entry.itemKey,
        "สิ่งที่พบ": entry.itemName,
        "ของหายาก": entry.rare
      }
    })
  });
}
