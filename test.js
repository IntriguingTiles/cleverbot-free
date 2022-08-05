const cleverbot = require("./index.js");


async function go() {
    let retries = 0;

    while (retries < 5) {
        try {
            let response = await cleverbot("Hi.");
            console.log(`Response: ${response}`);
            if (!response) process.exit(1);
            response = await cleverbot("Goodbye.", ["Hi.", response]);
            console.log(`Response: ${response}`);
            if (!response) process.exit(1);
            process.exit(0);
        } catch (err) {
            retries++;
            console.error(err);
        }
    }

    console.error("Exceeded retry limit.");
    process.exit(1);
}

go();