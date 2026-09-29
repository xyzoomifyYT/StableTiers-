const modes=[
  {id:'ltms',label:'LTMs',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/iron_sword.png'},
  {id:'vanilla',label:'Vanilla',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/block/grass_block_top.png'},
  {id:'uhc',label:'UHC',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/golden_apple.png'},
  {id:'pot',label:'Pot',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/potion.png'},
  {id:'nethop',label:'NethOP',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/netherite_helmet.png'},
  {id:'smp',label:'SMP',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/ender_pearl.png'},
  {id:'sword',label:'Sword',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/diamond_sword.png'},
  {id:'axe',label:'Axe',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/diamond_axe.png'},
  {id:'mace',label:'Mace',icon:'https://mcasset.cloud/1.21.11/assets/minecraft/textures/item/mace.png'}
];

// Tier values follow the MCTiers-style system: HT1–HT5 and LT1–LT5.
// Player skins are resolved from the real Minecraft username through mc-heads.
const data=[
{name:'Marlowww',points:450,region:'NA',skin:'Marlowww',tiers:{ltms:'HT2',vanilla:'HT1',uhc:'HT1',pot:'HT1',nethop:'HT1',smp:'HT1',sword:'HT1',axe:'HT1',mace:'HT2'}},
{name:'ItzReal',points:410,region:'NA',skin:'ItzReal',tiers:{ltms:'HT3',vanilla:'HT2',uhc:'HT2',pot:'HT1',nethop:'HT2',smp:'HT1',sword:'HT1',axe:'HT2',mace:'HT3'}},
{name:'Romeo',points:390,region:'EU',skin:'Romeo',tiers:{ltms:'LT1',vanilla:'HT3',uhc:'HT3',pot:'HT3',nethop:'HT2',smp:'HT2',sword:'HT2',axe:'HT3',mace:'LT2'}}
];

function tierClass(tier){return tier.startsWith('LT')?'lt':tier.startsWith('HT1')?'ht1':tier.startsWith('HT2')?'ht2':tier.startsWith('HT3')?'ht3':tier.startsWith('HT4')?'ht4':'ht5'}
function skin(name){return `<img src="https://mc-heads.net/avatar/${encodeURIComponent(name)}/128" alt="${name} Minecraft Skin" class="skinHead" loading="lazy">`}
function modeIcon(mode){const m=modes.find(x=>x.id===mode);return m?`<img src="${m.icon}" alt="${m.label}" class="tierIcon">`:''}
function tierEntries(p){return modes.map(m=>[m,p.tiers[m.id]||'Unranked'])}
function render(){
  let q=(document.getElementById('search').value||'').toLowerCase();
  let arr=data.filter(p=>p.name.toLowerCase().includes(q));
  document.getElementById('players').innerHTML=arr.map((p,i)=>{
    const entries=tierEntries(p);
    return `<article class="player" tabindex="0" role="button" onclick="openProfile(${data.indexOf(p)})" onkeydown="if(event.key==='Enter'||event.key===' ')openProfile(${data.indexOf(p)})">
      <div class="playerTop"><div class="place"><b>${i+1}.</b>${skin(p.skin)}</div>
      <div><div class="name">${p.name}</div><div class="region">🏅 Combat Grandmaster (${p.points} points)</div><div class="clickHint">Profil ansehen →</div></div>
      <div class="rankNA">${p.region}</div></div>
      <div class="tiersTitle">TIERS</div>
      <div class="tiers">${entries.map(([m,t])=>`<div class="tierItem"><div class="icon">${modeIcon(m.id)}</div><span class="tier ${tierClass(t)}">${t}</span><small>${m.label}</small></div>`).join('')}</div>
    </article>`
  }).join('')||'<div class="player"><h2>Kein Spieler gefunden</h2></div>'
}
function filterPlayers(){render()}
function setCategory(c){document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));event.currentTarget.classList.add('active')}
render();

function openProfile(index){
  const p=data[index];
  if(!p)return;
  const entries=tierEntries(p);
  const ht=entries.filter(([,t])=>t.startsWith('HT')).length;
  const ranked=entries.filter(([,t])=>t!=='Unranked').length;
  document.getElementById('profileContent').innerHTML=`
    <div class="profileHero"><div class="profileSkin">${skin(p.skin)}</div><div class="profileIdentity"><div class="profileEyebrow">PLAYER PROFILE</div><h1 id="profileName">${p.name}</h1><p>Combat Grandmaster · ${p.points} points</p></div><div class="profileRegion">${p.region}</div></div>
    <div class="profileStats"><div><span>HT Tiers</span><b>${ht}</b></div><div><span>Ranked Modes</span><b>${ranked}</b></div><div><span>Points</span><b>${p.points}</b></div></div>
    <div class="profileSectionTitle">TIER-ÜBERSICHT</div>
    <div class="profileTiers">${entries.map(([m,t])=>`<div class="profileTier"><div class="profileTierIcon">${modeIcon(m.id)}</div><div><b>${m.label}</b><span class="tier ${tierClass(t)}">${t}</span></div></div>`).join('')}</div>
    <div class="profileFooter"><span>Stabletiers profile</span><span>MCTiers-style tiers</span></div>`;
  document.getElementById('profileModal').classList.add('open');document.getElementById('profileModal').setAttribute('aria-hidden','false');document.body.classList.add('modalOpen')
}
function closeProfile(){document.getElementById('profileModal').classList.remove('open');document.getElementById('profileModal').setAttribute('aria-hidden','true');document.body.classList.remove('modalOpen')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProfile()});