import { generateWAMessageFromContent } from "baileys";

const handler = async (m, { conn }) => {
    // Mensaje de bienvenida
    const welcomeText = "¡Bienvenido al menú de lista! Selecciona una opción para continuar.";

    // Datos de ejemplo para las secciones del menú
    const sections = [
        {
            title: "Categoría 1",
            rows: [
                { title: "Comando 1", description: "Descripción del comando 1", rowId: "!comando1" },
                { title: "Comando 2", description: "Descripción del comando 2", rowId: "!comando2" },
            ]
        },
        {
            title: "Categoría 2",
            rows: [
                { title: "Comando 3", description: "Descripción del comando 3", rowId: "!comando3" },
                { title: "Comando 4", description: "Descripción del comando 4", rowId: "!comando4" },
            ]
        }
    ];

    // Configuración del mensaje interactivo
    const listMessage = {
        text: welcomeText, // Texto de bienvenida
        footer: "Selecciona una opción",
        title: "Menú Interactivo",
        buttonText: "Ver opciones",
        sections
    };

    // Genera y envía el mensaje
    const message = generateWAMessageFromContent(m.chat, { listMessage }, { quoted: m });
    await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
};

// Configuración del comando
handler.help = ['menu'];
handler.tags = ['general'];
handler.command = /^(menu)$/i;

export default handler;
