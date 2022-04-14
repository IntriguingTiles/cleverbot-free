const cleverbot = require("./index.js");


async function go() {
    try {
        let response = await cleverbot("Hi.");
        console.log(`Response: ${response}`);
        if (!response) process.exit(1);
        response = await cleverbot("Goodbye.");
        console.log(`Response: ${response}`);
        if (!response) process.exit(1);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

go();