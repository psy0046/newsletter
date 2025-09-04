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

/* ==== Hero slider ==== */
(function heroSlider(){
  const root = document.getElementById('hero-slider');
  if(!root) return;

  const track = root.querySelector('.slider__track');
  const slides = Array.from(root.querySelectorAll('.slide'));
  const prevBtn = root.querySelector('.prev');
  const nextBtn = root.querySelector('.next');
  const dotsWrap = root.querySelector('.slider__dots');

  let index = 0;
  const last = slides.length - 1;
  let timer = null;
  const AUTO_MS = 3500;

  // dots
  slides.forEach((_, i)=>{
    const b = document.createElement('button');
    b.setAttribute('role','tab');
    b.setAttribute('aria-label', `${i+1}번 배너`);
    b.addEventListener('click', ()=>go(i));
    dotsWrap.appendChild(b);
  });

  function render(){
    track.style.transform = `translateX(${-100 * index}%)`;
    dotsWrap.querySelectorAll('button').forEach((d,i)=>{
      d.setAttribute('aria-selected', i===index ? 'true':'false');
    });
  }

  function go(i){
    index = (i + slides.length) % slides.length;
    render(); restartAuto();
  }
  function next(){ go(index+1); }
  function prev(){ go(index-1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  // swipe
  let startX = 0, dx = 0, dragging = false;
  const vp = root.querySelector('.slider__viewport');
  vp.addEventListener('pointerdown', e=>{ dragging=true; startX=e.clientX; stopAuto(); });
  window.addEventListener('pointermove', e=>{
    if(!dragging) return;
    dx = e.clientX - startX;
    track.style.transition = 'none';
    track.style.transform = `translateX(calc(${-100*index}% + ${dx}px))`;
  });
  window.addEventListener('pointerup', ()=>{
    if(!dragging) return;
    track.style.transition = '';
    if(Math.abs(dx) > vp.clientWidth*0.2) (dx<0 ? next() : prev());
    else render();
    dragging=false; dx=0; startAuto();
  });

  function startAuto(){ stopAuto(); timer = setInterval(next, AUTO_MS); }
  function stopAuto(){ if(timer){ clearInterval(timer); timer=null; } }
  function restartAuto(){ stopAuto(); startAuto(); }

  render(); startAuto();
})();