const settings = require("../settings")

module.exports = {
    name: "antibot",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        if (!args[0]) {
            return sock.sendMessage(from, { 
                text: "Usage:\n.antibot on/off\n.antibot kick on/off" 
            })
        }

        if (args[0] === "on") {
            settings.antiBot = true
            return sock.sendMessage(from, { text: "✅ AntiBot ON" })
        }

        if (args[0] === "off") {
            settings.antiBot = false
            return sock.sendMessage(from, { text: "❌ AntiBot OFF" })
        }

        if (args[0] === "kick") {
            if (args[1] === "on") {
                settings.antiBotKick = true
                return sock.sendMessage(from, { text: "👢 Kick Enabled" })
            } else if (args[1] === "off") {
                settings.antiBotKick = false
                return sock.sendMessage(from, { text: "🚫 Kick Disabled" })
            }
        }
    }
              }
