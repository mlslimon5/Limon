const settings = require("../settings")

module.exports = {
    name: "antisticker",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        if (!args[0]) {
            return sock.sendMessage(from, {
                text: `Usage:
.antisticker on/off
.antisticker kick on/off`
            })
        }

        if (args[0] === "on") {
            settings.antiSticker = true
            return sock.sendMessage(from, { text: "🖼️ AntiSticker ON" })
        }

        if (args[0] === "off") {
            settings.antiSticker = false
            return sock.sendMessage(from, { text: "❌ AntiSticker OFF" })
        }

        if (args[0] === "kick") {
            if (args[1] === "on") {
                settings.antiStickerKick = true
                return sock.sendMessage(from, { text: "👢 Kick Enabled" })
            } else if (args[1] === "off") {
                settings.antiStickerKick = false
                return sock.sendMessage(from, { text: "🚫 Kick Disabled" })
            }
        }
    }
}
