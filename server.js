const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CHANGE_ME_NOW_123!';
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data.json');
const PUBLIC = path.join(ROOT, 'public');
const sessions = new Map();

function readData(){ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); }
function writeData(data){ fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2)); }
function send(res,status,body,type='application/json; charset=utf-8',headers={}){
  res.writeHead(status, {'Content-Type':type, 'Cache-Control':'no-store', ...headers});
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
function parseCookies(req){
  const out={};
  for(const part of (req.headers.cookie||'').split(';')){
    const i=part.indexOf('='); if(i>0) out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim());
  }
  return out;
}
function isAdmin(req){
  const token=parseCookies(req).stable_admin;
  return token && sessions.has(token);
}
function same(a,b){
  const aa=Buffer.from(String(a)); const bb=Buffer.from(String(b));
  return aa.length===bb.length && crypto.timingSafeEqual(aa,bb);
}
function body(req){
  return new Promise((resolve,reject)=>{let raw='';req.on('data',c=>{raw+=c;if(raw.length>2e6)req.destroy();});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch(e){reject(e)}});req.on('error',reject)});
}
function json(res,status,obj,headers={}){send(res,status,obj,'application/json; charset=utf-8',headers)}
function requireAdmin(req,res){if(!isAdmin(req)){json(res,401,{error:'Admin login required'});return false}return true}
function normalizePlayer(input,modes){
  const name=String(input.name||'').trim();
  if(!/^[A-Za-z0-9_]{2,16}$/.test(name)) throw new Error('Minecraft name must be 2-16 characters.');
  const region=['EU','NA','AS','OC','SA','AF'].includes(input.region)?input.region:'EU';
  const tiers={};
  for(const m of modes) tiers[m.id]=String(input.tiers?.[m.id]||'Unranked').slice(0,12);
  return {name,region,rank:String(input.rank||'Combat').slice(0,80),tiers,siteRank:String(input.siteRank||'User').slice(0,30)};
}
function api(req,res,url){
  const data=readData();
  if(req.method==='GET' && url.pathname==='/api/data') return json(res,200,data);
  if(req.method==='GET' && url.pathname==='/api/players') return json(res,200,{players:data.players,modes:data.modes});
  if(req.method==='GET' && url.pathname.startsWith('/api/players/')){
    const name=decodeURIComponent(url.pathname.slice('/api/players/'.length));
    const p=data.players.find(x=>x.name.toLowerCase()===name.toLowerCase());
    return p?json(res,200,p):json(res,404,{error:'Player not found'});
  }
  if(req.method==='POST' && url.pathname==='/api/auth/login') return body(req).then(b=>{
    if(!same(b.password,ADMIN_PASSWORD)) return json(res,403,{error:'Wrong password'});
    const token=crypto.randomBytes(32).toString('hex'); sessions.set(token,Date.now());
    return json(res,200,{ok:true},{'Set-Cookie':`stable_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`});
  }).catch(()=>json(res,400,{error:'Invalid JSON'}));
  if(req.method==='POST' && url.pathname==='/api/auth/logout'){
    const token=parseCookies(req).stable_admin; if(token) sessions.delete(token);
    return json(res,200,{ok:true},{'Set-Cookie':'stable_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});
  }
  if(req.method==='GET' && url.pathname==='/api/auth/me') return json(res,200,{admin:!!isAdmin(req)});
  if(url.pathname.startsWith('/api/admin/')){
    if(!requireAdmin(req,res)) return;
    if(req.method==='POST' && url.pathname==='/api/admin/players') return body(req).then(b=>{
      const p=normalizePlayer(b,data.modes); if(data.players.some(x=>x.name.toLowerCase()===p.name.toLowerCase())) return json(res,409,{error:'Player already exists'});
      data.players.push(p); writeData(data); json(res,201,p);
    }).catch(e=>json(res,400,{error:e.message||'Invalid JSON'}));
    if(req.method==='PUT' && url.pathname.startsWith('/api/admin/players/')) return body(req).then(b=>{
      const oldName=decodeURIComponent(url.pathname.slice('/api/admin/players/'.length));
      const i=data.players.findIndex(x=>x.name.toLowerCase()===oldName.toLowerCase()); if(i<0) return json(res,404,{error:'Player not found'});
      const p=normalizePlayer({...data.players[i],...b},data.modes);
      if(p.name.toLowerCase()!==oldName.toLowerCase() && data.players.some((x,j)=>j!==i&&x.name.toLowerCase()===p.name.toLowerCase())) return json(res,409,{error:'New player name already exists'});
      data.players[i]=p; writeData(data); json(res,200,p);
    }).catch(e=>json(res,400,{error:e.message||'Invalid JSON'}));
    if(req.method==='DELETE' && url.pathname.startsWith('/api/admin/players/')){
      const name=decodeURIComponent(url.pathname.slice('/api/admin/players/'.length));
      const before=data.players.length; data.players=data.players.filter(x=>x.name.toLowerCase()!==name.toLowerCase());
      if(before===data.players.length) return json(res,404,{error:'Player not found'}); writeData(data); return json(res,200,{ok:true});
    }
    if(req.method==='PUT' && url.pathname==='/api/admin/settings') return body(req).then(b=>{
      data.settings={...data.settings,...b}; writeData(data); json(res,200,data.settings);
    }).catch(()=>json(res,400,{error:'Invalid JSON'}));
  }
  json(res,404,{error:'Not found'});
}
function serve(req,res,url){
  let rel=url.pathname==='/'?'index.html':url.pathname.replace(/^\/+/,'');
  if(rel.includes('..')) return send(res,400,'Bad request','text/plain; charset=utf-8');
  const file=path.join(PUBLIC,rel);
  fs.stat(file,(err,st)=>{
    if(err||!st.isFile()) return send(res,404,'Not found','text/plain; charset=utf-8');
    const ext=path.extname(file).toLowerCase(); const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
    res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public, max-age=86400'}); fs.createReadStream(file).pipe(res);
  });
}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);
  if(url.pathname.startsWith('/api/')) return api(req,res,url);
  serve(req,res,url);
});
server.listen(PORT,HOST,()=>console.log(`Stabletiers running on http://${HOST==='0.0.0.0'?'localhost':HOST}:${PORT}`));
