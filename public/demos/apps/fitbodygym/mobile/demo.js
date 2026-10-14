'use strict';
const device=document.getElementById('device');
const launch=document.getElementById('launch');
const reset=document.getElementById('reset');
const status=document.getElementById('status');
let frame;
function startDemo(){
  status.textContent='Cargando la app…';
  if(frame)frame.remove();
  frame=document.createElement('iframe');
  frame.title='FitBodyGym · Demo móvil de miembros';
  frame.src='app.html';
  frame.addEventListener('load',()=>{status.textContent='Vista móvil · Pulsa ACCEDER sin credenciales';});
  device.replaceChildren(frame);
  reset.hidden=false;
}
launch.addEventListener('click',startDemo);
reset.addEventListener('click',startDemo);
