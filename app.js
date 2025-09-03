// 모바일 메뉴 (필요 시 확장)
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn){
  menuBtn.addEventListener('click', ()=> nav.classList.toggle('open'));
}

// 현재 페이지 활성화 표시
(function setActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': '/',
    'photo.html': '/photo.html',
    'new.html': '/new.html',
    'interview.html': '/interview.html',
    'camera.html': '/camera.html'
  };
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if (href === map[path] || (path === '' && href === '/')) a.classList.add('active');
  });
})();

// (옵션) 지연 로딩
document.querySelectorAll('img[data-src]').forEach(img=>{
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        img.src = img.dataset.src;
        io.unobserve(img);
      }
    });
  });
  io.observe(img);
});