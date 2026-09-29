const data=[
{name:"Marlowww",points:450,region:"NA",skin:"Marlowww",tiers:[["crystal","HT1"],["pearl","HT1"],["mace","HT1"],["armor","HT1"],["sword","HT1"],["pot","HT1"]]},
{name:"ItzReal",points:410,region:"NA",skin:"ItzReal",tiers:[["sword","HT1"],["crystal","HT1"],["pearl","HT1"],["mace","HT1"],["pot","HT1"],["armor","LT1"]]},
{name:"Romeo",points:390,region:"EU",skin:"Romeo",tiers:[["sword","HT2"],["crystal","HT2"],["mace","HT3"],["pearl","LT2"],["pot","HT3"],["armor","LT2"]]}
];
const labels={crystal:'Crystal',pearl:'Pearl',mace:'Mace',armor:'Armor',sword:'Sword',pot:'Pot'};
function icon(mode){return `<img src="assets/icons/${mode}.png" alt="${labels[mode]}" class="tierIcon">`}
function skin(name){return `<img src="https://mc-heads.net/avatar/${encodeURIComponent(name)}/128" alt="${name} Minecraft Skin" class="skinHead">`}
function render(){let q=(document.getElementById('search').value||'').toLowerCase();let arr=data.filter(p=>p.name.toLowerCase().includes(q));document.getElementById('players').innerHTML=arr.map((p,i)=>`<article class="player"><div class="playerTop"><div class="place"><b>${i+1}.</b>${skin(p.skin)}</div><div><div class="name">${p.name}</div><div class="region">🏅 Combat Grandmaster (${p.points} points)</div></div><div class="rankNA">${p.region}</div></div><div class="tiersTitle">TIERS</div><div class="tiers">${p.tiers.map(t=>`<div class="tierItem"><div class="icon">${icon(t[0])}</div><span class="tier ${t[1].startsWith('LT')?'lt':''}">${t[1]}</span></div>`).join('')}</div></article>`).join('')||'<div class="player"><h2>Kein Spieler gefunden</h2></div>'}
function filterPlayers(){render()}
function setCategory(c){document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));event.currentTarget.classList.add('active')}
render();
