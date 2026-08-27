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
    name: "โจนาธาน ฟอสเตอร์",
    letter: "1",
    accent: "#7fa7c9",
    image: "",
    meta: [
      { label: "บทบาท", value: "นายอำเภอ" },
      { label: "อายุ", value: "42 ปี" },
    ],
    quote: "“If justice is lost, I will forge it myself.”",
    desc: ["ดำรงหน้าที่ในสถานะนายอำเภอคนปัจจุบันของเทศบาลเมืองแมรี่ฮิลล์ เขาเป็นคนที่อัธยาศัยดีเป็นที่รักของเหล่าพนักงานรัฐและชาวเมือง ถึงแม้จะปฏิบัติหน้าที่ได้ไม่นานนักแต่ผลงานเขาทำให้ชาวเมืองวางใจ  เป็นชายร่างสูงโปร่ง ผมสีน้ำตาเฮเซล นัยน์ตาสีฟ้าคราม มักอยู่ในชุดที่สุภาพสอาดสะอ้านและมีท่าทีที่ดีเสมอ เขาเป็นนายอำเภอที่พึ่งพาได้"],
  },
  {
    name: "ชาล้อต",
    letter: "2",
    accent: "#444444",
    image: "",
    meta: [
      { label: "บทบาท", value: "แม่ชี" },
      { label: "อายุ", value: "ปี" },
    ],
    quote: "“ใส่คำพูดเด่นของตัวละครตรงนี้”",
    desc: ["เธอเป็นแม่ชีที่มาประจำที่นี่ได้ไม่นานนัก 5-6 ปีเธออาศัยและถือศีลที่โบสถ์เก่า ผู้คนจะพบเธอได้ในช่วงของงานทางศาสนาที่โบสถ์ หรือพิธีมิสซาตอนเช้า ในบางครั้งจะพบเธอที่โบสถ์ใหม่บ้าง แต่ไม่บ่อยนัก เธอเป็นคนเงียบเชียบ หน้าตาไร้อารมณ์ และไม่สุงสิงหรือยิ้มแย้มเท่าไหร่"],
  },
  {
    name: "ตัวละคร 3",
    letter: "3",
    accent: "#c98f7f",
    image: "",
    meta: [
      { label: "บทบาท", value: "คนไร้บ้าน" },
      { label: "อายุ", value: "ปี" },
    ],
    quote: "“ใส่คำพูดเด่นของตัวละครตรงนี้”",
    desc: ["เขาเป็นชายวัยกลางคนที่ดูเพี้ยนๆ มีนิสัยเดินเตร็ดเตร่อยู่ตามชายป่า และแถบ uptown  เขาเป็นชายที่ดูอารมณ์ไม่คงที่ และบางทีมักจะวิ่งบ่าเข้าหาผู้คนหรือทำให้เด็กตกใจ  ชาวเมืองไม่ค่อยชอบเขานัก ตำรวจและเทศบาลพยายามหาที่พักให้เขาแต่สุดท้ายเขาก็ลอบออกมามาศัยแบบนี้อยู่ดี"],
  },
];
 
const rail = document.getElementById("showcaseRail");
const stage = document.getElementById("showcaseStage");
const monogram = document.getElementById("stageMonogram");
const stageImage = document.getElementById("stageImage");
const panelQuote = document.getElementById("panelQuote");
const panelName = document.getElementById("panelName");
const panelAltName = document.getElementById("panelAltName");
const panelMeta = document.getElementById("panelMeta");
const panelDesc = document.getElementById("panelDesc");
 
// ถ้ารูปโหลดไม่สำเร็จ (ยังไม่มีไฟล์จริง) ให้ซ่อนรูปทิ้ง จะได้เห็น monogram/พื้นหลังแทน
stageImage.addEventListener("error", () => {
  stageImage.style.display = "none";
});
 
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
 
  // อัปเดตพื้นหลัง/ภาพประกอบ (พื้นหลัง/รูปทรงเดิมยังอยู่เหมือนเดิม แค่เปลี่ยนสีเน้น + รูป/monogram ด้านบน)
  stage.style.setProperty("--stage-accent", char.accent);
  monogram.textContent = char.letter;
 
  if (char.image) {
    stageImage.style.display = "block";
    stageImage.src = char.image;
    stageImage.alt = char.name;
  } else {
    stageImage.style.display = "none";
    stageImage.removeAttribute("src");
  }
 
  // อัปเดตการ์ดข้อมูล
  panelQuote.textContent = char.quote;
  panelName.textContent = char.name;
  panelAltName.textContent = char.altName;
 
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
