// Zenkai.cl: envío del formulario de contacto a Formspree sin salir de la página.
// Sin JavaScript, el formulario se envía igual y Formspree redirige a /gracias.html.
(function () {
  'use strict';

  var form = document.getElementById('formulario-contacto');
  if (!form) return;

  var boton = form.querySelector('button[type="submit"]');
  var textoBoton = boton.querySelector('.boton__texto');
  var avisoError = document.getElementById('formulario-error');
  var avisoExito = document.getElementById('formulario-exito');
  var CORREO = 'contacto@zenkai.cl';

  var mensajes = {
    nombre: { valueMissing: 'Escribe tu nombre.' },
    email: {
      valueMissing: 'Escribe tu correo para poder responderte.',
      typeMismatch: 'Revisa el correo: debe tener la forma nombre@empresa.cl.'
    },
    mensaje: {
      valueMissing: 'Cuéntanos qué necesitas.',
      tooShort: 'Agrega un poco más de detalle: al menos 20 caracteres.'
    }
  };

  function errorDe(campo) {
    var v = campo.validity;
    var m = mensajes[campo.name] || {};
    if (v.valueMissing) return m.valueMissing;
    if (v.typeMismatch) return m.typeMismatch;
    if (v.tooShort) return m.tooShort;
    return '';
  }

  function mostrar(campo, texto) {
    var el = document.getElementById(campo.getAttribute('aria-describedby'));
    if (!el) return;
    if (texto) {
      campo.setAttribute('aria-invalid', 'true');
      el.textContent = texto;
      el.hidden = false;
    } else {
      campo.removeAttribute('aria-invalid');
      el.textContent = '';
      el.hidden = true;
    }
  }

  var validables = Array.prototype.slice.call(form.querySelectorAll('[required]'));

  validables.forEach(function (campo) {
    campo.addEventListener('blur', function () {
      if (campo.value !== '') mostrar(campo, errorDe(campo));
    });
    campo.addEventListener('input', function () {
      if (campo.getAttribute('aria-invalid') === 'true') mostrar(campo, errorDe(campo));
    });
  });

  function cargando(activo) {
    boton.disabled = activo;
    boton.classList.toggle('cargando', activo);
    textoBoton.textContent = activo ? 'Enviando solicitud' : 'Solicitar cotización';
  }

  function fallo(texto) {
    avisoError.innerHTML = '';
    avisoError.appendChild(document.createTextNode(texto + ' También puedes escribirnos a '));
    var a = document.createElement('a');
    a.href = 'mailto:' + CORREO;
    a.textContent = CORREO;
    avisoError.appendChild(a);
    avisoError.appendChild(document.createTextNode('.'));
    avisoError.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    avisoError.hidden = true;

    var primero = null;
    validables.forEach(function (campo) {
      var t = errorDe(campo);
      mostrar(campo, t);
      if (t && !primero) primero = campo;
    });
    if (primero) { primero.focus(); return; }

    if (form.action.indexOf('FORMSPREE_ID') !== -1) {
      fallo('El formulario aún no está conectado.');
      return;
    }

    cargando(true);

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (r) {
        if (r.ok) {
          form.hidden = true;
          avisoExito.hidden = false;
          avisoExito.focus();
          return;
        }
        return r.json().catch(function () { return {}; }).then(function (data) {
          var detalle = data && data.errors && data.errors.length
            ? data.errors.map(function (x) { return x.message; }).join(' ')
            : '';
          fallo('No pudimos enviar tu solicitud. ' + (detalle ? detalle + ' ' : 'Inténtalo de nuevo en unos minutos.'));
          cargando(false);
        });
      })
      .catch(function () {
        fallo('No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.');
        cargando(false);
      });
  });
})();
