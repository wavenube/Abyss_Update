
import fetch from 'node-fetch';
import fs from 'fs';

const handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems }) => {

  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  try {
    const datas = global;
    const img = './src/assets/images/menu/languages/es/menu.png';
    const d = new Date(new Date() + 3600000);
    const locale = 'es-ES';
    const week = d.toLocaleDateString(locale, { weekday: 'long' });
    const date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    const user = global.db.data.users[m.sender];
    const { money, joincount } = global.db.data.users[m.sender];
    const { exp, limit, level, role } = global.db.data.users[m.sender];
    const rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
    const rtotal = Object.entries(global.db.data.users).length || '0';
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
    const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const document = doc[Math.floor(Math.random() * doc.length)];

    const str = `🌟 *MENÚ PRINCIPAL* 🌟

👤 *Usuario:* ${taguser}

📅 *Fecha:* ${date}
⏰ *Uptime:* ${uptime}
🔢 *Nivel:* ${level}
🎓 *Exp:* ${exp}
🛡️ *Rango:* ${role}
📊 *Límite:* ${limit}
💰 *Dinero:* ${money}
👥 *Juegos completados:* ${joincount}
⭐ *Premium:* ${user.premiumTime > 0 ? '✅' : (isPrems ? '✅' : '❌')}

${readMore}

🌐 *Menús disponibles:*
╭───── • ◆ • ─────╮ 
├❧ _${usedPrefix}menuaudios_
├❧ _${usedPrefix}menuanimes_
├❧ _${usedPrefix}labiblia_
├❧ _${usedPrefix}grupos_
├❧ _${usedPrefix}estado_
├❧ _${usedPrefix}infobot_
├❧ _${usedPrefix}speedtest_
├❧ _${usedPrefix}donar_
├❧ _${usedPrefix}owner_
├❧ _${usedPrefix}script_
├❧ _${usedPrefix}reporte *<texto>*_
├❧ _${usedPrefix}join *<wagp_url>*_
╰───── • ◆ • ─────╯

🌐 *Información y Soporte:*
╭───── • ◆ • ─────╮
├❧ _${usedPrefix}terminosycondiciones_
╰───── • ◆ • ─────╯`;

    const pp = global.imagen1;  // Imagen predeterminada

    if (m.isGroup) {
      conn.sendMessage(m.chat, { image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net') }, { quoted: m });
    } else {
      const fkontak = { key: { participants: "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }, "participant": "0@s.whatsapp.net" };
      conn.sendMessage(m.chat, { image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net') }, { quoted: fkontak });
    }
  } catch (e) {
    conn.reply(m.chat, "Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.", m);
  }
};

handler.command = /^(prueba)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}
