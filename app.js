'use strict';

/* ===== Menú móvil ===== */
const menuToggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu-principal');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

// Cierra el menú al elegir un enlace
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

// Cierra el menú con Escape y devuelve el foco al botón
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

/* ===== Validación del formulario de contacto ===== */
const form = document.getElementById('form-contacto');
const status = document.getElementById('estado-formulario');
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reglas por campo: devuelven un mensaje de error o '' si el valor es válido
const rules = {
  nombre(value) {
    return value.trim() ? '' : 'Escribe tu nombre.';
  },
  correo(value) {
    if (!value.trim()) return 'Escribe tu correo electrónico.';
    return EMAIL_PATTERN.test(value.trim()) ? '' : 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
  },
  mensaje(value) {
    return value.trim().length >= 10 ? '' : 'Escribe un mensaje de al menos 10 caracteres.';
  }
};

function showError(field, message) {
  const error = document.getElementById(`error-${field.name}`);
  error.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateField(field) {
  const message = rules[field.name](field.value);
  showError(field, message);
  return message === '';
}

// Valida al salir de cada campo y limpia el error al corregirlo
Object.keys(rules).forEach((name) => {
  const field = form.elements[name];
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = '';

  const fields = Object.keys(rules).map((name) => form.elements[name]);
  const invalid = fields.filter((field) => !validateField(field));

  if (invalid.length > 0) {
    invalid[0].focus(); // lleva el foco al primer campo con error
    return;
  }

  // Sin servidor: solo se confirma en pantalla, no se envía ni se guarda nada
  status.textContent = 'Mensaje validado correctamente. Gracias por escribir.';
  form.reset();
  fields.forEach((field) => field.removeAttribute('aria-invalid'));
});
