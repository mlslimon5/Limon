// 🔹 ১. Require modules (সবার আগে এটা)
const fs = require("fs")
const path = require("path")

// 🔹 ২. Commands store (Map ব্যবহার করা ভালো)
const commands = new Map()

// 🔹 ৩. Commands load function
const loadCommands = () => {
    const files = fs.readdirSync(path.join(__dirname, "cmds"))

    for (let file of files) {
        if (file.endsWith(".js")) {
            const cmd = require(`./cmds/${file}`)
            commands.set(cmd.name, cmd)
        }
    }
}

// 🔹 ৪. Command handle function
const handleCommand = async (sock, msg, text) => {
    const args = text.slice(1).trim().split(/ +/)
    const cmdName = args.shift().toLowerCase()

    if (commands.has(cmdName)) {
        try {
            await commands.get(cmdName).execute(sock, msg, args)
        } catch (err) {
            console.log("Command Error:", err)
        }
    }
}

// 🔹 ৫. Export (শেষে)
module.exports = {
    loadCommands,
    handleCommand
                             }
