import { MessageServer } from "../modi/cServer.js";

const port = 60300;
const server = new MessageServer(port);
console.log('Server listening on port', port);
