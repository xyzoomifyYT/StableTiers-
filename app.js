const seed=[
{name:"Romeo",tier:"HT2",points:1840,mode:"Sword",wins:31,losses:8},
{name:"Kaito",tier:"LT2",points:1715,mode:"Crystal",wins:27,losses:11},
{name:"Nero",tier:"HT3",points:1540,mode:"Mace",wins:22,losses:14},
{name:"LunaPvP",tier:"LT3",points:1490,mode:"Sword",wins:20,losses:12},
{name:"Zyro",tier:"HT4",points:1260,mode:"UHC",wins:16,losses:16},
{name:"Mika",tier:"LT4",points:1180,mode:"Axe",wins:14,losses:18}
];
let players=JSON.parse(localStorage.getItem("mineranks_players")||"null")||seed;
const save=()=>localStorage.setItem("mineranks_players",JSON.stringify(players));
const tierClass=t=>/1/.test(t)?"t1":/2/.test(t)?"t2":/3/.test(t)?"t3":/4/.test(t)?"t4":"t5";
const badge=t=>`<span class="tier ${tierClass(t)}">${t}</span>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function layout(content){document.querySelector("#app").innerHTML=content}
function home(){
 layout(`<section class="hero"><div class="eyebrow">Minecraft PvP Ranking</div><h1>Deine eigene<br>Tierlist.</h1><p>Bewerte Spieler, verwalte Tiers und zeige die besten PvP-Spieler.</p>
 <div class="search"><input id="q" placeholder="Spieler suchen..."><button class="primary" onclick="searchPlayer()">Suchen</button></div>
 <div class="actions"><a class="primary" href="#/players">Spieler ansehen</a><a class="ghost" href="#/leaderboard">Leaderboard</a></div></section>
 <h2 class="sectionTitle">Top-Spieler</h2><div class="grid">${players.slice().sort((a,b)=>b.points-a.points).slice(0,3).map(playerCard).join("")}</div>`);
}
function playerCard(p){return `<a class="card" href="#/player/${encodeURIComponent(p.name)}"><div class="player"><div class="skin">${esc(p.name[0])}</div><div><h3>${esc(p.name)}</h3><div class="muted">${esc(p.mode)}</div></div></div><div style="margin-top:18px">${badge(p.tier)} <b>${p.points} RP</b></div></a>`}
function playersPage(){
 layout(`<h1>Spieler</h1><p class="muted">Alle registrierten Spieler deiner Tierliste.</p><div class="search"><input id="filter" placeholder="Spieler filtern..." oninput="renderPlayers()"></div><div id="plist"></div>`);renderPlayers()
}
function renderPlayers(){let q=(document.querySelector("#filter")?.value||"").toLowerCase();let a=players.filter(p=>p.name.toLowerCase().includes(q));document.querySelector("#plist").innerHTML=a.length?`<div class="grid">${a.map(playerCard).join("")}</div>`:`<div class="empty">Keine Spieler gefunden.</div>`}
function leaderboard(){
 let a=players.slice().sort((x,y)=>y.points-x.points);
 layout(`<h1>Leaderboard</h1><p class="muted">Sortiert nach Ranking Points.</p><table class="table"><thead><tr><th>#</th><th>Spieler</th><th>Tier</th><th>Modus</th><th>RP</th></tr></thead><tbody>${a.map((p,i)=>`<tr><td>${i+1}</td><td><a class="player" href="#/player/${encodeURIComponent(p.name)}"><span class="skin">${esc(p.name[0])}</span>${esc(p.name)}</a></td><td>${badge(p.tier)}</td><td>${esc(p.mode)}</td><td><b>${p.points}</b></td></tr>`).join("")}</tbody></table>`)
}
function tiers(){
 const ts=["HT1","LT1","HT2","LT2","HT3","LT3","HT4","LT4","HT5","LT5"];
 layout(`<h1>Tier-System</h1><p class="muted">Passe dieses System später im Code oder Adminbereich an.</p><div class="grid">${ts.map(t=>`<div class="card"><div>${badge(t)}</div><p class="muted">${t.startsWith("HT")?"High Tier":"Low Tier"} ${t.slice(-1)} • PvP Ranking</p></div>`).join("")}</div>`)
}
function profile(name){
 const p=players.find(x=>x.name.toLowerCase()===name.toLowerCase());
 if(!p){layout(`<div class="empty"><h2>Spieler nicht gefunden</h2><a class="primary" href="#/players">Zurück</a></div>`);return}
 layout(`<div class="profileHead"><div class="avatar">${esc(p.name[0])}</div><div><h1>${esc(p.name)}</h1><div>${badge(p.tier)} <span class="muted">${esc(p.mode)}</span></div></div></div>
 <div class="grid"><div class="card"><div class="muted">Ranking Points</div><h2>${p.points}</h2></div><div class="card"><div class="muted">Siege</div><h2>${p.wins}</h2></div><div class="card"><div class="muted">Niederlagen</div><h2>${p.losses}</h2></div></div>
 <h2 class="sectionTitle">Tier-Verlauf</h2><div class="card"><p>${badge(p.tier)} Aktuelles Tier</p><p class="muted">Hier kannst du später Tests, Match-Historie und Testergebnisse anzeigen.</p></div>`)
}
function admin(){
 layout(`<h1>Admin</h1><div class="notice">Demo-Adminbereich: Die Daten werden in deinem Browser gespeichert. Für eine echte Website mit mehreren Benutzern brauchst du später ein Backend mit Login und Datenbank.</div>
 <div class="two"><div class="card"><h2>Spieler hinzufügen</h2><div class="field"><label>Name</label><input id="an" placeholder="MinecraftName"></div><div class="field"><label>Tier</label><select id="at">${["HT1","LT1","HT2","LT2","HT3","LT3","HT4","LT4","HT5","LT5"].map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>Modus</label><input id="am" value="Sword"></div><div class="field"><label>RP</label><input id="ap" type="number" value="1000"></div><button class="primary" onclick="addPlayer()">Spieler hinzufügen</button></div>
 <div class="card"><h2>Spieler löschen</h2><div class="field"><label>Name</label><input id="dn" placeholder="MinecraftName"></div><button class="ghost" onclick="deletePlayer()">Löschen</button></div></div>
 <h2 class="sectionTitle">Aktuelle Daten</h2><div class="grid">${players.map(p=>`<div class="card"><b>${esc(p.name)}</b> ${badge(p.tier)}<p class="muted">${p.points} RP • ${esc(p.mode)}</p></div>`).join("")}</div>`)
}
function addPlayer(){let name=document.querySelector("#an").value.trim();if(!name)return alert("Name fehlt.");if(players.some(p=>p.name.toLowerCase()===name.toLowerCase()))return alert("Spieler existiert bereits.");players.push({name,tier:document.querySelector("#at").value,mode:document.querySelector("#am").value||"Sword",points:+document.querySelector("#ap").value||1000,wins:0,losses:0});save();admin()}
function deletePlayer(){let name=document.querySelector("#dn").value.trim();let before=players.length;players=players.filter(p=>p.name.toLowerCase()!==name.toLowerCase());if(players.length===before)return alert("Spieler nicht gefunden.");save();admin()}
function searchPlayer(){let q=document.querySelector("#q").value.trim();if(q)location.hash="#/player/"+encodeURIComponent(q)}
function router(){let h=location.hash||"#/";let parts=h.slice(2).split("/");if(parts[0]==="player")profile(decodeURIComponent(parts[1]||""));else if(parts[0]==="players")playersPage();else if(parts[0]==="leaderboard")leaderboard();else if(parts[0]==="tiers")tiers();else if(parts[0]==="admin")admin();else home()}
window.addEventListener("hashchange",router);document.querySelector("#adminBtn").onclick=()=>location.hash="#/admin";router();