
const viewTabs = document.querySelectorAll('.view-tab');
const categoryFilter = document.getElementById('categoryFilter');
const itemsView = document.getElementById('itemsView');
const historyView = document.getElementById('historyView');
 
 
/* -------------------------------------------------------------------------
   สลับมุมมอง (แค่ 2 อันในหน้าเดียวกัน ไม่ใช่การเปลี่ยนไฟล์ html)
------------------------------------------------------------------------- */
viewTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    viewTabs.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
 
    const view = tab.dataset.view;
    itemsView.style.display = (view === 'items') ? 'block' : 'none';
    historyView.style.display = (view === 'history') ? 'block' : 'none';
  });
});

const allCategories = new Set();
Object.values(ITEM_LIBRARY).forEach(function (item) {
  allCategories.add(item.category);
});
allCategories.forEach(function (cat) {
  const o = document.createElement('option');
  o.value = cat; o.textContent = cat;
  categoryFilter.appendChild(o);
});

categoryFilter.addEventListener('change', renderItemsView);
 
 
/* -------------------------------------------------------------------------
   วาดมุมมอง "ไอเทมที่เก็บได้"
------------------------------------------------------------------------- */
async function renderItemsView() {
  const log = (await loadExploreLog()).reverse();
 
  // ---- ส่วนที่ 1: ของทั่วไป แยกตามบ้าน ----
  const houseSection = document.getElementById('itemsByHouse');
  houseSection.innerHTML = '';
 
  HOUSE_NAMES.forEach(function (houseName) {
    // เอาเฉพาะ log ที่เป็นของทั่วไป (ไม่ rare) และเป็นของบ้านนี้
    const entriesForHouse = log.filter(function (e) {
  const matchCategory = !categoryFilter.value || ITEM_LIBRARY[e.itemKey].category === categoryFilter.value;
  return e.house === houseName && !e.rare && matchCategory;
});
 
    // นับจำนวนแต่ละชนิดไอเทมในบ้านนี้ (key -> count)
    const counts = {};
    entriesForHouse.forEach(function (e) {
      counts[e.itemKey] = (counts[e.itemKey] || 0) + 1;
    });
 
    const houseBlock = document.createElement('div');
    houseBlock.className = 'house-items-block';
 
    let cardsHtml = '';
    Object.keys(counts).forEach(function (key) {
      const item = ITEM_LIBRARY[key];
      cardsHtml += `
        <div class="item-card">
          <img src="${item.image}" alt="${item.name}">
          <div class="item-card-name">${item.name}</div>
          <div class="item-card-category">${item.category}</div>
          <div class="item-card-count">เก็บได้ ${counts[key]} ชิ้น</div>
        </div>
      `;
    });
 
    if (cardsHtml === '') {
      cardsHtml = '<div class="empty-note">ยังไม่มีของที่เก็บได้ในบ้านนี้</div>';
    }
 
    houseBlock.innerHTML = `
      <h3>${houseName}</h3>
      <div class="item-card-grid">${cardsHtml}</div>
    `;
    houseSection.appendChild(houseBlock);
  });
 
  // ---- ส่วนที่ 2: ของหายาก ที่ "มีคนเก็บได้แล้วเท่านั้น" (ไม่ผูกกับบ้านไหน) ----
  const rareSection = document.getElementById('rareItemsSection');
  rareSection.innerHTML = '';
 
  // หาว่าของหายากชนิดไหนบ้างที่เคยถูกเก็บ (เอาแค่ครั้งแรกที่เจอ เป็นคนคนแรกที่ครอบครอง)
  const rareEntries = log.filter(function (e) {
  const matchCategory = !categoryFilter.value || ITEM_LIBRARY[e.itemKey].category === categoryFilter.value;
  return e.rare && matchCategory;
});
 
  const claimedRareKeys = [];
  rareEntries.forEach(function (e) {
    if (claimedRareKeys.indexOf(e.itemKey) === -1) claimedRareKeys.push(e.itemKey);
  });
 
  if (claimedRareKeys.length === 0) {
    rareSection.innerHTML = '<div class="empty-note">ยังไม่มีของหายากชิ้นไหนถูกเก็บเลย</div>';
    return;
  }
 
  let rareHtml = '';
  claimedRareKeys.forEach(function (key) {
    const item = ITEM_LIBRARY[key];
    // หาเจ้าของ (คนแรกที่เก็บได้ ดูจากเวลาน้อยที่สุด)
    const owner = rareEntries
      .filter(function (e) { return e.itemKey === key; })
      .sort(function (a, b) { return a.ts - b.ts; })[0];
 
    rareHtml += `
      <div class="item-card rare">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-card-name">${item.name}</div>
        <div class="item-card-category">${item.category}</div>
        <div class="item-card-owner">เก็บโดย ${owner.character} (${owner.house})</div>
      </div>
    `;
  });
 
  rareSection.innerHTML = rareHtml;
}
 
 
/* -------------------------------------------------------------------------
   วาดมุมมอง "ประวัติการสำรวจ"
------------------------------------------------------------------------- */
async function renderHistoryView() {
  const log = await loadExploreLog();
  const wrap = document.getElementById('historyTableWrap');
 
  if (log.length === 0) {
    wrap.innerHTML = '<div class="empty-note">ยังไม่มีประวัติการสำรวจ</div>';
    return;
  }
 
  wrap.innerHTML = `
    <table>
      <thead><tr><th>ตัวละคร</th><th>บ้าน</th><th>พื้นที่</th><th>สิ่งที่พบ</th></tr></thead>
      <tbody>
        ${log.map(function (e) {
          return `
            <tr>
              <td>${e.character}</td>
              <td>${e.house}</td>
              <td>${e.areaName}</td>
              <td>${e.itemName}${e.rare ? '<span class="badge-rare">หายาก</span>' : ''}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}
 
 
// วาดทั้ง 2 มุมมองไว้ล่วงหน้าตอนโหลดหน้า (มุมมองที่ไม่ active จะถูกซ่อนด้วย CSS display:none อยู่แล้ว)
Promise.all([renderItemsView(), renderHistoryView()]);
