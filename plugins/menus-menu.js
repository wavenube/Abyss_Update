const worker_1 = require("../core/worker");
const date_fns_tz_1 = require("date-fns-tz");
const baileys_1 = require("baileys");
const functions_1 = require("../lib/functions/functions");

const images = [
    'https://i.pinimg.com/564x/11/46/fe/1146fe6e189dc73761726e566dff8197.jpg',
    'https://i.pinimg.com/564x/ef/41/75/ef4175b23ebf5e287c4750cf242fe41c.jpg',
    'https://i.pinimg.com/564x/eb/0a/44/eb0a449b2b781f8f90ad8db0b654f500.jpg',
    'https://i.pinimg.com/564x/49/23/1b/49231bb54cc8b0162a3ba2642364fa8f.jpg',
    'https://i.pinimg.com/564x/11/85/e4/1185e4531c367b3fd144c35654262202.jpg',
    'https://i.pinimg.com/736x/5c/36/dc/5c36dc3ffbc2e59952a75ec86474d677.jpg',
    'https://i.pinimg.com/564x/aa/8f/04/aa8f0428c7f3ade4ce1395ec2ff553b9.jpg'
];

const fcontact = {
    key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: (0, functions_1.getRandom)(23)
    },
    message: {
        contactMessage: {
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid={WAID}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
    },
    participant: '0@s.whatsapp.net'
};

const facts = [
    "toca el boton de abajo para ver los comandos",
    'no tengo imaginación',
    'sabes qué hacer',
    '/help',
    'usa --help para ver el estado de un comando'
];

function filter(map, categoryFilter, descriptionFilter) {
    const result = new Map();
    for (const [key, command] of map) {
        if (command.hide)
            continue;
        if (categoryFilter && command.category !== categoryFilter)
            continue;
        if (descriptionFilter && (!command.description || !command.description.includes(descriptionFilter)))
            continue;
        result.set(key, command);
    }
    return result;
}

const IcommandMap = filter(new Map(worker_1.Cache.commandCache.entries()));
const legacyMap = Array.from(IcommandMap.values()).reduce((acc, cmd) => {
    acc[cmd.category] = acc[cmd.category] || [];
    acc[cmd.category].push(`*${cmd.name}* - ${cmd.description}`);
    return acc;
}, {});

const timeOfDay = ['Buenos días ☀', 'Buenas tardes 🏝', 'Buenas noches 🌙'];

function getTime(timeZone) {
    const now = new Date();
    const hour = (0, date_fns_tz_1.toZonedTime)(now, timeZone).getHours();
    return timeOfDay[Math.floor(hour / 8)];
}

function getCommands() {
    return Object.entries(legacyMap).map(([category, commands]) => `
╭───❏ ${category} ❏
│
│ ${commands.join('\n│ ')}
╰────────────────
`).join('\n').trim();
}

function replace(text, m, conn) {
    const placeholderMap = new Map([
        ['@tag', (m) => `@${m.sender.split("@")[0]}`],
        ['@getTime', () => getTime('America/Mexico_City')],
        ['@commands', () => getCommands()]
    ]);
    const pattern = new RegExp([...placeholderMap.keys()].map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
    return text.replace(pattern, (match) => {
        const replacer = placeholderMap.get(match);
        return replacer ? replacer(m, conn) : match;
    });
}

module.exports = {
    name: 'menu',
    description: 'menú de comandos',
    hide: true,
    async handle(conn, m, { prefix }) {
        const settings = worker_1.Database.setting(conn.decodeJid(conn.user.id));
        const waid = m.key.fromMe ? (conn.user.id.split(":")[0] + '@s.whatsapp.net' || conn.user.id) : (m.key.participant || m.key.remoteJid).split('@')[0];
        fcontact.message.contactMessage.vcard = fcontact.message.contactMessage.vcard.replace(/{WAID}/g, waid);
        const commonText = `
╭────❏ MENU ❏
│
│ Bienvenido
│ @${m.sender.split("@")[0]}
│
│ ${(0, functions_1.pickRandom)(facts)}
│
╰────────────────
`;
        if (!settings.legacyMenu) {
            const sections = Array.from(IcommandMap.values()).reduce((acc, cmd) => {
                if (!acc[cmd.category]) {
                    acc[cmd.category] = {
                        title: `${cmd.category}`,
                        rows: []
                    };
                }
                acc[cmd.category].rows.push({
                    title: cmd.name,
                    description: cmd.description,
                    id: `${prefix}${cmd.name}`
                });
                return acc;
            }, {});
            const buttons = [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: "（陰液ホ）𝚌𝚘𝚖𝚊𝚗𝚍𝚘𝚜",
                        sections: Object.values(sections)
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "（位ぐワ） 𝚐𝚒𝚝𝚑𝚞𝚋",
                        merchant_url: "https://www.github.com/skidy89",
                        url: "https://www.github.com/skidy89"
                    })
                }
            ];
            const image = await (0, baileys_1.prepareWAMessageMedia)({
                image: {
                    url: settings.menuImage.length > 0 ? (0, functions_1.pickRandom)(settings.menuImage) : (0, functions_1.pickRandom)(images),
                }
            }, { upload: conn.waUploadToServer });
            const messageContent = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: baileys_1.proto.Message.InteractiveMessage.create({
                            body: baileys_1.proto.Message.InteractiveMessage.Body.create({ text: commonText }),
                            footer: baileys_1.proto.Message.InteractiveMessage.Footer.create({ text: getTime('America/Mexico_City') }),
                            header: baileys_1.proto.Message.InteractiveMessage.Header.create({
                                imageMessage: image.imageMessage,
                                hasMediaAttachment: true
                            }),
                            nativeFlowMessage: baileys_1.proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons }),
                            contextInfo: { mentionedJid: [m.sender] }
                        })
                    }
                }
            };
            const message = (0, baileys_1.generateWAMessageFromContent)(m.chat, messageContent, { userJid: m.sender, quoted: fcontact });
            await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
        }
        else {
            let text = commonText + getCommands();
            if (settings.customMenu) {
                text = replace(settings.customMenu, m, conn);
            }
            await conn.sendMessage(m.chat, {
                image: { url: settings.menuImage.length > 0 ? (0, functions_1.pickRandom)(settings.menuImage) : (0, functions_1.pickRandom)(images) },
                caption: text,
                mentions: [m.sender]
            }, { quoted: fcontact });
        }
    }
};
