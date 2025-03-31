import * as net from 'net';
import { MessageType } from '../types/messageType.js';
/**
 * Class that represents a message server
 */
export class MessageServer {
  private server: net.Server;
  private clients: net.Socket[] = []; 
  constructor (private port: number) {
    this.server = net.createServer( { allowHalfOpen: true }, (socket) => {
      console.log('Client connected');
      this.clients.push(socket); 
      socket.on('data', (data) => {
        try {
          const message: MessageType = JSON.parse(data.toString());
          console.log('Message received:', message);
          
          console.log("Numero de usuarios: ", this.clients.length);
          this.clients.forEach((client) => {
            if (client !== socket) {
              const message_to_send = {
                client_name: message.client_name,
                message: message.message
              };
              client.write(JSON.stringify(message_to_send) + '\n');
            }
          });
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
      socket.on('end', () => {
        console.log('Client disconnected');
        this.clients = this.clients.filter((client) => client !== socket);
      });
      socket.on('error', (err) => {
        console.error('Error in the socket:', err);
        this.clients = this.clients.filter((client) => client !== socket);
      });
    });
    this.server.listen(this.port, () => {
      console.log('Server listening on port', this.port);
    });
  }
}