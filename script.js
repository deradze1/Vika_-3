"use strict";
const pages=[...document.querySelectorAll('.page')];
const progress=[...document.querySelectorAll('.progress span')];
const backButton=document.querySelector('#backButton');
const nextButton=document.querySelector('#nextButton');
const pageNumber=document.querySelector('#pageNumber');
let currentPage=0;
function showPage(number){
  currentPage=Math.max(0,Math.min(pages.length-1,number));
  pages.forEach((page,index)=>{page.hidden=index!==currentPage;page.classList.toggle('is-active',index===currentPage)});
  progress.forEach((dot,index)=>dot.classList.toggle('active',index===currentPage));
  backButton.disabled=currentPage===0;
  nextButton.disabled=currentPage===pages.length-1;
  pageNumber.textContent=`${currentPage+1} из ${pages.length}`;
  window.scrollTo({top:0,behavior:'instant'});
  if(currentPage===4)throwConfetti(28);
}
document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>showPage(currentPage+1)));
backButton.addEventListener('click',()=>showPage(currentPage-1));
nextButton.addEventListener('click',()=>showPage(currentPage+1));
document.querySelector('#restart').addEventListener('click',()=>showPage(0));
const music=document.querySelector('#music');
music.volume = 0.3;
const musicToggle=document.querySelector('#musicToggle');
const musicLabel=document.querySelector('#musicLabel');
function updateMusicUI(){let isPlaying=!music.paused;musicToggle.setAttribute('aria-pressed',String(isPlaying));musicToggle.setAttribute('aria-label',isPlaying?'Выключить музыку':'Включить музыку');musicLabel.textContent=isPlaying?'Выключить музыку':'Включить музыку'}
musicToggle.addEventListener('click',async()=>{if(!music.paused){music.pause();return}try{await music.play()}catch(err){musicLabel.textContent='Добавь assets/music.mp3';musicToggle.title='Музыкальный файл пока не добавлен'}});
music.addEventListener('play',updateMusicUI);music.addEventListener('pause',updateMusicUI);music.addEventListener('error',()=>{musicLabel.textContent='Нужен music.mp3'});
// Your own photos: place files memory-1.jpg, memory-2.jpg, memory-3.jpg into assets/.
const memories = [
  {
    photo: 'assets/valo.png.png',
    label: 'Наше знакомство 💜',
    caption: 'Всё началось с тренировок по валу. Именно там мы познакомились, и с этого момента началась наша история ♡'
  },
  {
    photo: 'assets/hug.png.png',
    label: 'Каждый день с тобою ',
    caption: 'Каждый день ты делаешь радостнее и приятнее, мой мир с тобой становится только теплее и лучше ♡'
  },
  {
    photo: 'assets/kiss.png.png',
    label: 'Мы с Найтом ',
    caption: 'Вы с Найтом самые милые и очаровательные, с вами сердце наполняется теплом 💜'
  }
];
let memoryIndex=0;
const memoryPhoto=document.querySelector('#memoryPhoto');
const memoryCaption=document.querySelector('#memoryCaption');
const memoryDots=document.querySelector('#memoryDots');
const loadedImages={};
function updateMemory(){
 const memory=memories[memoryIndex];
 memoryPhoto.classList.remove('has-photo');memoryPhoto.style.backgroundImage='';
 memoryPhoto.innerHTML=`<span>📸</span><small>${memory.label}</small>`;
 memoryCaption.textContent=memory.caption;
 memoryDots.replaceChildren(...memories.map((_,idx)=>{const dot=document.createElement('span');dot.className=idx===memoryIndex?'active':'';return dot}));
 if(!loadedImages[memory.photo]){const img=new Image();img.onload=()=>{loadedImages[memory.photo]=true;if(memories[memoryIndex].photo===memory.photo)applyMemoryPhoto(memory.photo)};img.src=memory.photo}
 else applyMemoryPhoto(memory.photo);
}
function applyMemoryPhoto(path){memoryPhoto.classList.add('has-photo');memoryPhoto.style.backgroundImage=`url("${path}")`;memoryPhoto.replaceChildren()}
function shiftMemory(shift){memoryIndex=(memoryIndex+shift+memories.length)%memories.length;updateMemory()}
document.querySelector('#memoryPrev').addEventListener('click',()=>shiftMemory(-1));
document.querySelector('#memoryNext').addEventListener('click',()=>shiftMemory(1));
let swipeX=null;
memoryPhoto.addEventListener('touchstart',e=>{swipeX=e.changedTouches[0].screenX},{passive:true});
memoryPhoto.addEventListener('touchend',e=>{if(swipeX===null)return;const delta=e.changedTouches[0].screenX-swipeX;if(Math.abs(delta)>40)shiftMemory(delta<0?1:-1);swipeX=null},{passive:true});
updateMemory();
let hearts=0;
document.querySelector('#heartButton').addEventListener('click',()=>{if(hearts>=5)return;hearts++;document.querySelector('#heartCount').textContent=`${hearts} / 5 ♡`;if(hearts===5){document.querySelector('#gameResult').textContent='Эй, приветик! С праздником! Я тут хотела устроить для тебя грандиозный фейерверк из своих лучших ракет, но подумала, что стены могут не выдержать такого веселья. Поэтому вместо взрывов — держи от меня кучу ярких эмоций и самого безумного настроения! Ба-бах! 💥💙 💜✨';throwConfetti(25)}});
document.querySelector('#giftButton').addEventListener('click',()=>{const reveal=document.querySelector('#giftReveal');reveal.hidden=!reveal.hidden;document.querySelector('#giftButton').setAttribute('aria-expanded',String(!reveal.hidden));if(!reveal.hidden)throwConfetti(42)});
function throwConfetti(count){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const layer=document.querySelector('#confetti');const symbols=['💜','✨','💗','⭐','🎀','♡'];for(let i=0;i<count;i++){const piece=document.createElement('span');piece.className='confetti-piece';piece.textContent=symbols[Math.floor(Math.random()*symbols.length)];piece.style.left=`${Math.random()*100}%`;piece.style.setProperty('--drift',`${Math.random()*200-100}px`);piece.style.animationDelay=`${Math.random()*1.2}s`;piece.style.animationDuration=`${2.1+Math.random()*2}s`;piece.addEventListener('animationend',()=>piece.remove(),{once:true});layer.append(piece)}}
showPage(0);

let musicStarted = false;

async function startBackgroundMusic() {
  if (musicStarted || !music.paused) return;

  music.volume = 0.25;

  try {
    await music.play();
    musicStarted = true;
    updateMusicUI();
  } catch (error) {
    // Браузер пока не разрешил воспроизведение.
  }
}

// Пытаемся запустить музыку при загрузке.
startBackgroundMusic();

// Если браузер заблокировал автозапуск,
// включаем музыку при первом взаимодействии.
async function startOnInteraction() {
  if (!musicStarted) {
    await startBackgroundMusic();
  }
}

document.addEventListener("pointerdown", startOnInteraction, {
  once: true
});

document.addEventListener("keydown", startOnInteraction, {
  once: true
});
