// Selección de elementos del DOM
const formulario = document.querySelector("#formulario");
const campoNombre = document.querySelector("#nombre");
const campoCorreo = document.querySelector("#correo");
const campoCodigo = document.querySelector("#codigo");
const campoEscuela = document.querySelector("#escuela");
const tabla = document.querySelector("#tabla");
const lista = document.querySelector("#lista");
const contador = document.querySelector("#contador");
const mensajeVacio = document.querySelector("#vacio");

// Muestra un mensaje de error junto a un campo (sin alert)
function mostrarError(idError, mensaje, campo) {
  document.querySelector(idError).textContent = mensaje;
  if (campo) campo.classList.add("invalido");
}

// Borra todos los mensajes de error previos
function limpiarErrores() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  document.querySelectorAll(".invalido").forEach((c) => c.classList.remove("invalido"));
}

// Valida el formulario; devuelve true si todo es correcto
function validarFormulario() {
  limpiarErrores();
  let valido = true;

  if (campoNombre.value.trim() === "") {
    mostrarError("#error-nombre", "Ingresa tus nombres y apellidos.", campoNombre);
    valido = false;
  }

  const correo = campoCorreo.value.trim();
  const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo === "") {
    mostrarError("#error-correo", "Ingresa tu correo institucional.", campoCorreo);
    valido = false;
  } else if (!formatoCorreo.test(correo)) {
    mostrarError("#error-correo", "El correo debe tener '@' y un dominio válido.", campoCorreo);
    valido = false;
  }

  const codigo = campoCodigo.value.trim();
  if (codigo === "") {
    mostrarError("#error-codigo", "Ingresa tu código de estudiante.", campoCodigo);
    valido = false;
  } else if (!/^\d{8}$/.test(codigo)) {
    mostrarError("#error-codigo", "El código debe ser numérico y tener exactamente 8 dígitos.", campoCodigo);
    valido = false;
  }

  if (campoEscuela.value === "") {
    mostrarError("#error-escuela", "Selecciona tu escuela profesional.", campoEscuela);
    valido = false;
  }

  if (document.querySelectorAll('input[name="taller"]:checked').length === 0) {
    mostrarError("#error-talleres", "Selecciona al menos un taller.");
    valido = false;
  }

  return valido;
}

// Actualiza el contador y muestra u oculta la tabla según haya inscritos
function actualizarContador() {
  const total = lista.children.length;
  contador.textContent = total;
  tabla.hidden = total === 0;
  mensajeVacio.hidden = total !== 0;
}

// Crea una fila nueva en la tabla con los datos del participante
function agregarParticipante(nombre, escuela, talleres, codigo) {
  const fila = document.createElement("tr");

  const celdaNombre = document.createElement("td");
  celdaNombre.textContent = nombre;

  const celdaEscuela = document.createElement("td");
  celdaEscuela.textContent = escuela;

  const celdaTalleres = document.createElement("td");
  celdaTalleres.textContent = talleres.join(", ");

  const celdaCodigo = document.createElement("td");
  celdaCodigo.textContent = codigo;


  const celdaAccion = document.createElement("td");
  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "btn-eliminar";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", () => {
    fila.remove();
    actualizarContador();
  });
  celdaAccion.append(botonEliminar);

  // Etiquetas para mostrar cada dato en la vista de celular
  celdaNombre.dataset.label = "Nombre";
  celdaEscuela.dataset.label = "Escuela";
  celdaTalleres.dataset.label = "Talleres";
  celdaCodigo.dataset.label = "Código";

  fila.append(celdaNombre, celdaEscuela, celdaTalleres, celdaCodigo, celdaAccion);
  lista.append(fila);
  actualizarContador();
}

// Evento principal: validar y registrar al enviar el formulario
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!validarFormulario()) return;

  const talleres = Array.from(
    document.querySelectorAll('input[name="taller"]:checked')
  ).map((t) => t.value);

  agregarParticipante(campoNombre.value.trim(), campoEscuela.value, talleres, campoCodigo.value.trim());
  formulario.reset();
  campoNombre.focus();
});

// Estado inicial
actualizarContador();
