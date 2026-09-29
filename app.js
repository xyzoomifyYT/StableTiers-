const ICONS={
  crystal:'assets/icons/crystal.png',
  mace:'assets/icons/mace.png',
  pearl:'assets/icons/pearl.png',
  pot:'assets/icons/pot.png',
  armor:'assets/icons/armor.png',
  sword:'assets/icons/sword.png',
  axe:'assets/icons/sword.png',
  uhc:'assets/icons/heart.png'
};
const modes=[
 {id:'uhc',label:'UHC',icon:ICONS.uhc},
 {id:'pot',label:'Pot',icon:ICONS.pot},
 {id:'nethop',label:'NethOP',icon:ICONS.armor},
 {id:'smp',label:'SMP',icon:ICONS.pearl},
 {id:'sword',label:'Sword',icon:ICONS.sword},
 {id:'axe',label:'Axe',icon:ICONS.axe},
 {id:'mace',label:'Mace',icon:ICONS.mace},
 {id:'crystal',label:'Crystal',icon:ICONS.crystal}
];
const defaultPlayers=[
 {name:'Marlowww',region:'NA',rank:'Combat Grandmaster',tiers:{uhc:'LT1',pot:'HT1',nethop:'HT1',smp:'HT1',sword:'HT1',axe:'LT1',mace:'HT1',crystal:'HT1'}},
 {name:'ItzReal',region:'NA',rank:'Combat Grandmaster',tiers:{uhc:'LT2',pot:'HT1',nethop:'HT1',smp:'HT1',sword:'HT3',axe:'LT2',mace:'LT2',crystal:'HT1'}},
 {name:'Ferfeken',region:'EU',rank:'Combat Master',tiers:{uhc:'LT2',pot:'HT2',nethop:'HT2',smp:'HT1',sword:'HT2',axe:'LT2',mace:'HT2',crystal:'HT2'}},
 {name:'xLuninx',region:'EU',rank:'Combat Master',tiers:{uhc:'LT2',pot:'HT2',nethop:'HT2',smp:'HT2',sword:'HT2',axe:'LT2',mace:'HT2',crystal:'HT2'}},
 {name:'zFrosty',region:'EU',rank:'Combat Master',tiers:{uhc:'LT3',pot:'HT2',nethop:'HT2',smp:'HT2',sword:'HT2',axe:'LT3',mace:'HT2',crystal:'HT2'}},
 {name:'Veltz',region:'NA',rank:'Combat Master',tiers:{uhc:'LT3',pot:'HT3',nethop:'HT2',smp:'HT2',sword:'HT2',axe:'LT3',mace:'HT3',crystal:'HT2'}}
];
let players=load('stabletiers.players',defaultPlayers);
let customRanks=load('stabletiers.ranks',{});
let selectedMode='sword', search='';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
function save(key,value){localStorage.setItem(key,JSON.stringify(value))}
function skin(name){return `https://mc-heads.net/avatar/${encodeURIComponent(name)}/128`}
function mode(id){return modes.find(x=>x.id===id)||modes[0]}
function tierClass(t){const m=String(t||'').match(/^(HT|LT)(\d)$/);return m?m[1].toLowerCase()+m[2]:'unranked'}
function flag(region){return region==='EU'?'🇪🇺':region==='NA'?'🇺🇸':region==='AS'?'🇯🇵':'🌐'}
function icon(m){return `<img src="${m.icon}" alt="${esc(m.label)}" loading="lazy">`}
function playerRank(p){return customRanks[p.name]||p.siteRank||'User'}
function renderModes(){
 $('#modeBar').innerHTML=modes.map(m=>`<button class="modeTab ${m.id===selectedMode?'active':''}" data-mode="${m.id}">${icon(m)}<span>${esc(m.label)}</span></button>`).join('');
 document.querySelectorAll('.modeTab').forEach(b=>b.onclick=()=>{selectedMode=b.dataset.mode;renderPlayers();renderModes()});
}
function filtered(){return players.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()))}
function renderPlayers(){
 const list=filtered();
 $('#players').innerHTML=list.map((p,i)=>`<article class="playerCard ${i===0?'podium1':i===1?'podium2':i===2?'podium3':''}" data-name="${esc(p.name)}">
  <div class="playerTop">
   <div class="placePanel"><span class="number">${i+1}.</span><img class="skin" src="${skin(p.name)}" alt="${esc(p.name)} skin"></div>
   <div class="playerMain"><div class="playerName">${esc(p.name)}</div><div class="rankLine"><span class="rankIcon">✦</span>${esc(p.rank)}${playerRank(p)!=='User'?` · <b>${esc(playerRank(p))}</b>`:''}</div></div>
   <div class="regionBox"><span class="regionBadge">${flag(p.region)}</span></div>
  </div>
  <div class="tiersWrap"><div class="tiersTitle">TIERS</div><div class="tiers">${modes.map(m=>{const t=p.tiers[m.id]||'Unranked';return `<div class="tierItem"><div class="tierIconCircle">${icon(m)}</div><div class="tierLabel ${tierClass(t)}">${esc(t)}</div></div>`}).join('')}</div></div>
 </article>`).join('')||'<div class="playerCard" style="padding:40px;color:#78869a">Kein Spieler gefunden.</div>';
 document.querySelectorAll('.playerCard').forEach(c=>c.onclick=()=>openProfile(c.dataset.name));
}
function openProfile(name){
 const p=players.find(x=>x.name===name);if(!p)return;
 $('#profileContent').innerHTML=`<div class="profileHero"><img class="skin" src="${skin(p.name)}" alt="${esc(p.name)}"><div><div class="eyebrow">PLAYER PROFILE</div><h1>${esc(p.name)}</h1><p>${esc(p.rank)} · ${flag(p.region)} ${esc(p.region)} · ${esc(playerRank(p))}</p></div><div class="online">● Listed</div></div>
 <div class="profileGrid"><div class="profileStat"><small>Best Tier</small><b>${esc(bestTier(p))}</b></div><div class="profileStat"><small>Modes</small><b>${modes.length}</b></div><div class="profileStat"><small>Website Rang</small><b>${esc(playerRank(p))}</b></div><div class="profileStat"><small>Region</small><b>${flag(p.region)}</b></div></div>
 <h3>Tier-Übersicht</h3><div class="profileTiers">${modes.map(m=>`<button class="profileTier" data-mode="${m.id}">${icon(m)}<span><b>${esc(m.label)}</b><strong class="${tierClass(p.tiers[m.id])}">${esc(p.tiers[m.id]||'Unranked')}</strong></span></button>`).join('')}</div>`;
 document.querySelectorAll('.profileTier').forEach(b=>b.onclick=()=>{selectedMode=b.dataset.mode;closeModal('#profileModal');renderModes();renderPlayers()});
 openModal('#profileModal');
}
function bestTier(p){return Object.values(p.tiers).sort(tierCompare)[0]||'Unranked'}
function tierCompare(a,b){return tierValue(a)-tierValue(b)}
function tierValue(t){const m=String(t||'').match(/^(HT|LT)(\d)$/);if(!m)return 99;return (m[1]==='HT'?0:10)+Number(m[2])}
function openModal(sel){$(sel).classList.add('open');$(sel).setAttribute('aria-hidden','false');document.body.classList.add('locked')}
function closeModal(sel){$(sel).classList.remove('open');$(sel).setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('locked')}
function renderAdmin(){
 $('#playerNames').innerHTML=players.map(p=>`<option value="${esc(p.name)}"></option>`).join('');
 $('#rankList').innerHTML=Object.entries(customRanks).length?Object.entries(customRanks).map(([name,rank])=>`<div class="rankRow"><span>${esc(name)}</span><span class="rankBadge">${esc(rank)}</span></div>`).join(''):'<div class="muted">Noch keine Website-Ränge vergeben.</div>';
}
function openAdmin(){renderAdmin();openModal('#adminModal')}
function saveRank(){const name=$('#rankPlayer').value.trim();const rank=$('#rankSelect').value;if(!name){toast('Bitte einen Spielernamen eingeben.');return}customRanks[name]=rank;save('stabletiers.ranks',customRanks);renderAdmin();renderPlayers();toast(`${name}: ${rank} vergeben`)}
function removeRank(){const name=$('#rankPlayer').value.trim();if(!name||!customRanks[name]){toast('Kein eigener Rang gefunden.');return}delete customRanks[name];save('stabletiers.ranks',customRanks);renderAdmin();renderPlayers();toast(`Rang von ${name} entfernt`)}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function openDrawer(){ $('#drawer').classList.add('open');$('#drawerBackdrop').classList.add('open');$('#drawer').setAttribute('aria-hidden','false') }
function closeDrawer(){ $('#drawer').classList.remove('open');$('#drawerBackdrop').classList.remove('open');$('#drawer').setAttribute('aria-hidden','true') }
$('#menuBtn').onclick=openDrawer;$('#drawerClose').onclick=closeDrawer;$('#drawerBackdrop').onclick=closeDrawer;$('#openAdminFromMenu').onclick=()=>{closeDrawer();openAdmin()};
document.querySelectorAll('[data-close-profile]').forEach(x=>x.onclick=()=>closeModal('#profileModal'));document.querySelectorAll('[data-close-admin]').forEach(x=>x.onclick=()=>closeModal('#adminModal'));
$('#globalSearch').addEventListener('input',e=>{search=e.target.value;renderPlayers()});
$('#saveRank').onclick=saveRank;$('#removeRank').onclick=removeRank;
$('#copyIp').onclick=()=>{navigator.clipboard?.writeText('mcpvp.club');toast('Server-IP kopiert')};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closeModal('#profileModal');closeModal('#adminModal')}});
renderModes();renderPlayers();
