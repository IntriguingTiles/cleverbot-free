const superagent = require("superagent");
const md5 = require("md5");
const userAgens = require("user-agents")

let cookies;

/**
 * Sends a mesasage to Cleverbot
 * @param {string} stimulus The message to be sent
 * @param {string[]?} context An array of previous messages and responses
 * @param {string?} language The language of the message (null for auto detect)
 * @returns {Promise<string>} The response
 */
module.exports = async (stimulus, context = [], language) => {
    const _context = context.slice(); // clone array to prevent subsequent calls from modifying it

    if (cookies == null) {
        // we must get the XVIS cookie before we can make requests to the API
        const req = await superagent.get("https://www.cleverbot.com/").set("User-Agent", userAgens.toString());
        cookies = req.header["set-cookie"]; // eslint-disable-line require-atomic-updates
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

    const req = await superagent.post("https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI")
        .timeout({
            response: 5000,
            deadline: 60000,
        })
        .set("Cookie", cookies)
        .set("User-Agent", userAgens.toString())
        .type("text/plain")
        .send(payload);

    return decodeURIComponent(req.header["cboutput"]);
};
