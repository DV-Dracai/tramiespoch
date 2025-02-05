const API_KEY = 'AIzaSyCkutiAu2JLXXQ21cVLu0KdY23LCynUDvc';

const logoutBtn = document.getElementById("logout-btn");
// Obtener el elemento del overlay
const modalOverlay = document.getElementById("modal-overlay");

//Todo esto se es para el inicio de sesion
const verificarSesion = async() => {
    try {
        const response = await fetch("/TramiESPOCH/check_session.php");
        const result = await response.json();

        console.log("📡 Verificando sesión en PHP:", result); // 🔹 Depuración en consola

        if (result.authenticated) {
            localStorage.setItem("user", JSON.stringify(result.user)); // 🔹 Guardar usuario en localStorage
            console.log("✅ Usuario autenticado en PHP:", result.user);
            closeLoginModal();
            logoutBtn.style.display = "block"; // 🔹 Mostrar botón de logout
            console.log("✅ Botón de logout activado");
        } else {
            console.warn("🔓 Sesión no válida en PHP. Revisando localStorage...");

            // 🔹 Si en PHP no está autenticado, verificamos en localStorage
            const localUser = localStorage.getItem("user");
            if (localUser) {
                console.log("⚠️ PHP no reconoce sesión, pero en localStorage hay usuario:", localUser);
                closeLoginModal();
                logoutBtn.style.display = "block"; // 🔹 Mostrar botón de logout como respaldo
            } else {
                console.warn("❌ No hay sesión válida en PHP ni en localStorage.");
                localStorage.removeItem("user"); // 🔹 Asegurar que no haya datos erróneos
                openLoginModal();
                logoutBtn.style.display = "none"; // 🔹 Ocultar botón de logout
            }
        }
    } catch (error) {
        console.error("❌ Error verificando sesión:", error);
        localStorage.removeItem("user");
        openLoginModal();
        logoutBtn.style.display = "none";
    }
};

// 🔹 Función para cerrar el modal de login correctamente
const closeLoginModal = () => {
    const loginModal = document.getElementById("login-modal");
    loginModal.style.display = "none";
    modalOverlay.classList.remove("show");
};

// 🔹 Función para abrir el modal de login
const openLoginModal = () => {
    const loginModal = document.getElementById("login-modal");
    loginModal.style.display = "block";
    modalOverlay.classList.add("show"); // Mostrar fondo oscuro
};

// 🔹 Evento para cerrar sesión
logoutBtn.addEventListener("click", async() => {
    const confirmar = confirm("¿Estás seguro de que quieres cerrar sesión?");
    if (!confirmar) return;

    localStorage.removeItem("user");
    await fetch("/TramiESPOCH/logout.php", { method: "POST" });
    alert("Has cerrado sesión.");
    window.location.reload();
});

//la funcion que tiene que ver con todo el logueo
document.addEventListener("DOMContentLoaded", async() => {
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegister = document.getElementById("show-register");
    verificarSesion();

    const openRegisterModal = () => {
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    };

    // 🔹 Evento para abrir la ventana de registro
    showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("📌 Abriendo modal de registro...");
        openRegisterModal();
    });

    // 🔹 Función para iniciar sesión con verificación
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const correo = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        console.log("📡 Enviando datos de login:", { correo, password }); // 🔍 Depuración en consola

        try {
            const response = await fetch("/TramiESPOCH/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ correo, password })
            });

            const result = await response.json();
            console.log("📩 Respuesta del servidor:", result);

            if (result.success) {
                alert("✅ Inicio de sesión exitoso. ¡Bienvenido, " + result.user + "!");
                console.log("🔹 Usuario autenticado:", result.user);

                // 🔹 Guardar usuario en localStorage
                localStorage.setItem("user", result.user);

                // 🔹 Esperar un momento antes de cerrar el modal para asegurarse de que la sesión se verifique
                setTimeout(() => {
                    closeLoginModal();
                    logoutBtn.style.display = "block";
                    console.log("✅ Botón de logout activado después del login");
                }, 500);

                verificarSesion(); // 🔹 Verifica nuevamente la sesión
            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error("❌ Error en la solicitud de login:", error);
            alert("Error de conexión con el servidor.");
        }
    });


    registerForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const id_estudiante = document.getElementById("register-id").value;
        const nombre = document.getElementById("register-name").value;
        const correo = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const cedula = document.getElementById("register-cedula").value;
        //const mensajeRegistro = document.getElementById("register-message"); // ⬅️ Agregar mensaje de error

        //mensajeRegistro.textContent = ""; // Borrar mensaje anterior

        console.log("Enviando datos de registro:", { id_estudiante, nombre, correo, password, cedula });

        try {
            const response = await fetch("/TramiESPOCH/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_estudiante,
                    nombre,
                    correo,
                    password,
                    cedula
                })
            });

            // 🔹 Verificar que la respuesta es válida JSON
            if (!response.ok) {
                throw new Error("❌ Error en la respuesta del servidor.");
            }

            const result = await response.json();
            console.log("📩 Respuesta del servidor:", result);

            // 🔹 Mostrar mensaje correcto del servidor
            alert(result.message);

            if (result.success) {
                // Cerrar el modal de registro y abrir el de login
                registerModal.style.display = "none";
                loginModal.style.display = "block";
            }
        } catch (error) {
            console.error("❌ Error en la solicitud de registro:", error);
            alert("Error de conexión con el servidor.");
        }
    });

});
//Aqui acaba el codigo para el inicio de sesion


// Función para obtener la fecha actual en formato "día de mes de año"
const getFormattedDate = () => {
    const fecha = new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
};

// Variables de flujo de conversación
let chatHistory = [];
let currentChat = null;
let step = -1;
let collectedData = {};

// Elementos del DOM
const chatList = document.getElementById('chat-list');
const chatDisplay = document.getElementById('chat-display');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat-btn');

// Crear un nuevo chat
const createNewChat = () => {
    step = -1;
    collectedData = {};
    const newChat = { id: chatHistory.length, name: `Chat ${chatHistory.length + 1}`, messages: [] };
    chatHistory.push(newChat);
    currentChat = newChat.id;
    renderChatList();
    renderCurrentChat();
};

// Renderizar la lista de chats con opciones de edición y eliminación
const renderChatList = () => {
    chatList.innerHTML = '';
    chatHistory.forEach((chat, index) => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        if (currentChat === index) chatItem.classList.add('active');
        chatItem.textContent = chat.name;

        // 📌 Crear un contenedor para las opciones
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('chat-options-container');

        // 📌 Botón ⋮ para abrir opciones
        const optionsBtn = document.createElement('button');
        optionsBtn.classList.add('chat-options-btn');
        optionsBtn.textContent = '⋮';
        optionsBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el clic cierre el menú inmediatamente
            toggleChatOptions(index);
        });

        // 📌 Menú desplegable de opciones
        const optionsMenu = document.createElement('div');
        optionsMenu.classList.add('chat-options-menu', 'hidden'); // 🔹 Se oculta por defecto
        optionsMenu.innerHTML = `
            <button onclick="editChatName(${index})">✏️ Cambiar nombre</button>
            <button onclick="deleteChat(${index})">🗑️ Eliminar</button>
        `;

        optionsContainer.appendChild(optionsBtn);
        optionsContainer.appendChild(optionsMenu);
        chatItem.appendChild(optionsContainer);

        chatItem.addEventListener('click', () => {
            currentChat = index;
            renderChatList();
            renderCurrentChat();
        });

        chatList.appendChild(chatItem);
    });
};

// Renderizar el chat actual
const renderCurrentChat = () => {
    chatDisplay.innerHTML = '';
    if (currentChat !== null) {
        const chat = chatHistory[currentChat];
        chat.messages.forEach((message) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', message.sender);
            messageDiv.textContent = message.text;
            chatDisplay.appendChild(messageDiv);
        });
    }
    chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
};

//Desde aqui es todo sobre el manejo de las conversaciones con BD
// Preguntas del chatbot para recolectar datos, diferentes tramites
let currentQuestions = []; // 🔹 Guardará las preguntas del trámite en curso

const questionsTerceraMatricula = [
    "Por favor, ingresa tu nombre completo:",
    "Ingresa tu número de cédula:",
    "¿En qué semestre estás?",
    "¿Qué materias deseas inscribir en tercera matrícula?",
    "¿Cuál es el periodo académico actual? (Ejemplo: Abril - Septiembre 2024)"
];

const questionsRetiro = [
    "Por favor, ingresa tu nombre completo:",
    "Ingresa tu número de cédula:",
    "¿En qué semestre estás?",
    "Especifica las asignaturas que deseas retirar (separadas por comas, ejemplo: Álgebra, Física, Programación):",
    "Motivo del retiro de materia:",
    "Explica el motivo por el que deseas retirar la(s) materia(s):"
];

// 📌 Mapear trámites con sus respectivas preguntas
const preguntasPorTramite = {
    "tercera matrícula": questionsTerceraMatricula,
    "retiro de materia": questionsRetiro
        // Puedes seguir agregando más trámites aquí
};


//Hasta aqui las preguntas, seguir añadiendi antes para otros tramites

// 🔹 Nueva función para obtener los trámites de la base de datos
const obtenerTramites = async() => {
    try {
        const response = await fetch("obtener_tramites.php");
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo trámites:", error);
        return []; // Devolvemos una lista vacía si hay un error
    }
};
//guardar un tramite realizado en BD por un estudiante de SOFT
const guardarTramite = async(collectedData) => {
    console.log("📌 Datos enviados a guardarTramite:", collectedData); // 🔥 Depuración

    if (!collectedData.tipo_tramite || !collectedData.descripcion || !collectedData.destinatario_nombre) {
        console.error("❌ Error: Datos insuficientes para guardar el trámite.");
        sendBotMessage("⚠️ Faltan datos esenciales para registrar el trámite.");
        return;
    }

    try {
        const response = await fetch("guardar_tramite.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(collectedData),
        });

        const resultado = await response.json();
        console.log("📡 Respuesta de guardarTramite:", resultado);

        if (resultado.success) {
            sendBotMessage("✅ Tu trámite ha sido registrado exitosamente en la base de datos.");
        } else {
            console.error("❌ Error al guardar el trámite:", resultado.error);
            sendBotMessage("⚠️ Hubo un problema al registrar tu trámite.");
        }
    } catch (error) {
        console.error("❌ Error en la solicitud a guardar_tramite.php:", error);
        sendBotMessage("⚠️ No se pudo completar el trámite. Inténtalo de nuevo más tarde.");
    }
};



//Funcion para obetener datos de BD
const obtenerDatosUsuario = async() => {
    try {
        const response = await fetch("obtener_datos.php");
        const texto = await response.text(); // 🔹 Obtiene la respuesta como texto primero

        console.log("📡 Respuesta cruda de obtener_datos.php:", texto);

        // Intenta convertirlo en JSON
        const datos = JSON.parse(texto);

        if (datos.error) {
            console.error("❌ Error obteniendo datos del usuario:", datos.error);
            return null;
        }

        console.log("✅ Datos obtenidos correctamente:", datos);
        return datos;
    } catch (error) {
        console.error("❌ Error en la solicitud a obtener_datos.php:", error);
        return null;
    }
};

//obtener perido academico mas reciente
const obtenerPeriodoAcademico = async() => {
    try {
        const response = await fetch("obtener_periodo.php");
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error obteniendo periodo académico:", data.error);
            return "Desconocido";
        }

        return data.periodo_academico;
    } catch (error) {
        console.error("❌ Error en la solicitud a obtener_periodo.php:", error);
        return "Desconocido";
    }
};



// Manejar el flujo de preguntas y respuestas
const handleDataCollection = async(userInput) => {

    // 🔹 Si estamos esperando la confirmación para usar datos guardados
    if (esperandoConfirmacionDatos) {
        if (userInput.toLowerCase() === "si") {
            collectedData = {
                nombre_estudiante: datosGuardados.nombre,
                cedula_estudiante: datosGuardados.cedula,
                carrera: datosGuardados.carrera,
                periodo_academico: datosGuardados.periodo_academico // 📌 Ahora lo guardamos directo
            };

            sendBotMessage("Perfecto, completaré tu trámite con los datos guardados. Ahora necesito algunos datos adicionales.");
            esperandoConfirmacionDatos = false; // 🔹 Desactivar confirmación

            step = 2; // 📌 Iniciar desde semestre, ya que nombre, cédula y período se tienen
            sendBotMessage(currentQuestions[step]); // 🔹 Avanzar a la siguiente pregunta
            return;
        } else if (userInput.toLowerCase() === "no") {
            sendBotMessage("Está bien, ingresa tus datos manualmente.");
            step = 0;
            sendBotMessage(currentQuestions[step]); // 🔹 Iniciar desde el principio
            esperandoConfirmacionDatos = false;
            return;
        } else {
            sendBotMessage('Por favor, responde "Sí" o "No".');
            return;
        }
    }

    if (step < currentQuestions.length) {
        switch (step) { // 🔹 Se ajusta dinámicamente al trámite
            case 0:
                collectedData.nombre_estudiante = userInput;
                break;
            case 1:
                collectedData.cedula_estudiante = userInput;
                break;
            case 2:
                collectedData.semestre = userInput;
                break;
            case 3:
                collectedData.materias = userInput;
                break;
            case 4:
                if (!collectedData.periodo_academico) {
                    collectedData.periodo_academico = await obtenerPeriodoAcademico();
                    sendBotMessage(`✅ El período académico actual es: ${collectedData.periodo_academico}`);
                } else {
                    collectedData.periodo_academico = userInput;
                }
                break;
            case 5:
                if (currentQuestions === questionsRetiro) {
                    collectedData.motivo = userInput; // 📌 Solo para "Retiro de Materia o otro que necesite ausnto"
                }
                break;
        }

        step++; // 🔹 Incrementamos `step` antes de enviar la siguiente pregunta

        if (step < currentQuestions.length) {
            sendBotMessage(currentQuestions[step]); // 🔹 Enviar la siguiente pregunta
        } else {
            // 📌 Última pregunta contestada → Configurar trámite específico
            collectedData.fecha_tramite = getFormattedDate();
            collectedData.carrera = "Ingeniería en Software"; // 🔹 Se asigna automáticamente

            if (currentQuestions === questionsRetiro) {
                collectedData.destinatario_nombre = "Coordinador de Carrera";
                collectedData.destinatario_cargo = "Coordinador(a) de la carrera de Ingeniería en Software";
                collectedData.descripcion = `Solicitud de retiro de las materias: ${collectedData.materias}. Motivo: ${collectedData.motivo}.`;
            } else if (currentQuestions === questionsTerceraMatricula) {
                collectedData.resolucion = "535.CP.2020";
                collectedData.articulos = "44, 49 y 50";
                collectedData.destinatario_nombre = "Washington Luna";
                collectedData.destinatario_cargo = "Decano de la Facultad de Informática y Electrónica";
                collectedData.descripcion = `Solicitud de tercera matrícula para las materias: ${collectedData.materias}. Periodo académico: ${collectedData.periodo_academico}.`;
            }
            if (currentQuestions === questionsTerceraMatricula) {
                collectedData.tipo_tramite = "Tercera Matricula";
            } else if (currentQuestions === questionsRetiro) {
                collectedData.tipo_tramite = "Retiro de Materia";
            } else {
                collectedData.tipo_tramite = "Desconocido";
            }
            // 🔥 Depuración para asegurarnos de que se asigna correctamente
            console.log("📌 Tipo de trámite asignado:", collectedData.tipo_tramite);
            sendBotMessage(`Gracias. Generando tu solicitud de ${currentQuestions === questionsTerceraMatricula ? "tercera matrícula" : "retiro de materia"}...`);
            generatePDF();

            guardarTramite(collectedData); // 🔹 Guardar trámite en la BD después de generar el PDF 
            step = -1; // 🔹 Reiniciar para futuros trámites
        }
    }
};

// Enviar mensaje del usuario
const sendMessage = async() => {
    const messageText = chatInput.value.trim();
    if (!messageText || currentChat === null) return;

    const chat = chatHistory[currentChat];
    chat.messages.push({ sender: 'user', text: messageText });

    renderCurrentChat();
    chatInput.value = '';

    // 🔹 Si estamos en un flujo de preguntas, continuar con la siguiente pregunta
    if (step >= 0 && step < currentQuestions.length) {
        handleDataCollection(messageText);
        return;
    }

    // 🔹 Obtener trámites desde la BD
    const tramites = await obtenerTramites();

    // 🔹 Si el usuario menciona "hacer un trámite" pero no dice cuál
    if (messageText.toLowerCase().includes("hacer un tramite") ||
        messageText.toLowerCase().includes("ayudame a realizar un tramite") ||
        messageText.toLowerCase().includes("quiero iniciar un tramite") ||
        messageText.toLowerCase().includes("necesito gestionar un tramite")) {

        sendBotMessage("¿Qué trámite deseas realizar? Puedes elegir entre:\n" + tramites.map(t => `- ${t}`).join("\n"));
        return;
    }

    // 🔹 Si la pregunta es sobre los trámites disponibles, responder con la lista
    if (messageText.toLowerCase().includes("que tramites puedes hacer") ||
        messageText.toLowerCase().includes("cuales son los tramites disponibles") ||
        messageText.toLowerCase().includes("lista de tramites")) {

        if (tramites.length > 0) {
            let mensaje = "Actualmente puedes realizar los siguientes trámites:\n";
            tramites.forEach(tramite => {
                mensaje += `- ${tramite}\n`;
            });
            sendBotMessage(mensaje);
        } else {
            sendBotMessage("Por el momento no hay trámites registrados.");
        }
        return;
    }

    // 🔹 Si el usuario menciona un trámite registrado, iniciar su proceso o pedir más información
    const tramiteEncontrado = tramites.find(t => messageText.toLowerCase().includes(t.toLowerCase()));

    if (tramiteEncontrado) {
        step = 0;
        currentQuestions = preguntasPorTramite[tramiteEncontrado.toLowerCase()];

        if (!preguntasPorTramite.hasOwnProperty(tramiteEncontrado.toLowerCase())) {
            sendBotMessage(`El trámite "${tramiteEncontrado}" aún no está configurado.`);
            return;
        }
        // 🔹 Intentamos obtener los datos del usuario
        const datosUsuario = await obtenerDatosUsuario();
        // 🔥 Depuración: Imprimir en consola qué datos se están obteniendo
        console.log("📡 Datos obtenidos de obtenerDatosUsuario():", datosUsuario);

        if (datosUsuario && datosUsuario.nombre && datosUsuario.nombre !== "Desconocido") {

            sendBotMessage(`Tengo tus datos guardados:
            - Nombre: ${datosUsuario.nombre}
            - Cédula: ${datosUsuario.cedula}
            - Carrera: ${datosUsuario.carrera}
            - Periodo Académico: ${datosUsuario.periodo_academico}
            
            ¿Quieres usarlos para este trámite? (Responde "Si" o "No")`);

            datosGuardados = datosUsuario;
            esperandoConfirmacionDatos = true;
            return;
        }

        // 🔹 Si no hay datos guardados, iniciar preguntas manualmente
        sendBotMessage(`No se encontraron datos guardados. Vamos a llenar el trámite manualmente.`);
        sendBotMessage(currentQuestions[step]);
        return;
    }

    if (messageText.toLowerCase().includes("generame otra vez el pdf")) {
        sendBotMessage("Aqui esta el PDF para que lo guardes...");
        generatePDF();
        return;
    }

    // 🔹 Si la pregunta no es sobre trámites, enviarla a Gemini sin contexto
    const context = `Responde como un asistente virtual de trámites académicos en ESPOCH, siendo el usuario un estudiante de Ingeniería en Software`;
    const botResponse = await sendMessageToGemini(messageText, context);
    sendBotMessage(botResponse);
};



// FUNCIÓN RESTAURADA: Enviar mensaje a Gemini API
const sendMessageToGemini = async(messageText, contexto = "") => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const requestData = {
        contents: [{ parts: [{ text: `${contexto} Pregunta del usuario: ${messageText}` }] }],
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();
        if (data && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "Lo siento, no pude generar una respuesta.";
        }
    } catch (error) {
        console.error("Error en la API de Gemini:", error);
        return "Ocurrió un error al comunicarse con la IA.";
    }
};

// Enviar mensaje del bot
const sendBotMessage = (message) => {
    if (currentChat !== null) {
        const chat = chatHistory[currentChat];
        chat.messages.push({ sender: 'bot', text: message });
        renderCurrentChat();
    }
};

//Hasta aqui es todo referente al flujo de conversacion

//Desde aqui se trata de las opciones de editar y eliminar chats
// Alternar el menú de opciones
function toggleChatOptions(index) {
    document.querySelectorAll('.chat-options-menu').forEach((menu, i) => {
        if (i === index) {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        } else {
            menu.style.display = 'none';
        }
    });
}


// Función para eliminar un chat
const deleteChat = (chatId) => {
    chatHistory.splice(chatId, 1);
    if (currentChat === chatId) currentChat = null;
    renderChatList();
    renderCurrentChat();
};

// Función para editar el nombre de un chat
const editChatName = (chatId) => {
    const newName = prompt("Ingrese el nuevo nombre del chat:");
    if (newName) {
        chatHistory[chatId].name = newName;
        renderChatList();
    }
};
//Hasta aqui termina las ocpiones de chats

//Desde aqui empieza para el generador de PDFS
// Generar el PDF con los datos recolectados
// 📌 Generar el PDF con los datos recolectados
const generatePDF = () => {
    if (!collectedData || Object.keys(collectedData).length === 0) {
        console.error("❌ No hay datos disponibles para generar el PDF.");
        return;
    }

    const nombreArchivo = currentQuestions === questionsTerceraMatricula ?
        "Solicitud_Tercera_Matricula.pdf" :
        "Solicitud_Retiro_Materia.pdf";

    fetch("generar_pdf.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(collectedData),
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error("❌ Error al generar el PDF:", error));
};

//Hasta aqui es todo refrente a PDFS

// Agregar eventos
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
newChatBtn.addEventListener('click', createNewChat);

// Inicializar chatbot
createNewChat();