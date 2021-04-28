const cleverbot = require("./index.js");

cleverbot("Hi").then(response => {
    console.log(`Response: ${response}`);
    process.exit((response) ? 0 : 1);
}).catch(error => {
    console.error(error);
    process.exit(1);
});