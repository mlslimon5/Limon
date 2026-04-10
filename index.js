const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const { loadCommands, handleCommand } = require("./commandHandler")
const settings = require("./settings")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        auth: state,
        version
    })

    sock.ev.on("creds.update", saveCreds)

    // 🔐 Pair Code System
    if (!sock.authState.creds.registered) {
        const phoneNumber = "8801XXXXXXXXX" // 👉 নিজের নাম্বার দাও
        const code = await sock.requestPairingCode(phoneNumber)
        console.log("Your Pair Code:", code)
    }

    // 📦 Load Commands
    loadCommands()

    // 💬 Message Listener
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const sender = msg.key.participant || msg.key.remoteJid
        const botNumber = sock.user.id

        const text = msg.message.conversation || ""

        // 👉 Command System
        if (text.startsWith(settings.prefix)) {
            handleCommand(sock, msg, text)
        }

        // 🚨 AntiBot System
        if (settings.antiBot && from.endsWith("@g.us")) {
            try {
                const metadata = await sock.groupMetadata(from)
                const participants = metadata.participants

                const isAdmin = participants.find(p => p.id === sender)?.admin
                const isOwner = sender === settings.ownerNumber
                const isBotSelf = sender === botNumber

                // ✅ bypass
                if (isAdmin || isOwner || isBotSelf) return

                // 🤖 detect bot
                const isBot =
                    msg.key.id.startsWith("BAE5") ||
                    msg.key.id.startsWith("3EB0") ||
                    sender.includes("bot")

                if (!isBot) return

                // ❌ Delete message
                await sock.sendMessage(from, { delete: msg.key })

                // ⚠️ Warning system
                if (!settings.warnings[sender]) {
                    settings.warnings[sender] = 0
                }

                settings.warnings[sender]++

                let warn = settings.warnings[sender]

                await sock.sendMessage(from, {
                    text: `⚠️ @${sender.split("@")[0]} Bot detected!\nWarning: ${warn}/3`,
                    mentions: [sender]
                })

                // 👢 Kick after 3 warnings
                if (warn >= 3 && settings.antiBotKick) {
                    await sock.groupParticipantsUpdate(from, [sender], "remove")

                    await sock.sendMessage(from, {
                        text: `👢 @${sender.split("@")[0]} removed`,
                        mentions: [sender]
                    })

                    delete settings.warnings[sender]
                }

            } catch (err) {
                console.log("AntiBot Error:", err)
            }
        }
    })
}

startBot()
