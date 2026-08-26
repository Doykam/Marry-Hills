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