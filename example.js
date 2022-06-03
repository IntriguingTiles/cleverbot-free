const cb = require("./index.js");
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

const context = [];

rl.on("line", async line => {
    try {
        const response = await cb(line, context);
        context.push(line);
        context.push(response);
        console.log(response);
    } catch (err) {
        console.error("Failed to get a response.", err);
    }
    rl.prompt();
});

rl.prompt();