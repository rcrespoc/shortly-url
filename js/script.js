const d = document,
$menuBtn = d.querySelector('.menu-btn'),
$menu = d.querySelector('.menu'),
$form = d.querySelector('#form-short'),
$inputShort = d.querySelector('#link'),
url = `https://api.shrtco.de/v2/shorten?url=`,
$loader = d.querySelector('.loader'),
$divLinks = d.querySelector('.links > .container');
let cont = 0;

$form.addEventListener('submit', async e => {
  e.preventDefault();
  dibujarSpinner();
  let enlace = $inputShort.value;
  const enlaces = {
    enlace,
    enlace2: await acortarEnlace(enlace) 
  }
  limpiarSpinner();
  $inputShort.value = '';
  (typeof enlaces.enlace2 !== 'object') 
    ? dibujarHTML(enlaces) 
    : mostrarError(enlaces.enlace2, enlace);
})

$menuBtn.addEventListener('click', e => {
  $menuBtn.firstElementChild.classList.toggle('none');
  $menuBtn.lastElementChild.classList.toggle('none');
  $menu.classList.toggle('is-active');
})

d.addEventListener('click', e => {
  if(!e.target.matches('.menu a')) return false;
  $menuBtn.firstElementChild.classList.remove("none");
  $menuBtn.lastElementChild.classList.add("none");
  $menu.classList.remove("is-active");
})

async function acortarEnlace(enlace) {
  try {
    const response = await fetch(url+enlace);
    const data = await response.json();
    return data.ok ? data.result.short_link : data;
  } catch (error) {
    console.log(error);
  }
}

function dibujarSpinner() {
  $form.style.display = 'none';
  $loader.classList.remove('none');
  $loader.innerHTML = `
  <div class="sk-fading-circle">
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
  </div>
  `;
}

function limpiarSpinner() {
  while($loader.firstElementChild){
    $loader.removeChild($loader.firstElementChild);
  }
  $form.style.display = 'flex';
}
function dibujarHTML(enlaces) {
  const {enlace, enlace2} = enlaces;
  // CREACION DE ELEMENTOS
  const $divLink = d.createElement('div'),
  $pEnlacePrev = d.createElement('p'),
  $hr = d.createElement('hr'),
  $divEnlaceAcortado = d.createElement('div'),
  $pEnlaceAcortado = d.createElement('p'),
  $btnCopy = d.createElement('button');

  // CLASES
  $divLink.classList.add('link');
  $pEnlacePrev.classList.add('enlace-previo');
  $hr.classList.add('opacity-4', 'hr-mobile');
  $divEnlaceAcortado.classList.add('enlace-acortado', 'flex','column');
  $pEnlaceAcortado.setAttribute('id',`link${cont}`);
  $btnCopy.classList.add('btn','btn-clip');
  $btnCopy.href = '#';
  $btnCopy.setAttribute('data-clipboard-target',`#link${cont}`);

  // AGREGANDO CONTENIDO
  $pEnlacePrev.textContent = enlace;
  $pEnlaceAcortado.textContent = enlace2;
  $btnCopy.textContent = 'Copy';

  $btnCopy.addEventListener('click', e => {
    copiarAlPortapapeles($pEnlaceAcortado,$btnCopy);
  })
  // INSERTANDO EN PADRES
  $divLink.appendChild($pEnlacePrev);
  $divLink.appendChild($hr);
  $divEnlaceAcortado.appendChild($pEnlaceAcortado);
  $divEnlaceAcortado.appendChild($btnCopy);
  $divLink.appendChild($divEnlaceAcortado);

  // PEGANDOLE AL DOM
  cont++;
  if($divLinks.childElementCount > 4)
    $divLinks.removeChild($divLinks.lastElementChild);
  $divLinks.insertAdjacentElement('afterbegin',$divLink);
}

function copiarAlPortapapeles(elemento, boton) {
  const clipboard = new ClipboardJS(boton);
  clipboard.on('success', e => {
    elemento.style = "color: var(--cyan);";
    boton.classList.add('copiado');
    boton.textContent = 'Copied!';
  })
  clipboard.on('error', e => {
    console.log(e);
  })
}
function mostrarError(objeto, enlace) {
  alert(`El enlace: ${enlace}, no puede acortarse. Razón: ${objeto.error}`);
}