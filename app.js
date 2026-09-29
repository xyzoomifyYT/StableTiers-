
const MODES=["Vanilla","Crystal","Axe","Sword","UHC","Mace","Bow","Spear","Elytra","Bed","Pot"];
const TIERS=["HT1","LT1","HT2","LT2","HT3","LT3","HT4","LT4","HT5","LT5"];
const KEY="stabletiers_db_v1", USERKEY="stabletiers_current_user";
function load(){return JSON.parse(localStorage.getItem(KEY)||'{"players":{},"applications":[],"tests":[]}')}
function save(db){localStorage.setItem(KEY,JSON.stringify(db))}
function currentUser(){return localStorage.getItem(USERKEY)||""}
function setUser(n){localStorage.setItem(USERKEY,n)}
function logout(){localStorage.removeItem(USERKEY);location.href="index.html"}
function ensurePlayer(name){
 const db=load();
 if(!db.players[name]) db.players[name]={name,elo:0,wins:0,losses:0,kd:"0.00",tier:null,mode:null,history:[]};
 save(db); return db.players[name]
}
function login(){
 const el=document.querySelector("#loginName"), err=document.querySelector("#loginError");
 const n=(el.value||"").trim();
 if(!/^[A-Za-z0-9_]{3,16}$/.test(n)){err.textContent="Bitte gib einen gültigen Minecraft-Namen ein (3–16 Zeichen).";return}
 setUser(n);ensurePlayer(n);location.reload()
}
function guard(){
 const u=currentUser(); const loginBox=document.getElementById("login");
 if(!u){if(loginBox)loginBox.classList.remove("hidden");return false}
 if(loginBox)loginBox.classList.add("hidden");
 document.querySelectorAll("[data-user]").forEach(x=>x.textContent=u);
 return true
}
function tierClass(t){if(!t)return"";return "t"+Math.ceil(Number(t.slice(-1))/1)}
function tierBadge(t){if(!t)return '<span class="muted">Noch kein Tier</span>'; return `<span class="tier ${tierClass(t)}">${t}</span>`}
function seed(){
 const db=load();
 if(Object.keys(db.players).length)return;
 ["zNXco","iCraze","xLunaa","Rexxy","PandaFlex","NeoPvP","Kryptex","Voidz"].forEach((n,i)=>{
  db.players[n]={name:n,elo:1000-i*50,wins:10-i,losses:i,tier:TIERS[Math.min(i,9)],mode:MODES[i%MODES.length],kd:(1.8-i*.1).toFixed(2),history:[]}
 });
 save(db)
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
document.addEventListener("DOMContentLoaded",()=>{seed();guard();});
