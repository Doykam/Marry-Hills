
const DICE_LOG_KEY = "wtm_dice_log_v1";
 
const rollerNameInput = document.getElementById('rollerName');
const rollBtn = document.getElementById('rollBtn');
const warnBox = document.getElementById('warnBox');
const hexNumber = document.getElementById('hexNumber');
const resultBadgeBox = document.getElementById('resultBadgeBox');
const historyWrap = document.getElementById('historyTableWrap');
 
 
/* -------------------------------------------------------------------------
   ที่เก็บ/อ่าน log (ใช้แค่หน้านี้หน้าเดียว เลยเขียนรวมไว้ในไฟล์เดียวเลย)
------------------------------------------------------------------------- */
function loadDiceLog() {
  try {
    return JSON.parse(localStorage.getItem(DICE_LOG_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveDiceLog(log) {
  localStorage.setItem(DICE_LOG_KEY, JSON.stringify(log));
}
 
 
/* -------------------------------------------------------------------------
   ปุ่ม ROLL
------------------------------------------------------------------------- */
rollBtn.addEventListener('click', function () {
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
 
  const entry = { character: name, result: result, ts: Date.now() };
 
  const log = loadDiceLog();
  log.unshift(entry);
  saveDiceLog(log);
 
  renderHistory();
});
 
 
/* -------------------------------------------------------------------------
   วาดตารางประวัติทั้งหมด
------------------------------------------------------------------------- */
function renderHistory() {
  const log = loadDiceLog();
 
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