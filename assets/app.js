// State
const GAMES_KEY='mesjeux.jeux';
const TYPES_KEY='mesjeux.types';

// Tabs
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-panel').forEach(p=>p.hidden = (p.id !== 'panel-'+tab));
  });
});
document.getElementById('tab-browse').click();

// Theme
document.getElementById('theme-toggle').addEventListener('click',()=>{
  const html=document.documentElement;
  html.dataset.theme = (html.dataset.theme==='light'?'dark':'light');
});

// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const readFileAsDataURL = (file)=> new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });

// Types storage
function getTypes(){ try{return JSON.parse(localStorage.getItem(TYPES_KEY)||'[]')}catch{return[]} }
function setTypes(arr){ localStorage.setItem(TYPES_KEY,JSON.stringify(arr)); renderTypesTable(); refreshTypesSelect(); refreshFilterTypes(); }

// Games storage
function getGames(){ try{return JSON.parse(localStorage.getItem(GAMES_KEY)||'[]')}catch{return[]} }
function setGames(arr){ localStorage.setItem(GAMES_KEY,JSON.stringify(arr)); renderGrid(); refreshSelectJeu(); }

// Render types table
function renderTypesTable(){
  const tbody=$('#types-tbody'); if(!tbody) return;
  const types=getTypes(); tbody.innerHTML='';
  types.forEach((t,idx)=>{
    const tr=document.createElement('tr');
    const td1=document.createElement('td'); td1.textContent=idx+1;
    const td2=document.createElement('td');
    const input=document.createElement('input'); input.type='text'; input.value=t;
    input.oninput=()=>{ const arr=getTypes(); arr[idx]=input.value; setTypes(arr); };
    td2.appendChild(input);
    const td3=document.createElement('td');
    const del=document.createElement('button'); del.className='btn danger'; del.textContent='Supprimer';
    del.onclick=()=>{ const arr=getTypes(); arr.splice(idx,1); setTypes(arr); };
    td3.appendChild(del);
    tr.append(td1,td2,td3); tbody.appendChild(tr);
  });
}
function refreshTypesSelect(){
  const sel=$('#jeu-types'); if(!sel) return;
  const types=getTypes().filter(Boolean); sel.innerHTML='';
  types.forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; sel.appendChild(o); });
}
function refreshFilterTypes(){
  const sel=$('#filter-type'); if(!sel) return;
  const types=getTypes().filter(Boolean); const current=sel.value;
  sel.innerHTML='<option value="">— Tous les types —</option>';
  types.forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; sel.appendChild(o); });
  sel.value=current || '';
}

// Init default types
if(!getTypes().length){ setTypes(['Ambiance','Cartes','Bluff','Coopératif','Deckbuilding','Déduction']); }
else { renderTypesTable(); refreshTypesSelect(); refreshFilterTypes(); }
$('#types-add')?.addEventListener('click',()=>{ const arr=getTypes(); arr.push(''); setTypes(arr); });
$('#types-save')?.addEventListener('click',()=> alert('Paramètres enregistrés.'));
$('#types-defaults')?.addEventListener('click',()=> setTypes(['Ambiance','Cartes','Bluff','Coopératif','Deckbuilding','Déduction']));

// Browse grid
function renderGrid(){
  const grid=$('#grid'); if(!grid) return;
  const q=$('#search').value.trim().toLowerCase();
  const fType=$('#filter-type').value;
  const fPlayers=$('#filter-players').value;
  const games=getGames();

  grid.innerHTML='';
  games.filter(g=>{
    const okQ = !q || (g.nom||'').toLowerCase().includes(q) || (g.remarques||'').toLowerCase().includes(q) || (g.types||[]).join(' ').toLowerCase().includes(q);
    const okT = !fType || (g.types||[]).includes(fType);
    const okP = !fPlayers || (Number(g.nbMin||0)<=Number(fPlayers) && Number(g.nbMax||99)>=Number(fPlayers));
    return okQ && okT && okP;
  }).forEach(g=>{
    const card=document.createElement('div'); card.className='game-card';
    const img=document.createElement('img'); img.src=g.photo||'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"72\" height=\"72\"><rect width=\"100%\" height=\"100%\" fill=\"%23ddd\"/></svg>';
    const info=document.createElement('div');
    const title=document.createElement('div'); title.innerHTML='<strong>'+ (g.nom||'Sans nom') +'</strong>';
    const meta=document.createElement('div'); meta.className='game-meta'; meta.textContent=`${g.nbMin||'?'}–${g.nbMax||'?'} joueurs • ${g.age||'?'} • ${g.duree||'?'} min`;
    const badges=document.createElement('div'); badges.className='badges';
    (g.types||[]).forEach(t=>{ const b=document.createElement('span'); b.className='badge'; b.textContent=t; badges.appendChild(b); });
    info.append(title,meta,badges);
    card.append(img,info); grid.appendChild(card);
  });
}
$('#search')?.addEventListener('input',renderGrid);
$('#filter-type')?.addEventListener('change',renderGrid);
$('#filter-players')?.addEventListener('change',renderGrid);

// Select jeu list for editing
function refreshSelectJeu(){
  const sel=$('#select-jeu'); if(!sel) return;
  const games=getGames(); const current=sel.value;
  sel.innerHTML='<option value="">— Sélectionner un jeu —</option>';
  games.forEach((g,idx)=>{ const o=document.createElement('option'); o.value=idx; o.textContent=g.nom||('Jeu '+(idx+1)); sel.appendChild(o); });
  sel.value=current || '';
}

// Form helpers
function readForm(){
  const types=[...$('#jeu-types').selectedOptions].map(o=>o.value);
  return {
    nom:$('#jeu-nom').value.trim(),
    nbMin:Number($('#jeu-nb-min').value||0),
    nbMax:Number($('#jeu-nb-max').value||0),
    age:$('#jeu-age').value.trim(),
    duree:Number($('#jeu-duree').value||0),
    types,
    remarques:$('#jeu-remarques').value.trim(),
    url:$('#jeu-url').value.trim(),
    desc:$('#jeu-desc').value.trim(),
    photo: $('#photo-img')?.src?.startsWith('data:') ? $('#photo-img').src : null
  };
}
function writeForm(g){
  $('#jeu-nom').value=g?.nom||'';
  $('#jeu-nb-min').value=g?.nbMin||'';
  $('#jeu-nb-max').value=g?.nbMax||'';
  $('#jeu-age').value=g?.age||'';
  $('#jeu-duree').value=g?.duree||'';
  $('#jeu-remarques').value=g?.remarques||'';
  $('#jeu-url').value=g?.url||'';
  $('#jeu-desc').value=g?.desc||'';
  [...$('#jeu-types').options].forEach(o=>o.selected=(g?.types||[]).includes(o.value));
  if(g?.photo){ $('#photo-img').src=g.photo; $('#photo-preview').hidden=false; } else { $('#photo-preview').hidden=true; }
}
$('#btn-clear')?.addEventListener('click',()=> writeForm(null));

// Photo preview
$('#jeu-photo')?.addEventListener('change', async (e)=>{
  const f=e.target.files?.[0]; if(!f) return;
  const dataUrl = await readFileAsDataURL(f);
  $('#photo-img').src=dataUrl; $('#photo-preview').hidden=false;
});

// Add/Update
$('#btn-add-update')?.addEventListener('click',()=>{
  const games=getGames();
  const g=readForm();
  const selIdx = Number($('#select-jeu').value);
  if(Number.isInteger(selIdx) && selIdx>=0){ games[selIdx]=g; } else { games.push(g); }
  setGames(games); refreshSelectJeu();
  alert('Jeu enregistré.');
});
// Delete
$('#btn-delete')?.addEventListener('click',()=>{
  const selIdx = Number($('#select-jeu').value);
  if(!Number.isInteger(selIdx) || selIdx<0) return alert('Sélectionne un jeu.');
  const games=getGames(); games.splice(selIdx,1); setGames(games); refreshSelectJeu(); $('#btn-clear').click();
});
// Load selected
$('#btn-charger')?.addEventListener('click',()=>{
  const selIdx = Number($('#select-jeu').value);
  if(!Number.isInteger(selIdx) || selIdx<0) return alert('Sélectionne un jeu.');
  writeForm(getGames()[selIdx]);
});

// Export / Import (local JSON)
$('#export-json')?.addEventListener('click',()=>{
  const blob=new Blob([ JSON.stringify(getGames(),null,2) ], {type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mes-jeux.json'; a.click();
});
$('#btn-import')?.addEventListener('click',()=> $('#file-import').click());
$('#file-import')?.addEventListener('change', async (e)=>{
  const f=e.target.files?.[0]; if(!f) return;
  const text=await f.text(); try{ const data=JSON.parse(text); if(Array.isArray(data)){ setGames(data); alert('Import OK'); } else alert('Format invalide'); }catch{ alert('JSON invalide'); }
});

// Seed data if empty
if(!getGames().length){
  setGames([
    {nom:'Skyjo', nbMin:2, nbMax:8, age:'8+', duree:30, types:['Cartes','Famille'], remarques:'Simple et fun.'},
    {nom:'Codenames', nbMin:2, nbMax:8, age:'10+', duree:15, types:['Ambiance','Déduction']}
  ]);
}else{ renderGrid(); refreshSelectJeu(); }
