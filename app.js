const state={hp:100,coins:12450,kills:75,auto:true,done:3,timer:12};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.id);toast.id=setTimeout(()=>t.classList.remove('show'),1500)}
function strike(power=3,icon='💥'){
  if(state.hp<=0)return;
  const hero=$$('.fighter')[Math.floor(Math.random()*4)]; hero.classList.add('attack'); setTimeout(()=>hero.classList.remove('attack'),170);
  $('#boss').classList.add('hit');setTimeout(()=>$('#boss').classList.remove('hit'),190);
  state.hp=Math.max(0,state.hp-power);$('#bossBar').style.width=state.hp+'%';$('#bossHpText').textContent=Math.ceil(state.hp)+'%';
  $('#effect').textContent=icon;setTimeout(()=>$('#effect').textContent='',240);
  const d=document.createElement('b');d.className='damage';d.textContent='-'+Math.floor(power*812+Math.random()*500).toLocaleString();$('#battlefield').append(d);setTimeout(()=>d.remove(),1000);
  if(state.hp===0){state.kills++;$('#dailyCount').textContent=state.kills;toast('과소비를 물리쳤어요! +120 코인');state.coins+=120;$('#coins').textContent=state.coins.toLocaleString();setTimeout(()=>{state.hp=100;$('#bossBar').style.width='100%';$('#bossHpText').textContent='100%'},1300)}
}
setInterval(()=>{if(state.auto)strike(2+Math.random()*3)},850);
$('#autoToggle').onclick=e=>{state.auto=!state.auto;e.currentTarget.classList.toggle('on',state.auto);toast(state.auto?'자동 전투 시작!':'자동 전투 정지')};
$$('.hero-card').forEach(b=>b.onclick=()=>strike(12,b.dataset.skill));
$('#reward').onclick=()=>{if(state.timer>0)return toast(`${state.timer}초 뒤에 받을 수 있어요`);state.coins+=500;$('#coins').textContent=state.coins.toLocaleString();state.timer=30;toast('보상 획득! +500 코인 🎉')};
setInterval(()=>{state.timer=Math.max(0,state.timer-1);const m=String(Math.floor(state.timer/60)).padStart(2,'0'),s=String(state.timer%60).padStart(2,'0');$('#rewardTimer').textContent=`${m}:00:${s}`},1000);
$('#coinAdd').onclick=()=>toast('상점은 다음 업데이트에서 만나요!');
$('#dailyQuest').onclick=()=>toast(`몬스터 ${state.kills}/100마리 처치 중`);
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');toast(`${b.textContent.trim()} 퀘스트로 이동`)});
$$('.bottom-nav button').forEach(b=>b.onclick=()=>{if(!b.classList.contains('active'))toast(`${b.textContent.trim()} 화면은 목업 준비 중이에요`)});
