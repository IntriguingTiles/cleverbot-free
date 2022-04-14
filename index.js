const superagent = require("superagent");
const md5 = require("md5");

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36";

let cookies;
let cbsid;
let xai;
let lastResponse;
let lastCookieUpdate = 0;

/**
 * Sends a mesasage to Cleverbot
 * @param {string} stimulus The message to be sent
 * @param {string[]?} context An array of previous messages and responses
 * @param {string?} language The language of the message (null for auto detect)
 * @returns {Promise<string>} The response
 */
module.exports = async (stimulus, context = [], language) => {
    const _context = context.slice(); // clone array to prevent subsequent calls from modifying it

    if (cookies == null || Date.now() - lastCookieUpdate >= 86400000) {
        // we must get the XVIS cookie before we can make requests to the API
        const date = new Date();
        const req = await superagent.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${date.getFullYear()}${date.getMonth().toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`).set("User-Agent", userAgent);
        cookies = req.header["set-cookie"]; // eslint-disable-line require-atomic-updates
        lastCookieUpdate = Date.now();
    }

    // why, cleverbot, why do you do need me to do this
    let payload = `stimulus=${escape(stimulus).includes("%u") ? escape(escape(stimulus).replace(/%u/g, "|")) : escape(stimulus)}&`;

    // we're going to assume that the first item in the array is the first message sent
    const reverseContext = _context.reverse();

    for (let i = 0; i < _context.length; i++) {
        // we're going to assume that the context hasn't been escaped
        payload += `vText${i + 2}=${escape(reverseContext[i]).includes("%u") ? escape(escape(reverseContext[i]).replace(/%u/g, "|")) : escape(reverseContext[i])}&`;
    }

    payload += `${language ? `cb_settings_language=${language}&` : ""}cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`;

    payload += md5(payload.substring(7, 33));

    for (let i = 0; i < 15; i++) {
        try {
            const req = await superagent.post(`https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI${cbsid ? `&out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsid}&xai=${xai}&ns=2&al=&dl=&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&` : ""}`)
                .timeout({
                    response: 10000,
                    deadline: 60000,
                })
                .set("Cookie", `${cookies[0].split(";")[0]}; _cbsid=-1`)
                .set("User-Agent", userAgent)
                .type("text/plain")
                .send(payload);

            cbsid = req.text.split("\r")[1];
            xai = `${cbsid.substring(0, 3)},${req.text.split("\r")[2]}`;
            lastResponse = req.text.split("\r")[0];
            return lastResponse;
        } catch (err) {
            if (err.status === 503) {
                // retry after a bit
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                throw err;
            }
        }
    }

    throw "Failed to get a response after 15 tries";
};
