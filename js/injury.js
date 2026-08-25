const INJURY_LOG_KEY = "wtm_injury_log_v1";
 
const charNameInput = document.getElementById('charName');
const severityBtns = document.querySelectorAll('.severity-btn');
const rollBtn = document.getElementById('rollBtn');
const warnBox = document.getElementById('warnBox');
const resultBox = document.getElementById('resultBox');
const historyWrap = document.getElementById('historyTableWrap');
 
let selectedSeverity = null; // "low" | "medium" | "high"
 
 
/* -------------------------------------------------------------------------
   คลิกปุ่มระดับความเจ็บ -> จำค่าไว้ + สลับ class active
------------------------------------------------------------------------- */
severityBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    selectedSeverity = btn.dataset.severity;
 
    severityBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
  });
});
 
 
/* -------------------------------------------------------------------------
   ที่เก็บ/อ่าน log (เก็บในไฟล์นี้ไฟล์เดียว เพราะใช้แค่หน้านี้หน้าเดียว)
------------------------------------------------------------------------- */
function loadInjuryLog() {
  try {
    return JSON.parse(localStorage.getItem(INJURY_LOG_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveInjuryLog(log) {
  localStorage.setItem(INJURY_LOG_KEY, JSON.stringify(log));
}
 
 
/* -------------------------------------------------------------------------
   ปุ่มสุ่ม
------------------------------------------------------------------------- */
rollBtn.addEventListener('click', function () {
  const name = charNameInput.value.trim();
  warnBox.innerHTML = '';
 
  if (!name) {
    warnBox.innerHTML = '<div class="warn">กรุณากรอกชื่อตัวละครก่อนสุ่ม</div>';
    return;
  }
  if (!selectedSeverity) {
    warnBox.innerHTML = '<div class="warn">กรุณาเลือกระดับความเจ็บก่อนสุ่ม</div>';
    return;
  }
 
  // สุ่มอาการจากคลังของระดับที่เลือก
  const pool = INJURY_POOLS[selectedSeverity];
  const injuryText = pool[Math.floor(Math.random() * pool.length)];
 
  const entry = {
    character: name,
    severity: selectedSeverity,
    severityLabel: SEVERITY_LABELS[selectedSeverity],
    injuryText: injuryText,
    ts: Date.now()
  };
 
  const log = loadInjuryLog();
  log.unshift(entry);
  saveInjuryLog(log);
 
  renderResult(entry);
  renderHistory();
});
 
 
/* -------------------------------------------------------------------------
   โชว์ผลล่าสุด
------------------------------------------------------------------------- */
function renderResult(entry) {
  resultBox.innerHTML = `
    <div class="injury-result severity-${entry.severity}">
      <div class="tag">${entry.severityLabel}</div>
      <div class="injury-text"><span class="char-name">${entry.character}</span> ${entry.injuryText}</div>
    </div>
  `;
}
 
 
/* -------------------------------------------------------------------------
   วาดตารางประวัติทั้งหมด (เรียกทั้งตอนโหลดหน้าครั้งแรก และหลังสุ่มทุกครั้ง)
------------------------------------------------------------------------- */
function renderHistory() {
  const log = loadInjuryLog();
 
  if (log.length === 0) {
    historyWrap.innerHTML = '<div class="empty-note">ยังไม่มีประวัติการบาดเจ็บ</div>';
    return;
  }
 
  historyWrap.innerHTML = `
    <table>
      <thead><tr><th>ตัวละคร</th><th>ระดับ</th><th>อาการ</th></tr></thead>
      <tbody>
        ${log.map(function (e) {
          return `
            <tr>
              <td>${e.character}</td>
              <td><span class="badge-severity severity-${e.severity}">${e.severityLabel}</span></td>
              <td>${e.injuryText}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}
 
// โหลดหน้ามาครั้งแรก ให้แสดงประวัติเก่าที่เคยมีอยู่ (ถ้ามี) ทันที
renderHistory();