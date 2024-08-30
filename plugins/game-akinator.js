import fetch from 'node-fetch';

let sessions = {};  // Para almacenar las sesiones activas de Akinator

const handler = async (m, { conn, usedPrefix }) => {
    const chatId = m.chat;
    
    if (!sessions[chatId]) {
        // Si no hay una sesión activa, inicia una nueva
        let response = await fetch(`https://api.akinator.com/session/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "language": "es", // Cambiar a "en" para inglés u otros idiomas disponibles
                "mode": "character"
            })
        });

        let sessionData = await response.json();
        sessions[chatId] = sessionData;

        await conn.sendMessage(m.chat, { text: `🤖 *Akinator* ha iniciado.\n\n${sessionData.question}\n\n*Responde:* Sí, No, Probablemente, No sé, o No realmente.` }, { quoted: m });
    } else {
        // Si hay una sesión activa, enviar la respuesta del usuario y continuar
        let userResponse = m.text.toLowerCase();

        // Mapeo de respuestas del usuario a los valores que la API entiende
        let answersMap = {
            "sí": 0,
            "no": 1,
            "no sé": 2,
            "probablemente": 3,
            "no realmente": 4
        };

        let answer = answersMap[userResponse];
        if (answer === undefined) {
            await conn.sendMessage(m.chat, { text: 'Responde con: Sí, No, Probablemente, No sé, o No realmente.' }, { quoted: m });
            return;
        }

        let session = sessions[chatId];

        let response = await fetch(`https://api.akinator.com/session/${session.session}/step`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "step": session.step,
                "answer": answer
            })
        });

        let sessionData = await response.json();

        // Actualizar la sesión con la nueva información
        session.step = sessionData.nextStep;
        session.question = sessionData.question;

        if (sessionData.isGuessAvailable) {
            // Akinator adivinó el personaje
            await conn.sendMessage(m.chat, { text: `🤖 *Akinator* ha adivinado: ${sessionData.guess}\n\n¿Adiviné correctamente? Responde con Sí o No.` }, { quoted: m });
            delete sessions[chatId];  // Finaliza la sesión
        } else {
            // Akinator hace otra pregunta
            await conn.sendMessage(m.chat, { text: `🤖 *Akinator*: ${sessionData.question}\n\n*Responde:* Sí, No, Probablemente, No sé, o No realmente.` }, { quoted: m });
        }
    }
};

handler.command = /^(akinator|aki)$/i;  // El comando se activa con "akinator" o "aki"
export default handler;
