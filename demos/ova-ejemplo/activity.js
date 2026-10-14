const form=document.querySelector('form');const feedback=document.querySelector('#feedback');
form.addEventListener('submit',e=>{e.preventDefault();const answer=new FormData(form).get('answer');feedback.textContent=answer==='b'?'¡Correcto! El teclado y un foco visible permiten recorrer la interfaz sin depender de un ratón.':'Inténtalo de nuevo. Piensa en cómo una persona podría recorrer la página sin usar un ratón.';});
form.addEventListener('reset',()=>{feedback.textContent='Actividad reiniciada. Elige una respuesta.';});
