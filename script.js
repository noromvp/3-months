document.addEventListener('DOMContentLoaded',()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const intro=$('#intro'), open=$('#openLetter'), transition=$('#transition'), letter=$('#letter');
  const musicWidget=$('#musicWidget'), audio=$('#audio'), cover=$('#playerCover'), trackName=$('#trackName'), status=$('#trackStatus'), list=$('#playlistList');
  const colors=['#30277d','#3b318d','#45409e','#4f4bb0','#5956c1','#526dcc','#4d82d5','#438fd0','#5b82d7','#6b70d5','#765fc9','#8158bd','#8b50b0','#7650b8','#6354c4','#5666d2','#4c79df','#527fc8','#5f72b8'];

  const tracks=Array.from({length:19},(_,i)=>({
  n:i+1,
  src:`assets/music/${i+1}.mp3`,
  img:`assets/music covers/${i+1}.jpg`
}));
  let current=0, playing=false, memoriesOpen=false, memory=1;

  function setTrack(i,autoplay=false){current=(i+19)%19;const t=tracks[current];audio.src=t.src;cover.src=t.img;trackName.textContent=`Música #${t.n}`;status.textContent=autoplay?'tocando':'pronta para tocar';$$('.playlist-item').forEach((x,j)=>x.classList.toggle('active',j===current));if(autoplay){audio.play().then(()=>{playing=true;$('#playPause').textContent='❚❚';status.textContent='tocando'}).catch(()=>{playing=false;$('#playPause').textContent='▶';status.textContent='toque para tocar'})}}
  tracks.forEach(t=>{const b=document.createElement('button');b.className='playlist-item';b.innerHTML=`<img src="${t.img}" alt=""><span>Música #${t.n}</span>`;b.addEventListener('click',()=>setTrack(t.n-1,true));list.appendChild(b)});
  setTrack(0);

  open.addEventListener('click',()=>{
    open.disabled=true;intro.style.opacity='0';intro.style.transform='scale(1.12) rotate(2deg)';intro.style.filter='blur(12px)';
    setTimeout(()=>{intro.style.display='none';transition.classList.add('active');},850);
    setTimeout(()=>{transition.classList.add('done');letter.classList.add('active');document.body.style.overflow='auto';letter.scrollTop=0;},3000);
    setTimeout(()=>{
  musicWidget.classList.add('music-widget-open');
},3500);

  });
  transition.addEventListener('click',()=>{});
  $('#musicHandle').addEventListener('click',()=>musicWidget.classList.toggle('music-widget-open'));
  $('#playPause').addEventListener('click',()=>{if(audio.paused){audio.play().then(()=>{playing=true;$('#playPause').textContent='❚❚';status.textContent='tocando'})}else{audio.pause();playing=false;$('#playPause').textContent='▶';status.textContent='pausada'}});
  $('#prevTrack').addEventListener('click',()=>setTrack(current-1,true));$('#nextTrack').addEventListener('click',()=>setTrack(current+1,true));$('#shuffleTrack').addEventListener('click',()=>setTrack(Math.floor(Math.random()*19),true));
  audio.addEventListener('ended',()=>setTrack(current+1,true));audio.addEventListener('timeupdate',()=>{$('#trackProgress').value=audio.duration?(audio.currentTime/audio.duration)*100:0});$('#trackProgress').addEventListener('input',e=>{if(audio.duration)audio.currentTime=(+e.target.value/100)*audio.duration});

  function updateColor(){const max=letter.scrollHeight-letter.clientHeight;const p=max>0?letter.scrollTop/max:0;const idx=Math.min(18,Math.floor(p*19));document.documentElement.style.setProperty('--accent',colors[idx]);document.documentElement.style.setProperty('--accent2',colors[(idx+7)%19]);const ps=$$('.letter-text p');ps.forEach((el,i)=>el.style.color=`color-mix(in srgb, ${colors[(idx+i)%19]} 22%, #f4f4ff)`)}
  letter.addEventListener('scroll',updateColor,{passive:true});

  const memories=$('#memories'), photo=$('#memoryPhoto'), backdrop=$('.memory-backdrop'), counter=$('#memoryCurrent'), end=$('#memoryEnd');
  function showMemory(n){
  memory=n;
  photo.src=`assets/momentos/${n}.png`;
  photo.alt=`Momento #${n}`;
  backdrop.style.backgroundImage=`url("assets/momentos/${n}.png")`;
  counter.textContent=String(n).padStart(2,'0');

  const caption=$('.memory-caption');

  if(n===1){
    caption.classList.remove('hidden');
  }else{
    caption.classList.add('hidden');
  }

  photo.style.animation='none';
  void photo.offsetWidth;
  photo.style.animation='memoryIn .8s cubic-bezier(.2,.8,.2,1)';
  }
  function openMemories(){memories.style.display='grid';memories.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';end.classList.remove('show');showMemory(1);memoriesOpen=true}
  $('#openMemories').addEventListener('click',openMemories);$('#memoryNext').addEventListener('click',()=>{if(memory<19)showMemory(memory+1);else end.classList.add('show')});$('#memoryPrev').addEventListener('click',()=>{if(memory>1){end.classList.remove('show');showMemory(memory-1)}});$('#repeatMemories').addEventListener('click',()=>{end.classList.remove('show');showMemory(1)});$('#closeMemories').addEventListener('click',()=>{memories.style.display='none';memories.setAttribute('aria-hidden','true');document.body.style.overflow='auto';memoriesOpen=false;$('#finalize').classList.add('visible');letter.scrollTo({top:letter.scrollHeight,behavior:'smooth'});});
  $('#finalize').addEventListener('click',()=>{const finale=$('#finale');finale.style.display='grid';requestAnimationFrame(()=>{finale.style.opacity='1';});document.body.style.overflow='hidden';});
  $('#finale').addEventListener('click',()=>{});
  document.addEventListener('keydown',e=>{if(!memoriesOpen)return;if(e.key==='ArrowRight')$('#memoryNext').click();if(e.key==='ArrowLeft')$('#memoryPrev').click();if(e.key==='Escape')$('#closeMemories').click()});
  // Clicking the final action is intentionally the only route to the finale; reload returns to intro.
});
