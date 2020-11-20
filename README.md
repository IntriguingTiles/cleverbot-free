# cleverbot-free
Simple unofficial package to interact with the same API that the Cleverbot website uses for free.

## **Please use the official Cleverbot API as the Cleverbot developers can easily break this package at any time.**

# Usage
```js
const cleverbot = require("cleverbot-free");

// Without context
cleverbot("Hello.").then(response => /*...*/);

// With context
// Please note that context should include messages sent to Cleverbot as well as the responses
cleverbot("Bad.", ["Hi.", "How are you?"]).then(response => /*...*/);
```

**Typings included**