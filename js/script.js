const menuBtn = document.getElementById('menuBtn');
const drawer  = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
 
// กดปุ่มเมนู -> เปิด drawer + โชว์ฉากหลังมืด
menuBtn.addEventListener('click', function () {
  drawer.classList.add('open');
  overlay.classList.add('open');
});
 
// คลิกฉากหลังมืด -> ปิดเมนู
overlay.addEventListener('click', function () {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
});


const CHARACTERS = [
  {
    name: "ตัวละคร 1",
    letter: "1",
    accent: "#f4c744",
    tags: ["แท็ก", "แท็ก"],
    meta: [
      { label: "บทบาท", value: "—" },
      { label: "สังกัด", value: "—" },
    ],
    quote: "“ใส่คำพูดเด่นของตัวละครตรงนี้”",
    desc: ["ยังไม่มีข้อมูลตัวละคร — รอใส่เนื้อหาทีหลัง"],
  },
  {
    name: "ตัวละคร 2",
    letter: "2",
    accent: "#7fa7c9",
    tags: ["แท็ก", "แท็ก"],
    meta: [
      { label: "บทบาท", value: "—" },
      { label: "สังกัด", value: "—" },
    ],
    quote: "“ใส่คำพูดเด่นของตัวละครตรงนี้”",
    desc: ["ยังไม่มีข้อมูลตัวละคร — รอใส่เนื้อหาทีหลัง"],
  },
  {
    name: "ตัวละคร 3",
    letter: "3",
    accent: "#c98f7f",
    tags: ["แท็ก", "แท็ก"],
    meta: [
      { label: "บทบาท", value: "—" },
      { label: "สังกัด", value: "—" },
    ],
    quote: "“ใส่คำพูดเด่นของตัวละครตรงนี้”",
    desc: ["ยังไม่มีข้อมูลตัวละคร — รอใส่เนื้อหาทีหลัง"],
  },
];
 
const rail = document.getElementById("showcaseRail");
const stage = document.getElementById("showcaseStage");
const monogram = document.getElementById("stageMonogram");
const panelQuote = document.getElementById("panelQuote");
const panelTags = document.getElementById("panelTags");
const panelName = document.getElementById("panelName");
const panelMeta = document.getElementById("panelMeta");
const panelDesc = document.getElementById("panelDesc");
 
// สร้างปุ่มวงกลมด้านซ้ายตามจำนวนตัวละคร
CHARACTERS.forEach((char, index) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "rail__avatar" + (index === 0 ? " is-active" : "");
  btn.textContent = char.letter;
  btn.setAttribute("aria-label", char.name);
  btn.addEventListener("click", () => selectCharacter(index));
  rail.appendChild(btn);
});
 
function selectCharacter(index) {
  const char = CHARACTERS[index];
 
  // อัปเดตปุ่มที่ active
  [...rail.children].forEach((btn, i) => {
    btn.classList.toggle("is-active", i === index);
  });
 
  // อัปเดตพื้นหลัง/ภาพประกอบ
  stage.style.setProperty("--stage-accent", char.accent);
  monogram.textContent = char.letter;
 
  // อัปเดตการ์ดข้อมูล
  panelQuote.textContent = char.quote;
  panelName.textContent = char.name;
 
  panelTags.innerHTML = "";
  char.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    panelTags.appendChild(span);
  });
 
  panelMeta.innerHTML = "";
  char.meta.forEach((m) => {
    const span = document.createElement("span");
    span.innerHTML = `<strong>${m.label}</strong> ${m.value}`;
    panelMeta.appendChild(span);
  });
 
  panelDesc.innerHTML = "";
  char.desc.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    panelDesc.appendChild(p);
  });
}
 
// เริ่มต้นที่ตัวละครแรก
selectCharacter(0);
