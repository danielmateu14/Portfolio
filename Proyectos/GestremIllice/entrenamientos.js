// Clase que representa una persona con sus datos personales y entrenamientos registrados
class Persona {
  constructor(nombre, correo, altura, peso, edad) {
    this.nombre = nombre;
    this.correo = correo;
    this.altura = altura; // Altura en cm
    this.peso = peso; // Peso en kg
    this.edad = edad; // Edad en años
    this.entrenamientos = []; // Lista de entrenamientos asociados
  }

  // Agrega un entrenamiento a la lista y lo muestra en el DOM
  agregarEntrenamiento(entrenamiento) {
    this.entrenamientos.push(entrenamiento);
    this.mostrarEntrenamientoEnDOM(entrenamiento);
    actualizarTotalKilometros();
  }

  // Muestra un entrenamiento en el contenedor de entrenamientos en la página web
  mostrarEntrenamientoEnDOM(entrenamiento) {
    const contenedor = document.getElementById("contenedor-entrenamientos");
    if (!contenedor) {
      console.error("No se encontró el contenedor de entrenamientos");
      return;
    }
  
    // Crear elementos para mostrar los datos del entrenamiento
    const divEntrenamiento = document.createElement("div");
    divEntrenamiento.classList.add("entrenamiento-card");
    divEntrenamiento.setAttribute("data-fecha", entrenamiento.fechaISO);
  
    // Crear los elementos con la información del entrenamiento
    const elementos = {
      fecha: crearElemento("p", "fecha", `Fecha: ${entrenamiento.fecha}`),
      distancia: crearElemento(
        "p",
        "distancia",
        `Distancia: ${entrenamiento.distancia} km`
      ),
      tiempo: crearElemento(
        "p",
        "tiempo",
        `Tiempo: ${entrenamiento.tiempo} min`
      ),
      velocidad: crearElemento(
        "p",
        "velocidad",
        `Velocidad: ${entrenamiento.velocidad.toFixed(2)} km/h`
      ),
      nivel: crearElemento("p", "nivel", `Nivel: ${entrenamiento.nivel}`),
    };
  
    // Añadir los elementos al contenedor del entrenamiento
    Object.values(elementos).forEach((el) => divEntrenamiento.appendChild(el));
  
    // Crear botón para eliminar el entrenamiento
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.onclick = (e) => {
      e.preventDefault();
      const fecha = divEntrenamiento.getAttribute("data-fecha");
      eliminarEntrenamiento(fecha, divEntrenamiento);
    };
  
    divEntrenamiento.appendChild(btnEliminar);
  
    // Añadir foro para el entrenamiento
    const foroEntrenamiento = this.crearForoEntrenamiento();
    divEntrenamiento.appendChild(foroEntrenamiento);
  
    contenedor.appendChild(divEntrenamiento);
    if (this.entrenamientos.length > 0) {
      ocultarFormulario("sinEntrenamientos");
    }
  }

  // Crea un foro para agregar comentarios a un entrenamiento
  crearForoEntrenamiento() {
    const foroDiv = document.createElement("div");
    foroDiv.setAttribute("class", "foro-entrenamiento");

    // Título del foro
    const titulo = document.createElement("h4");
    titulo.textContent = "Comentarios del entrenamiento";

    // Campos para el nombre y comentario
    const inputNick = document.createElement("input");
    inputNick.setAttribute("type", "text");
    inputNick.setAttribute("placeholder", "Tu nombre");

    const textarea = document.createElement("textarea");
    textarea.setAttribute("placeholder", "Tu comentario");

    // Botón para agregar comentario
    const btnComentar = document.createElement("button");
    btnComentar.textContent = "Comentar";
    btnComentar.onclick = () => {
      if (inputNick.value && textarea.value) {
        const comentario = document.createElement("div");
        comentario.setAttribute("class", "comentario");
        comentario.innerHTML = `
          <strong>${inputNick.value}</strong>
          <p>${textarea.value}</p>
          <small>${new Date().toLocaleString()}</small>
        `;
        foroDiv.appendChild(comentario);
        inputNick.value = "";
        textarea.value = "";
      }
    };

    foroDiv.appendChild(titulo);
    foroDiv.appendChild(inputNick);
    foroDiv.appendChild(textarea);
    foroDiv.appendChild(btnComentar);

    return foroDiv;
  }

  // Ordena los entrenamientos según un criterio dado
  obtenerEntrenamientosOrdenados(criterio) {
    // Copia del array para no modificar el original
    const entrenamientosOrdenados = [...this.entrenamientos];
    // Ordenar según el criterio
    return entrenamientosOrdenados.sort((a, b) => {
      switch (criterio) {
        case "tiempo":
          return a.tiempo - b.tiempo;
        case "velocidad":
          return b.velocidad - a.velocidad;
        case "distancia":
          return b.distancia - a.distancia;
        default:
          return 0;
      }
    });
  }

  // Calcula el total de kilómetros registrados en los entrenamientos
  totalKilometros() {
    return this.entrenamientos.reduce(
      (total, entrenamiento) => total + entrenamiento.distancia,
      0
    );
  }
}                                                   // Fin de la clase Persona


// Clase que representa un entrenamiento individual
class Entrenamiento {
  constructor(distanciaKm, tiempoMin) {
    this.distancia = distanciaKm; // Distancia recorrida en kilómetros
    this.tiempo = tiempoMin; // Tiempo en minutos
    this.velocidad = this.calcularVelocidad(); // Velocidad calculada en km/h
    this.fecha = this.calcularFecha(); // Fecha y hora del entrenamiento
    this.nivel = this.calcularNivelEntrenamiento(); // Nivel basado en los datos del entrenamiento
  }

  // Calcula la velocidad promedio
  calcularVelocidad() {
    return this.distancia / (this.tiempo / 60);
  }

  // Determina el nivel del entrenamiento en base a parámetros
  calcularNivelEntrenamiento() {
    if (this.distancia < 4 && this.tiempo < 20 && this.velocidad > 10) {
      return "Malo";
    } else if (
      this.distancia >= 4 &&
      this.distancia <= 10 &&
      this.tiempo >= 20 &&
      this.tiempo <= 60 &&
      this.velocidad >= 10 &&
      this.velocidad <= 20
    ) {
      return "Bueno";
    } else if (this.distancia > 10 && this.tiempo > 60 && this.velocidad < 20) {
      return "Muy bueno";
    } else {
      return "Otros";
    }
  }

  // Genera la fecha actual en formato día/mes/año hora:minutos
  calcularFecha() {
    const fechaActual = new Date();
    // Guardamos la fecha en formato ISO para el filtrado
    this.fechaISO = fechaActual.toISOString().split("T")[0];

    // Formato visual para mostrar
    const dia = String(fechaActual.getDate()).padStart(2, "0");
    const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const año = fechaActual.getFullYear();
    const horas = String(fechaActual.getHours()).padStart(2, "0");
    const minutos = String(fechaActual.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  }
}                                                     // Fin de la clase Entrenamiento

// Variables globales
let persona = null; // Almacena el usuario actual

                              // Funciones auxiliares para el manejo del DOM y validaciones

// Función para ocultar todos los formularios
function ocultarTodo() {
  ocultarFormulario("loginForm");
  ocultarFormulario("formCrearPersona");
  ocultarFormulario("entrenamientos");
  ocultarFormulario("foro");
  ocultarFormulario("nosotros");
}

// Función para desplegar la página de inicio
function desplegarInicio() {
  if (!persona) {
    // Si no hay usuario, mostrar el formulario de login
    ocultarTodo();
    mostrarFormulario("loginForm");
    mostrarFormulario("foro");
    mostrarFormulario("nosotros");
  } else {
    // Si hay usuario, mostrar el contenido normal
    ocultarTodo();
    mostrarFormulario("foro");
    mostrarFormulario("nosotros");
  }
}

// Función para desplegar la página de entrenamientos
function desplegarEntrenamientos() {
  if (!persona) {
    // Si no hay usuario, redirigir al inicio
    desplegarInicio();
    return;
  }

  // Si hay usuario, mostrar entrenamientos y ocultar el resto
  ocultarTodo();
  mostrarFormulario("entrenamientos");
}

// Función para desplegar el foro
function desplegarForo() {
  ocultarTodo();
  mostrarFormulario("foro");
}

// Función para desplegar la sección de nosotros
function desplegarNosotros() {
  ocultarTodo();
  mostrarFormulario("nosotros");
}

// Función para determinar el nivel basado en los kilómetros totales
function determinarNivel(kilometros) {
  if (kilometros <= 100) {
    return "Corredor casual";
  } else if (kilometros <= 500) {
    return "Runner Pro";
  } else if (kilometros <= 1000) {
    return "Rey de la pista";
  } else {
    return "Dios del Running";
  }
}

// Función para actualizar tanto los kilómetros como el nivel
function actualizarTotalKilometros() {
  if (persona) {
    const total = persona.totalKilometros();
    const nivel = determinarNivel(total);

    // Actualizar kilómetros totales
    const elementoTotal = document.getElementById("totalKilometros");
    if (elementoTotal) {
      elementoTotal.textContent = `Total kilómetros recorridos: ${total.toFixed(
        2
      )} km`;
    }

    // Actualizar nivel
    const elementoNivel = document.getElementById("niveles");
    if (elementoNivel) {
      elementoNivel.textContent = `Nivel: ${nivel}`;
    }
  }
}

// Función para manejar la eliminación de entrenamientos
function eliminarEntrenamiento(fecha, divEntrenamiento) {
  if (confirm("¿Seguro que deseas eliminar este entrenamiento?")) {
    const index = persona.entrenamientos.findIndex(
      (e) => e.fechaISO === fecha
    );
    if (index > -1) {
      // Eliminar del array
      persona.entrenamientos.splice(index, 1);
      // Eliminar del DOM
      divEntrenamiento.remove();
      
      // Actualizar totales
      actualizarTotalKilometros();

      // Mostrar mensaje si no quedan entrenamientos
      if (persona.entrenamientos.length === 0) {
        const sinEntrenamientos = document.getElementById("sinEntrenamientos");
        if (sinEntrenamientos) {
          sinEntrenamientos.style.display = "block";
          sinEntrenamientos.innerHTML = "<p>No hay entrenamientos actualmente.</p>";
        }
      }
    }
  }
}

// Funcion que ordena y vuelve a mostrar todos los entrenamientos
function reordenarEntrenamientos(criterio) {
  if (!persona || !persona.entrenamientos.length) return;

  const contenedor = document.getElementById("contenedor-entrenamientos");
  // Ocultar el mensaje de "sin entrenamientos" si existe
  const sinEntrenamientos = document.getElementById("sinEntrenamientos");
  if (sinEntrenamientos) {
    sinEntrenamientos.style.display = "none";
  }

  // Limpiar contenedor
  contenedor.innerHTML = "";

  // Obtener entrenamientos ordenados
  const entrenamientosOrdenados = persona.obtenerEntrenamientosOrdenados(criterio);

  // Volver a mostrar todos los entrenamientos ordenados
  entrenamientosOrdenados.forEach((entrenamiento) => {
    const divEntrenamiento = document.createElement("div");
    divEntrenamiento.classList.add("entrenamiento-card");
    divEntrenamiento.setAttribute("data-fecha", entrenamiento.fechaISO);

    // Crear los elementos con la información del entrenamiento
    const elementos = {
      fecha: crearElemento("p", "fecha", `Fecha: ${entrenamiento.fecha}`),
      distancia: crearElemento(
        "p",
        "distancia",
        `Distancia: ${entrenamiento.distancia} km`
      ),
      tiempo: crearElemento(
        "p",
        "tiempo",
        `Tiempo: ${entrenamiento.tiempo} min`
      ),
      velocidad: crearElemento(
        "p",
        "velocidad",
        `Velocidad: ${entrenamiento.velocidad.toFixed(2)} km/h`
      ),
      nivel: crearElemento("p", "nivel", `Nivel: ${entrenamiento.nivel}`),
    };

    // Añadir los elementos al contenedor del entrenamiento
    Object.values(elementos).forEach((el) => divEntrenamiento.appendChild(el));

    // Crear botón para eliminar el entrenamiento
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.onclick = (e) => {
      e.preventDefault();
      const fecha = divEntrenamiento.getAttribute("data-fecha");
      eliminarEntrenamiento(fecha, divEntrenamiento);
    };

    divEntrenamiento.appendChild(btnEliminar);

    // Crear un foro para añadir comentarios sobre el entrenamiento
    const foroEntrenamiento = persona.crearForoEntrenamiento();
    divEntrenamiento.appendChild(foroEntrenamiento);

    contenedor.appendChild(divEntrenamiento);
  });
}

// Crea un elemento HTML con una clase y contenido opcional
function crearElemento(tipo, clase, texto) {
  const elemento = document.createElement(tipo);
  if (clase) elemento.classList.add(clase);
  if (texto) elemento.textContent = texto;
  return elemento;
}

// Función para validar el formato del correo electrónico
function validarFormatoCorreo(correo) {
  // Patrón: texto + @ + texto + . + texto (mínimo 2 caracteres después del punto)
  const correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return correoPattern.test(correo);
}

// Función para validar el formato de la contraseña
function validarFormatoPassword(password) {
  // Debe tener al menos:
  // - 8 caracteres
  // - Una letra minúscula
  // - Una letra mayúscula
  // - Un número
  // - Un carácter especial
  const longitudMinima = password.length >= 8;
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    longitudMinima &&
    tieneMinuscula &&
    tieneMayuscula &&
    tieneNumero &&
    tieneEspecial
  );
}

// Función que proporciona feedback específico sobre lo que falta en la contraseña
function obtenerErroresPassword(password) {
  const errores = [];

  if (password.length < 8) {
    errores.push("mínimo 8 caracteres");
  }
  if (!/[a-z]/.test(password)) {
    errores.push("una letra minúscula");
  }
  if (!/[A-Z]/.test(password)) {
    errores.push("una letra mayúscula");
  }
  if (!/[0-9]/.test(password)) {
    errores.push("un número");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errores.push('un carácter especial (!@#$%^&*(),.?":{}|<>)');
  }

  return errores.length > 0 ? "Falta: " + errores.join(", ") : "";
}

// Función que muestra un formulario identificado por su ID
function mostrarFormulario(id) {
  document.getElementById(id).style.display = "block";
}

// Función que oculta un formulario identificado por su ID
function ocultarFormulario(id) {
  document.getElementById(id).style.display = "none";
}

// Función que valida la entrada de un campo y muestra un mensaje de error si no cumple con la condición
function validarEntrada(idInput, idError, condicion, mensaje) {
  const input = document.getElementById(idInput);
  const error = document.getElementById(idError);
  if (!condicion(input.value)) {
    error.textContent = mensaje;
    error.style.display = "block";
    return false;
  }
  error.style.display = "none";
  return true;
}

// Función que da la bienvenida al usuario y ajusta la interfaz
function darBienvenida(nombre) {
  ocultarTodo();
  mostrarFormulario("listaEntrenamientos");
  mostrarFormulario("sinEntrenamientos");
  mostrarFormulario("busquedaFechas");
  mostrarFormulario("entrenamientos");
  document.getElementById("titulo").textContent = "Bienvenido, " + nombre;
  document.getElementById("titulo").style.display = "block";
  document.getElementById("acciones").style.display = "block";
  actualizarTotalKilometros();
}

                                                                //-----EVENTOS------

// Listener para el botón de crear persona
document.getElementById("btnCrearPersona").addEventListener("click", () => {
  const nombreValido = validarEntrada("nombre","errorNombre",(val) => val.trim() !== "","El nombre no puede estar vacío.");

  const passwordValido = validarEntrada("passwordRegistro","errorPassword",validarFormatoPassword,obtenerErroresPassword(document.getElementById("passwordRegistro").value));

  const correoValido = validarEntrada("correo","errorCorreo",validarFormatoCorreo, "El correo debe tener un formato válido (ejemplo@dominio.com)");

  const alturaValida = validarEntrada("altura","errorAltura",(val) => val > 0,"La altura debe ser un número positivo.");

  const pesoValido = validarEntrada("peso","errorPeso",(val) => val > 0,"El peso debe ser un número positivo.");

  const edadValida = validarEntrada("edad","errorEdad",(val) => val > 0,"La edad debe ser un número positivo.");

  if (nombreValido && passwordValido && correoValido && alturaValida && pesoValido && edadValida ) {
    persona = new Persona(
      document.getElementById("nombre").value,
      document.getElementById("correo").value,
      parseFloat(document.getElementById("altura").value),
      parseFloat(document.getElementById("peso").value),
      parseInt(document.getElementById("edad").value, 10)
    );

    guardarDatosUsuario(persona, document.getElementById("passwordRegistro").value);
    darBienvenida(persona.nombre);
  }
});

// Listener para el select de ordenamiento
document.getElementById("ordenEntrenamientos").addEventListener("change", (e) => {
  const criterio = e.target.value;
    if (criterio) {
      reordenarEntrenamientos(criterio);
    }
  });

// Listener para el botón de añadir entrenamiento
document.getElementById("btnAñadirEntrenamiento").addEventListener("click", () => {
    ocultarFormulario("acciones"); // Ocultar las acciones principales
    mostrarFormulario("formAñadirEntrenamiento"); // Mostrar el formulario de entrenamiento
  });

// Listener para guardar un entrenamiento
document.getElementById("btnGuardarEntrenamiento").addEventListener("click", () => {
    // Verificar si existe un usuario
    if (!persona) {
      alert("Primero debes crear un usuario");
      return;
    }

    // Validar los datos del entrenamiento
    const distanciaInput = document.getElementById("distancia");
    const tiempoInput = document.getElementById("tiempo");
    const distanciaValida = validarEntrada("distancia","errorDistancia",(val) => val > 0,"Debe ser un número positivo.");
    const tiempoValido = validarEntrada("tiempo","errorTiempo",(val) => val > 0,"Debe ser un número positivo.");

    // Si los datos son válidos, se crea un entrenamiento
    if (distanciaValida && tiempoValido) {
      const entrenamiento = new Entrenamiento(parseFloat(distanciaInput.value),parseInt(tiempoInput.value, 10));
      persona.agregarEntrenamiento(entrenamiento); // Agregar el entrenamiento a la persona

      // Limpiar los campos después de guardar
      distanciaInput.value = "";
      tiempoInput.value = "";

      alert("Entrenamiento añadido correctamente.");
      ocultarFormulario("formAñadirEntrenamiento"); // Ocultar el formulario
      mostrarFormulario("acciones"); // Mostrar las acciones principales
    }
  });

// Listener para borrar el usuario actual
document.getElementById("btnBorrarUsuario").addEventListener("click", () => {
  if (confirm("¿Estás seguro de que deseas borrar tu cuenta? Esta acción no se puede deshacer.")
 ) {
    localStorage.removeItem("usuarioData");
    reiniciar();
    alert("Cuenta eliminada exitosamente. Por favor, regístrate nuevamente si deseas continuar.");
  }
});

// Función para mostrar el formulario de creación de persona
function nuevoCliente() {
  mostrarFormulario("formCrearPersona");
  ocultarFormulario("loginForm");
}

// Función para reiniciar la interfaz
function reiniciar() {
  persona = null; // Resetear la persona actual
  localStorage.clear(); // Limpiar todos los datos guardados
  mostrarFormulario("loginForm"); // Mostrar el formulario de login
  ocultarFormulario("formCrearPersona"); // Mostrar el formulario de creación
  mostrarFormulario("foro"); // Mostrar el foro
  mostrarFormulario("nosotros"); // Mostrar la sección de nosotros
  ocultarFormulario("entrenamientos"); // Ocultar la lista de entrenamientos
}

//  Cambiar al tema claro y oscuro con Switch
const toggleSwitch = document.querySelector("#checkbox");
const currentTheme = localStorage.getItem("tema");

if (currentTheme) {
  document.body.classList.add(`tema-${currentTheme}`);
  if (currentTheme === "oscuro") {
    toggleSwitch.checked = true;
  }
}

toggleSwitch.addEventListener("change", function (e) {
  if (e.target.checked) {
    document.body.classList.remove("tema-claro");
    document.body.classList.add("tema-oscuro");
    localStorage.setItem("tema", "oscuro");
  } else {
    document.body.classList.remove("tema-oscuro");
    document.body.classList.add("tema-claro");
    localStorage.setItem("tema", "claro");
  }
});

// Listener Login y LocalStorage
document.getElementById("btnLogin").addEventListener("click", () => {
  const usuario = document.getElementById("usuarioLogin").value;
  const password = document.getElementById("passwordLogin").value;

  if (!validarFormatoPassword(password)) {
    alert("La contraseña no cumple con los requisitos de seguridad");
    return;
  }

  if (recuperarDatosUsuario(usuario, password)) {
    darBienvenida(usuario);
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

// Función para guardar los datos del usuario en localStorage
function guardarDatosUsuario(persona, password) {
  const datosGuardar = {
    nombre: persona.nombre,
    correo: persona.correo,
    altura: persona.altura,
    peso: persona.peso,
    edad: persona.edad,
    password: password,
    entrenamientos: persona.entrenamientos,
  };
  localStorage.setItem("usuarioData", JSON.stringify(datosGuardar));
}

// Función para recuperar los datos del usuario desde localStorage
function recuperarDatosUsuario(nombre, password) {
  const datosGuardados = localStorage.getItem("usuarioData");
  if (datosGuardados) {
    const datos = JSON.parse(datosGuardados);
    if (datos.nombre === nombre && datos.password === password) {
      // Recrear el objeto persona con los datos guardados
      persona = new Persona(
        datos.nombre,
        datos.correo,
        datos.altura,
        datos.peso,
        datos.edad
      );
      // Restaurar los entrenamientos
      datos.entrenamientos.forEach((e) => {
        const entrenamiento = new Entrenamiento(e.distancia, e.tiempo);
        persona.agregarEntrenamiento(entrenamiento);
      });
      return true;
    }
  }
  return false;
}

// Foro general
document.getElementById("btnPublicar").addEventListener("click", () => {
  const nick = document.getElementById("nickForo").value;
  const comentario = document.getElementById("comentarioForo").value;

  if (nick && comentario) {
    const divComentario = document.createElement("div");
    divComentario.setAttribute("class", "comentario");
    divComentario.innerHTML = `
      <strong>${nick}</strong>
      <p>${comentario}</p>
      <small>${new Date().toLocaleString()}</small>
    `;
    document.getElementById("comentarios").appendChild(divComentario);

    document.getElementById("nickForo").value = "";
    document.getElementById("comentarioForo").value = "";
  }
});

// Búsqueda por fechas
document.getElementById("btnBuscar").addEventListener("click", () => {
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const sinResultados = document.getElementById("sinEntrenamientos");

  if (!fechaInicio || !fechaFin) {
    alert("Por favor, selecciona ambas fechas");
    return;
  }

  if (sinResultados) {
    sinResultados.style.display = "none";
  }

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  fin.setHours(23, 59, 59);

  let hayResultados = false;

  document.querySelectorAll(".entrenamiento-card").forEach((card) => {
    const fechaEntrenamiento = new Date(card.getAttribute("data-fecha"));

    if (fechaEntrenamiento >= inicio && fechaEntrenamiento <= fin) {
      card.style.display = "block";
      hayResultados = true;
    } else {
      card.style.display = "none";
    }
  });

  if (!hayResultados && sinResultados) {
    sinResultados.style.display = "block";
    sinResultados.innerHTML =
      "<p>No hay entrenamientos en el rango de fechas seleccionado.</p>";
  }
});

// Slideshow
const imagenes = [
  "./imagenes/descarga.jpeg",
  "./imagenes/images.jpeg",
  "./imagenes/otra.jpeg",
  "./imagenes/tenis.jpeg",
];

let indiceImagen = 0;
const imagenSlideshow = document.getElementById("imagenSlideshow");

function mostrarImagenSlideshow() {
  imagenSlideshow.src = imagenes[indiceImagen];
  indiceImagen = (indiceImagen + 1) % imagenes.length;
}

// Función para verificar si el usuario está logueado
function estaLogueado() {
  return persona !== null;
}

// Comprobación de acceso a la sección de entrenamientos desde el menú
document.querySelectorAll("nav a").forEach((enlace) => {
  enlace.addEventListener("click", (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    const seccion = enlace.getAttribute("href").substring(1); // Obtener el ID de la sección

    // Validación específica para la sección de entrenamientos
    if (seccion === "entrenamientos") {
      if (!estaLogueado()) {
        alert("Debe acceder como cliente primero para ver los entrenamientos");
        return;
      }

      // Si el usuario está logueado, verificar si la sección está oculta
      const seccionEntrenamientos = document.getElementById("entrenamientos");
      if (seccionEntrenamientos.style.display === "none") {
        alert("Debe acceder como cliente primero para ver los entrenamientos");
        return;
      }
    }

    // Si pasa las validaciones o es otra sección, realizar el desplazamiento
    const elemento = document.getElementById(seccion);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth" }); // Desplazamiento suave
    }
  });
});

// Al arrancar la web se ejecuta la función
window.onload = function() {

  // Modal de bienvenida
   const modal = document.getElementById("modalBienvenida");
   modal.style.display = "block";
   document.querySelector(".close").onclick = function() {
     modal.style.display = "none";
   };
 
   // Tema guardado
   const temaGuardado = localStorage.getItem("tema");
   if (temaGuardado) {
     document.body.classList.add(`tema-${temaGuardado}`);
   }
 
   // Contenido inicial
   ocultarTodo();
   mostrarFormulario("loginForm");
   mostrarFormulario("foro"); 
   mostrarFormulario("nosotros");
 
   // Usuario guardado
   const usuarioGuardado = localStorage.getItem("usuarioData");
   if (usuarioGuardado) {
     const datos = JSON.parse(usuarioGuardado);
     if (recuperarDatosUsuario(datos.nombre, datos.password)) {
       darBienvenida(datos.nombre);
     }
   }
 
   //  Iniciar el slideshow
   setInterval(mostrarImagenSlideshow, 3000);
   mostrarImagenSlideshow();
 }
