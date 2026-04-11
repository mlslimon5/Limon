const spamMap = new Map();
const repeatMap = new Map();

const LIMIT = 10;          // 10 বার একই/স্প্যাম
const TIME_WINDOW = 10_000; // 10 সেকেন্ড উইন্ডো

module.exports = async (sock, msg) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const chatId = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

    if (!text) return;

    const now = Date.now();

    // ----------------------------
    // 1. SAME MESSAGE TRACK
    // ----------------------------
    const key = `${chatId}:${sender}:${text}`;

    if (!repeatMap.has(key)) {
        repeatMap.set(key, { count: 1, last: now });
    } else {
        let data = repeatMap.get(key);

        if (now - data.last < 60000) { // 1 minute window
            data.count += 1;
        } else {
            data.count = 1;
        }

        data.last = now;
        repeatMap.set(key, data);

        if (data.count >= LIMIT) {
            await warnAndKick(sock, chatId, sender);
            repeatMap.delete(key);
            return;
        }
    }

    // ----------------------------
    // 2. GENERAL SPAM TRACK
    // ----------------------------
    const userKey = `${chatId}:${sender}`;

    if (!spamMap.has(userKey)) {
        spamMap.set(userKey, []);
    }

    let timestamps = spamMap.get(userKey);
    timestamps.push(now);

    // last 10 sec filter
    timestamps = timestamps.filter(t => now - t < TIME_WINDOW);
    spamMap.set(userKey, timestamps);

    if (timestamps.length >= LIMIT) {
        await warnAndKick(sock, chatId, sender);
        spamMap.delete(userKey);
    }
};


// ----------------------------
// WARNING + KICK FUNCTION
// ----------------------------
async function warnAndKick(sock, chatId, user) {
    try {
        await sock.sendMessage(chatId, {
            text: `⚠️ *AntiSpam Alert!*\n\n@${user.split("@")[0]} আপনি স্প্যাম করছেন!\nআপনাকে গ্রুপ থেকে রিমুভ করা হলো।`,
            mentions: [user]
        });

        await sock.groupParticipantsUpdate(chatId, [user], "remove");

    } catch (e) {
        console.log("Kick error:", e);
    }
                                           }
