const superagent = require("superagent");
const md5 = require("md5");

let cookies;

/**
 * Sends a mesasage to Cleverbot
 * @param {string} stimulus The message to be sent
 * @param {string[]} [context] An array of previous messages and responses
 * @returns {Promise<string>} The response
 */
module.exports = async (stimulus, context = []) => {
    if (cookies == null) {
        // we must get the XVIS cookie before we can make requests to the API
        const req = await superagent.get("https://www.cleverbot.com/");
        cookies = req.header["set-cookie"]; // eslint-disable-line require-atomic-updates
    }

    let payload = `stimulus=${stimulus}&`;

    // we're going to assume that the first item in the array is the first message sent
    const reverseContext = context.reverse();

    for (let i = 0; i < context.length; i++) {
        payload += `vText${i + 2}=${reverseContext[i]}&`;
    }

    payload += "cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=";

    payload += md5(payload.substring(7, 33));

    const req = await superagent.post("https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI")
    .set("Cookie", cookies)
    .type("text/plain")
    .send(payload);

    return decodeURIComponent(req.header["cboutput"]);
};