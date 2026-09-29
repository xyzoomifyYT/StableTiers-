const MC='https://mcasset.cloud/1.21.11/assets/minecraft/textures/';
const modes=[
 {id:'ltms',label:'C',full:'LTMs',icon:MC+'block/grass_block_top.png'},
 {id:'pot',label:'Pot',full:'Pot',icon:MC+'item/potion.png'},
 {id:'nethop',label:'NethOP',full:'NethOP',icon:MC+'item/netherite_helmet.png'},
 {id:'smp',label:'SMP',full:'SMP',icon:MC+'item/ender_pearl.png'},
 {id:'sword',label:'Sword',full:'Sword',icon:MC+'item/diamond_sword.png'},
 {id:'axe',label:'Axe',full:'Axe',icon:MC+'item/diamond_axe.png'},
 {id:'mace',label:'Mace',full:'Mace',icon:MC+'item/mace.png'}
];
const tiers=['HT1','HT2','HT3','HT4','HT5','LT1','LT2','LT3','LT4','LT5'];
const defaultPlayers=[
 {name:'Marlowww',points:450,region:'DE',skin:'Marlowww',rank:'Combat Grandmaster',tiers:{ltms:'HT12',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT1'}},
 {name:'xLuninx',points:430,region:'DE',skin:'xLuninx',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'zFrosty',points:415,region:'DE',skin:'zFrosty',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'Veltz',points:400,region:'DE',skin:'Veltz',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'Trixzy',points:385,region:'DE',skin:'Trixzy',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'Shxne',points:370,region:'DE',skin:'Shxne',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'iTzRex',points:355,region:'DE',skin:'iTzRex',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'Nexu',points:340,region:'DE',skin:'Nexu',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'Luna',points:325,region:'DE',skin:'Luna',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}},
 {name:'S7ven',points:310,region:'DE',skin:'S7ven',rank:'Combat Grandmaster',tiers:{ltms:'HT11',pot:'HT11',nethop:'HT11',smp:'HT11',sword:'HT11',axe:'HT11',mace:'HT2'}}
];
let players=JSON.parse(localStorage.getItem('stabletiers.players')||'null')||defaultPlayers;
let selectedMode='ltms', selectedPlayer=0, region='ALL', sort='points';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function skin(name){return `<img class="skin" src="https://mc-heads.net/avatar/${encodeURIComponent(name)}/128" alt="${esc(name)} Minecraft Skin" loading="lazy">`}
function mode(id){return modes.find(m=>m.id===id)||modes[0]}
function icon(id,cls='itemIcon'){const m=mode(id);return `<img class="${cls}" src="${m.icon}" alt="${esc(m.full)}" loading="lazy">`}
function tierClass(t){if(!t||t==='Unranked')return 'unranked'; const m=t.match(/^(HT|LT)(\d+)$/); if(!m)return 'unranked'; return `${m[1].toLowerCase()}${m[2]}`}
function tierScore(t){if(!t||t==='Unranked')return 999;const m=t.match(/^(HT|LT)(\d+)$/);return m?(m[1]==='HT'?0:20)+Number(m[2]):999}
function overall(p){return Object.values(p.tiers).sort((a,b)=>tierScore(a)-tierScore(b))[0]||'Unranked'}
function flag(r){return r==='DE'?'🇩🇪':r==='NA'?'🇺🇸':r==='GB'?'🇬🇧':'🌐'}
function renderTopModes(){
 $('#topModes').innerHTML=modes.map(m=>`<button class="modeTab ${m.id===selectedMode?'active':''}" data-mode="${m.id}">${icon(m.id,'modeIcon')}<span>${esc(m.label)}</span></button>`).join('');
 document.querySelectorAll('.modeTab').forEach(b=>b.onclick=()=>{selectedMode=b.dataset.mode;render()});
}
function filtered(){
 const q=($('#search')?.value||'').trim().toLowerCase();
 let a=players.filter(p=>(region==='ALL'||p.region===region)&&p.name.toLowerCase().includes(q));
 if(sort==='points')a.sort((x,y)=>y.points-x.points); else a.sort((x,y)=>tierScore(x.tiers[selectedMode])-tierScore(y.tiers[selectedMode])||y.points-x.points);
 return a;
}
function renderPlayers(){
 const a=filtered();
 $('#players').innerHTML=a.length?a.map((p,i)=>{const original=players.indexOf(p);return `<article class="playerRow ${i<3?'podium p'+(i+1):''}" data-index="${original}" tabindex="0">
   <div class="place"><b>${i+1}.</b>${skin(p.skin)}</div>
   <div class="playerInfo"><div class="playerName">${esc(p.name)} <span class="tinyBadge">✧</span></div><div class="playerRank"><span class="star">✹</span>${esc(p.rank)} (${p.points} points)</div></div>
   <div class="playerRegion"><span>${flag(p.region)}</span> ${esc(p.region)}</div>
 </article>`}).join(''):`<div class="empty">Kein Spieler gefunden.</div>`;
 document.querySelectorAll('.playerRow').forEach(el=>{el.onclick=()=>openProfile(Number(el.dataset.index));el.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')openProfile(Number(el.dataset.index))}});
}
function renderStats(){
 const p=players[selectedPlayer]||players[0];
 $('#statsCard').innerHTML=`<div class="stat"><span>🏆</span><small>HT-Tier</small><b>${esc(overall(p))}</b></div><div class="stat"><span>◉</span><small>Test-Anzahl</small><b>${Object.keys(p.tiers).length*7}</b></div><div class="stat"><span>★</span><small>Punkte</small><b>${p.points}</b></div><div class="stat"><span>♟</span><small>Rang</small><b>#${players.indexOf(p)+1}</b></div>`;
}
function renderSide(){
 const p=players[selectedPlayer]||players[0];
 $('#sideTiers').innerHTML=modes.map(m=>`<button class="sideTier ${selectedMode===m.id?'selected':''}" data-mode="${m.id}">${icon(m.id)}<span><b>${esc(m.label)}</b><small class="${tierClass(p.tiers[m.id])}">${esc(p.tiers[m.id]||'Unranked')}</small></span><i>›</i></button>`).join('');
 document.querySelectorAll('.sideTier').forEach(b=>b.onclick=()=>{selectedMode=b.dataset.mode;render()});
}
function render(){renderTopModes();renderPlayers();renderStats();renderSide();updateProfileButton();}
function openProfile(index){selectedPlayer=index;renderStats();renderSide();const p=players[index]; if(!p)return;const entries=modes.map(m=>[m,p.tiers[m.id]||'Unranked']);$('#profileContent').innerHTML=`
 <div class="profileHero"><div class="profileSkin">${skin(p.skin)}</div><div><div class="eyebrow">PLAYER PROFILE</div><h1 id="profileName">${esc(p.name)}</h1><p>${esc(p.rank)} · ${p.points} points</p></div><div class="online"><span></span> Online</div></div>
 <div class="profileStats"><div><span>🏆</span><small>HT-Tier</small><b>${esc(overall(p))}</b></div><div><span>◉</span><small>Test-Anzahl</small><b>${entries.length*7}</b></div><div><span>★</span><small>Punkte</small><b>${p.points}</b></div><div><span>♟</span><small>Rang</small><b>#${players.indexOf(p)+1}</b></div></div>
 <div class="sectionTitle">TIER-ÜBERSICHT</div><div class="profileTiers">${entries.map(([m,t])=>`<button class="profileTier" data-mode="${m.id}">${icon(m.id)}<span><b>${esc(m.label)}</b><strong class="${tierClass(t)}">${esc(t)}</strong></span><i>›</i></button>`).join('')}</div>
 <button class="bigProfileBtn" id="profileAdmin">♟ &nbsp; Tier für ${esc(p.name)} verwalten</button>`;
 document.querySelectorAll('.profileTier').forEach(b=>b.onclick=()=>{selectedMode=b.dataset.mode;closeProfile();render();});
 $('#profileAdmin').onclick=()=>{closeProfile();openAdmin(index)};
 showModal('#profileModal');
}
function updateProfileButton(){const p=players[selectedPlayer]||players[0];$('#sideProfileBtn').textContent=`♟  Profil von ${p.name} ansehen`;$('#sideProfileBtn').onclick=()=>openProfile(selectedPlayer)}
function showModal(sel){$(sel).classList.add('open');$(sel).setAttribute('aria-hidden','false');document.body.classList.add('locked')}
function closeModal(sel){$(sel).classList.remove('open');$(sel).setAttribute('aria-hidden','true');document.body.classList.remove('locked')}
function closeProfile(){closeModal('#profileModal')}
function openAdmin(index=selectedPlayer){const p=players[index]||players[0];$('#adminPlayer').innerHTML=players.map((x,i)=>`<option value="${i}" ${i===index?'selected':''}>${esc(x.name)}</option>`).join('');$('#adminMode').innerHTML=modes.map(m=>`<option value="${m.id}">${esc(m.full)}</option>`).join('');$('#adminTier').innerHTML=tiers.map(t=>`<option>${t}</option>`).join('');const current=p.tiers[selectedMode];if(current&&tiers.includes(current))$('#adminTier').value=current;$('#adminMode').value=selectedMode;showModal('#adminModal')}
function saveAdmin(remove=false){const i=Number($('#adminPlayer').value),m=$('#adminMode').value,t=$('#adminTier').value;if(!players[i])return;if(remove)delete players[i].tiers[m];else players[i].tiers[m]=t;localStorage.setItem('stabletiers.players',JSON.stringify(players));selectedPlayer=i;selectedMode=m;closeModal('#adminModal');render();toast(remove?'Tier entfernt':'Tier gespeichert')}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
$('#search').addEventListener('input',renderPlayers);
$('#regionBtn').onclick=()=>{const r=prompt('Region: ALL, DE, NA oder GB',region);if(r&&['ALL','DE','NA','GB'].includes(r.toUpperCase())){region=r.toUpperCase();render()}};
$('#sortBtn').onclick=()=>{sort=sort==='points'?'tier':'points';toast(sort==='points'?'Sortierung: Punkte':'Sortierung: Tier');renderPlayers()};
$('#adminBtn').onclick=()=>openAdmin(selectedPlayer);$('#saveTier').onclick=()=>saveAdmin(false);$('#removeTier').onclick=()=>saveAdmin(true);
document.querySelectorAll('[data-close]').forEach(x=>x.onclick=closeProfile);document.querySelectorAll('[data-close-admin]').forEach(x=>x.onclick=()=>closeModal('#adminModal'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeProfile();closeModal('#adminModal')}});
$('#serverPill').onclick=()=>toast('Stabletiers Server: play.stabletiers.net');
render();
