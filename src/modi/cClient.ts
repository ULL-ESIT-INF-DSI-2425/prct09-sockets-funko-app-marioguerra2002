import * as net from 'net';
import * as readline from 'readline';
import { MessageType } from '../types/messageType.js';
/**
 * Class that represents a message server
 */
export class MessageClient {
  private socket: net.Socket;
  private username: string = '';
  private rl: readline.Interface;

  constructor(private serverHost: string, private serverPort: number) {
    this.socket = new net.Socket();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.socket.connect(serverPort, serverHost, () => {
      console.log('Connected to server on port', serverPort);
      this.rl.question('Enter your username: ', (username: string) => {
        this.username = username;
        this.sendMessage();
      });
    });
    // escuchamos los mensajes que envía el servidor
    this.socket.on('data', (data) => {
      try {
        const message: MessageType = JSON.parse(data.toString());
        
        console.log(message.client_name + ': ' + message.message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    this.socket.on('error', (error) => {
      console.error('Error in conection:', error);
    });
    this.socket.on('end', () => {
      console.log('Connection ended');
      this.rl.close();
    });
    
  }
  private sendMessage() {
    this.rl.on('line', (messageContent: string) => {
      const message: MessageType = { 
        client_name: this.username,
        message: messageContent.trim()
      };
      if (message.message !== '') {
        this.socket.write(JSON.stringify(message) + '\n');
      }
    });
  }

}

