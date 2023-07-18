#!/usr/bin/env node
console.log(`Process ID: ${process.pid}`);
process.on("SIGHUP", () => console.log("Received: SIGHUP"));
process.on("SIGINT", () => console.log('Received: SIGNINT'));

setTimeout(() => {}, 5 * 60 * 1000) // to keep the process alive
