const launch=document.querySelector('#launch');
launch.addEventListener('click',()=>{
 const frame=document.createElement('iframe');
 frame.title='Sistema 130: interfaz original con integraciones simuladas';
 frame.src='runtime/index.html';
 frame.setAttribute('sandbox','allow-scripts allow-same-origin');
 document.querySelector('#launcher').replaceWith(frame);
 document.querySelector('#status').textContent='Demo iniciada · Usa INICIAR dentro de la app para abrir el menú';
});
