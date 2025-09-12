
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p=>p.hidden=(p.id!=='panel-'+btn.dataset.tab));
  });
});
document.getElementById('tab-browse').click();
const TYPES_KEY='mesjeux.types';
function getTypes(){try{return JSON.parse(localStorage.getItem(TYPES_KEY)||'[]')}catch{return[]}}
function setTypes(arr){localStorage.setItem(TYPES_KEY,JSON.stringify(arr));renderTypes();}
function renderTypes(){const tbody=document.getElementById('types-tbody');tbody.innerHTML='';getTypes().forEach((t,i)=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${i+1}</td><td><input value="${t}" onchange="updateType(${i},this.value)"></td><td><button onclick="delType(${i})">Supprimer</button></td>`;tbody.appendChild(tr);});}
function updateType(i,val){const arr=getTypes();arr[i]=val;setTypes(arr);}
function delType(i){const arr=getTypes();arr.splice(i,1);setTypes(arr);}
document.getElementById('types-add').onclick=()=>{const arr=getTypes();arr.push('');setTypes(arr)};
document.getElementById('types-defaults').onclick=()=>{setTypes(['Ambiance','Cartes']);};
if(!getTypes().length)setTypes(['Ambiance','Cartes']);else renderTypes();
