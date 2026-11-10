(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY="valhalla_bookings_v1",C=CONFIG;
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}};
const save=b=>{try{localStorage.setItem(KEY,JSON.stringify(b))}catch{}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0"),iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const hm=m=>`${pad(Math.floor(m/60)%24)}:${pad(m%60)}`;
const DAYS=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const st={date:"",party:2,zone:C.zones[0].id,time:null};
const pd=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};

/* Textos de configuración */
$$("[data-c]").forEach(e=>e.textContent=C[e.dataset.c]);
$$("[data-tel]").forEach(e=>{e.textContent=C.phone;e.href="tel:"+C.phone.replace(/[^\d+]/g,"")});
$$("[data-wa]").forEach(e=>{e.href="https://wa.me/"+C.whatsapp;e.target="_blank";e.rel="noopener"});
$$("[data-map]").forEach(e=>e.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(C.mapQuery));
$("#map").src="https://www.google.com/maps?q="+encodeURIComponent(C.mapQuery)+"&output=embed";
$("#hours").innerHTML=[1,2,3,4,5,6,0].map(d=>{const[o,c]=C.hours[d];return`<li><span>${DAYS[d]}</span><span>${hm(o*60)}–${hm(c*60)}</span></li>`}).join("");
$("#zones").innerHTML=C.zones.map(z=>`<article class="card"><span>${{sala:"🛋",terraza:"🌙",vip:"👑"}[z.id]||"🔥"}</span><h3>${esc(z.name)}</h3><p>${esc(z.desc)}</p><b class="cap">Aforo: ${z.seats} personas</b></article>`).join("");
$("#zone").innerHTML=C.zones.map(z=>`<option value="${z.id}">${esc(z.name)}</option>`).join("");

/* Carta */
const cats=Object.keys(C.menu);
const showMenu=c=>{$("#menu").innerHTML=C.menu[c].map(([n,d,p])=>`<div class="item"><div><b>${esc(n)}</b><small>${esc(d)}</small></div><i>${esc(p)}</i></div>`).join("");$$("#tabs button").forEach(b=>b.classList.toggle("on",b.textContent===c))};
$("#tabs").innerHTML=cats.map(c=>`<button>${c}</button>`).join("");
$("#tabs").onclick=e=>e.target.tagName==="BUTTON"&&showMenu(e.target.textContent);showMenu(cats[0]);

/* Motor de reservas */
const zone=id=>C.zones.find(z=>z.id===id);
function occupied(date,zoneId,start,list=load()){
  return list.filter(b=>b.date===date&&b.zone===zoneId&&b.status!=="cancelada"&&b.start<start+C.stayMinutes&&b.start+C.stayMinutes>start).reduce((s,b)=>s+b.party,0);
}
function slotsFor(date){
  const[o,c]=C.hours[pd(date).getDay()],out=[];
  for(let m=o*60;m<=c*60-C.stayMinutes+30;m+=C.slotStep)out.push(m);return out;
}
function renderSlots(){
  const box=$("#slots");if(!st.date){box.innerHTML="";$("#slotHint").textContent="Elige una fecha.";return}
  const now=new Date(),base=pd(st.date);
  box.innerHTML=slotsFor(st.date).map(m=>{
    const t=new Date(base.getTime()+m*60000),past=t<new Date(now.getTime()+30*60000);
    return '<button type="button" data-m="'+m+'" '+(past?"disabled":"")+' class="'+(st.time===m?"on":"")+'">'+hm(m)+'</button>';
  }).join("");
  $("#slotHint").textContent="Selecciona una hora. El equipo confirmará la disponibilidad por WhatsApp."; 
  if(st.time!==null&&!$("#slots button[data-m=\""+st.time+"\"]:not(:disabled)").length)st.time=null;
  summary();
}
function summary(){
  const z=zone(st.zone);
  $("#summary").innerHTML=st.date&&st.time!==null?`<b>${DAYS[pd(st.date).getDay()]} ${pd(st.date).toLocaleDateString("es-ES")}</b> · ${hm(st.time)}h<br>${st.party} personas · ${esc(z.name)}`:"Selecciona fecha y hora.";
}
const d=$("#date"),today=new Date(),max=new Date();max.setDate(max.getDate()+C.daysAhead);
d.min=iso(today);d.max=iso(max);
d.onchange=()=>{st.date=d.value;st.time=null;renderSlots()};
$("#zone").onchange=e=>{st.zone=e.target.value;renderSlots()};
$("#plus").onclick=()=>{st.party=Math.min(C.maxParty,st.party+1);$("#party").textContent=st.party;renderSlots()};
$("#minus").onclick=()=>{st.party=Math.max(1,st.party-1);$("#party").textContent=st.party;renderSlots()};
$("#slots").onclick=e=>{const b=e.target.closest("button");if(!b||b.disabled)return;st.time=+b.dataset.m;renderSlots()};
renderSlots();

let last=null;
const code=()=>{const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return"VH-"+Array.from({length:5},()=>a[Math.random()*a.length|0]).join("")};
$("#form").onsubmit=e=>{
  e.preventDefault();const err=$("#err");err.textContent="";
  const name=$("#name").value.trim(),tel=$("#tel").value.trim(),email=$("#email").value.trim();
  if(!st.date||st.time===null)return err.textContent="Elige fecha y hora."; 
  if(name.length<2)return err.textContent="Escribe tu nombre."; 
  if(!/^\\+?[\\d\\s]{9,15}$/.test(tel))return err.textContent="Teléfono no válido."; 
  if(email&&!/^\\S+@\\S+\\.\\S+$/.test(email))return err.textContent="Email no válido."; 
  if(!$("#legal").checked)return err.textContent="Debes confirmar que todos los asistentes son mayores de 18 años."; 
  const f=pd(st.date).toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"});
  const msg="Hola Valhalla Rivas. Quiero solicitar una mesa para "+st.party+" personas el "+f+" a las "+hm(st.time)+"h, en "+zone(st.zone).name+". Nombre: "+name+". Teléfono: "+tel+"."+(email?" Email: "+email:"")+" Ocasión: "+$("#occ").value+". Notas: "+($("#notes").value.trim()||"Sin notas")+". ¿Podéis confirmarme disponibilidad?";
  $("#summary").textContent="Abriendo WhatsApp para enviar tu solicitud. La mesa no queda confirmada hasta recibir respuesta del local."; 
  window.open("https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(msg),"_blank","noopener");
};
function confirmModal(b){
  const f=pd(b.date).toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"});
  $("#okTxt").textContent=`${b.name}, te esperamos el ${f} a las ${hm(b.start)}h (${b.party} pers. · ${zone(b.zone).name}).`;
  $("#okCode").textContent=b.id;
  const msg=`Hola Valhalla, reserva ${b.id}: ${f} ${hm(b.start)}h, ${b.party} personas, ${zone(b.zone).name}. A nombre de ${b.name}.`;
  $("#okWa").href=`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;$("#ok").classList.add("show");
}
$("#okClose").onclick=()=>$("#ok").classList.remove("show");
$("#okIcs").onclick=()=>{
  if(!last)return;const s=new Date(pd(last.date).getTime()+last.start*60000),e=new Date(s.getTime()+C.stayMinutes*60000);
  const f=x=>x.toISOString().replace(/[-:]|\.\d{3}/g,"");
  const ics=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:${last.id}@valhalla\r\nDTSTAMP:${f(new Date())}\r\nDTSTART:${f(s)}\r\nDTEND:${f(e)}\r\nSUMMARY:Reserva ${C.name} (${last.id})\r\nLOCATION:${C.address}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  dl(ics,`reserva-${last.id}.ics`,"text/calendar");
};
function dl(t,n,m){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click()}

/* Panel de gestión (#admin) */
const adm=$("#admin");let admDate="";
function openAdm(){adm.classList.add("show")}
$("#adminLink").onclick=openAdm;if(location.hash==="#admin")openAdm();
$("#admClose").onclick=()=>{adm.classList.remove("show");history.replaceState(null,"",location.pathname)};
$("#pinGo").onclick=()=>{if($("#pin").value===C.adminPin){$("#admLogin").hidden=true;$("#admBody").hidden=false;$("#admDate").value=iso(new Date());admDate=$("#admDate").value;drawAdm()}else alert("PIN incorrecto")};
$("#admDate").onchange=e=>{admDate=e.target.value;drawAdm()};$("#admAll").onclick=()=>{admDate="";$("#admDate").value="";drawAdm()};
function drawAdm(){
  const all=load(),rows=all.filter(b=>!admDate||b.date===admDate).sort((a,b)=>a.date.localeCompare(b.date)||a.start-b.start);
  const act=rows.filter(b=>b.status!=="cancelada");
  $("#kpis").innerHTML=`<div><b>${act.length}</b>reservas</div><div><b>${act.reduce((s,b)=>s+b.party,0)}</b>personas</div><div><b>${rows.length-act.length}</b>canceladas</div>`;
  $("#tbl").innerHTML=`<tr><th>Código</th><th>Fecha</th><th>Hora</th><th>Pers.</th><th>Zona</th><th>Cliente</th><th>Teléfono</th><th>Notas</th><th></th></tr>`+(rows.map(b=>`<tr style="${b.status==="cancelada"?"opacity:.4":""}"><td>${esc(b.id)}</td><td>${esc(b.date)}</td><td>${hm(b.start)}</td><td>${b.party}</td><td>${esc(zone(b.zone)?.name)}</td><td>${esc(b.name)}<br><small>${esc(b.occ)}</small></td><td><a href="tel:${esc(b.tel)}">${esc(b.tel)}</a></td><td>${esc(b.notes)}</td><td>${b.status==="cancelada"?"—":`<button data-id="${esc(b.id)}">Cancelar</button>`}</td></tr>`).join("")||`<tr><td colspan="9">Sin reservas.</td></tr>`);
}
$("#tbl").onclick=e=>{const id=e.target.dataset.id;if(!id||!confirm("¿Cancelar "+id+"?"))return;const l=load();l.find(b=>b.id===id).status="cancelada";save(l);drawAdm();renderSlots()};
$("#admCsv").onclick=()=>dl("Codigo;Fecha;Hora;Personas;Zona;Nombre;Telefono;Email;Ocasion;Notas;Estado\n"+load().map(b=>[b.id,b.date,hm(b.start),b.party,b.zone,b.name,b.tel,b.email,b.occ,(b.notes||"").replace(/[;\n]/g," "),b.status].join(";")).join("\n"),"reservas.csv","text/csv");
$("#admNew").onclick=()=>{const n=prompt("Nombre:");if(!n)return;const t=prompt("Teléfono:")||"",date=prompt("Fecha (AAAA-MM-DD):",admDate||iso(new Date())),h=prompt("Hora (HH:MM):","21:00"),p=+prompt("Personas:","2"),zn=prompt("Zona ("+C.zones.map(z=>z.id).join("/")+"):",C.zones[0].id);
  if(!date||!h||!zone(zn))return;const[hh,mm]=h.split(":").map(Number);const l=load();l.push({id:code(),date,start:hh*60+mm,party:p||2,zone:zn,name:n,tel:t,email:"",occ:"Manual",notes:"",status:"confirmada",created:Date.now()});save(l);drawAdm();renderSlots()};

/* UI general */
if(sessionStorage.getItem("age"))$("#age").classList.remove("show");
$("#ageYes").onclick=()=>{try{sessionStorage.setItem("age","1")}catch{}$("#age").classList.remove("show")};
$("#burger").onclick=()=>$("#nav").classList.toggle("open");$("#nav").onclick=()=>$("#nav").classList.remove("open");
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add("in")),{threshold:.1});
$$(".card,.panel,details,.item").forEach(e=>{e.classList.add("rv");io.observe(e)});
})();
