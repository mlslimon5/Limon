const settings = require("../settings")

module.exports = {
    name: "antilink",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        if (!args[0]) {
            return sock.sendMessage(from, {
                text: `Usage:
.antilink on/off
.antilink kick on/off
.antilink warn <number>
.antilink reset`
            })
        }

        if (args[0] === "on") {
            settings.antiLink = true
            return sock.sendMessage(from, { text: "🔗 AntiLink ON" })
        }

        if (args[0] === "off") {
            settings.antiLink = false
            return sock.sendMessage(from, { text: "❌ AntiLink OFF" })
        }

        if (args[0] === "kick") {
            if (args[1] === "on") {
                settings.antiLinkKick = true
                return sock.sendMessage(from, { text: "👢 Kick Enabled" })
            } else if (args[1] === "off") {
                settings.antiLinkKick = false
                return sock.sendMessage(from, { text: "🚫 Kick Disabled" })
            }
        }

        if (args[0] === "warn") {
            const num = parseInt(args[1])
            if (!num) return sock.sendMessage(from, { text: "Enter number!" })

            settings.antiLinkWarnLimit = num
            return sock.sendMessage(from, { text: `⚠️ Warn limit set to ${num}` })
        }

        if (args[0] === "reset") {
            settings.linkWarnings = {}
            return sock.sendMessage(from, { text: "♻️ All warnings reset" })
        }
    }
}
