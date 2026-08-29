const rollerNameInput = document.getElementById('rollerName');
const rollBtn = document.getElementById('rollBtn');
const warnBox = document.getElementById('warnBox');
const hexNumber = document.getElementById('hexNumber');
const resultBadgeBox = document.getElementById('resultBadgeBox');
const historyWrap = document.getElementById('historyTableWrap');
 
 
/* -------------------------------------------------------------------------
   ที่เก็บ/อ่าน log (ใช้แค่หน้านี้หน้าเดียว เลยเขียนรวมไว้ในไฟล์เดียวเลย)
------------------------------------------------------------------------- */
function mapDiceRow(row) {
  return { character: row["ผู้ทอย"], result: Number(row["ผลที่ได้ (1d20)"]) };
}
async function loadDiceLog() {
  const res = await fetch(APPS_SCRIPT_URL + "?action=dice");
  const rows = await res.json();
  return rows.map(mapDiceRow);
}
async function saveDiceEntry(entry) {
  await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "dice",
      data: { "ผู้ทอย": entry.character, "ผลที่ได้ (1d20)": entry.result }
    })
  });
}
 
 
/* -------------------------------------------------------------------------
   ปุ่ม ROLL
------------------------------------------------------------------------- */
rollBtn.addEventListener('click', async function () {
  const name = rollerNameInput.value.trim();
  warnBox.innerHTML = '';
 
  if (!name) {
    warnBox.innerHTML = '<div class="warn">กรุณากรอกชื่อผู้ทอยก่อนกด ROLL</div>';
    return;
  }
 
  // สุ่มเลข 1 ถึง 20 (1d20)
  const result = Math.floor(Math.random() * 20) + 1;
 
  hexNumber.textContent = result;
 
  resultBadgeBox.innerHTML = '';
  if (result === 20) {
    resultBadgeBox.innerHTML = '<span class="roll-badge crit">CRITICAL SUCCESS</span>';
  } else if (result === 1) {
    resultBadgeBox.innerHTML = '<span class="roll-badge fail">CRITICAL FAIL</span>';
  }
 
    const entry = { character: name, result: result };

  await saveDiceEntry(entry);

  await renderHistory();
});
 
 
/* -------------------------------------------------------------------------
   วาดตารางประวัติทั้งหมด
------------------------------------------------------------------------- */
async function renderHistory() {
  const log = (await loadDiceLog()).reverse();
 
  if (log.length === 0) {
    historyWrap.innerHTML = '<div class="empty-note">ยังไม่มีประวัติการทอย</div>';
    return;
  }
 
  historyWrap.innerHTML = `
    <table>
      <thead><tr><th>ผู้ทอย</th><th>ผลที่ได้ (1d20)</th></tr></thead>
      <tbody>
        ${log.map(function (e) {
          let cls = '';
          if (e.result === 20) cls = 'crit';
          if (e.result === 1) cls = 'fail';
          return `
            <tr>
              <td>${e.character}</td>
              <td class="result-num ${cls}">${e.result}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}
 
// โหลดหน้ามาครั้งแรก ให้แสดงประวัติเก่าที่เคยมีอยู่ (ถ้ามี) ทันที
renderHistory();
