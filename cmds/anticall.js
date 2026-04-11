const settings = require("../settings")

module.exports = {
    name: "anticall",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        if (!args[0]) {
            return sock.sendMessage(from, {
                text: `Usage:
.anticall on/off
.anticall time <seconds>`
            })
        }

        if (args[0] === "on") {
            settings.antiCall = true
            return sock.sendMessage(from, { text: "📞 AntiCall ON" })
        }

        if (args[0] === "off") {
            settings.antiCall = false
            return sock.sendMessage(from, { text: "❌ AntiCall OFF" })
        }

        if (args[0] === "time") {
            const sec = parseInt(args[1])
            if (!sec) return sock.sendMessage(from, { text: "Enter time in seconds!" })

            settings.antiCallTimeLimit = sec
            return sock.sendMessage(from, { text: `⏱️ Call limit set to ${sec}s` })
        }
    }
}
