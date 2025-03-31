import * as net from 'net';
import { FunkoCollection } from './cFunkoManager.js';
import { RequestType } from '../types/requestType.js';
import { RespondType } from '../types/respondType.js';


export class FunkoServer {
  private server: net.Server;
  private collection: FunkoCollection;

  constructor(private port: number) {
    this.collection = new FunkoCollection(''); // Initialize the collection
    this.server = net.createServer( { allowHalfOpen: true }, (socket) => {  
      console.log('Client connected');
      let request_data = '';
      socket.on('data', (data) => {
        request_data += data.toString();
        if (request_data.endsWith('\n')) {
          socket.emit('request', request_data.trim()); // Emit the request event
          request_data = ''; // Reset the request data
        }
      });
      socket.on("request", async (data: string) => {
        try {
          const request: RequestType = JSON.parse(data);
          console.log('Request received:', request);
          this.collection = new FunkoCollection(request.username);
          let response: RespondType = { type: request.type, success: false };
          switch (request.type) {
            case 'add': {
              if (request.funkos) { // Check if the request has funkos
                this.collection.addFunko(request.funkos[0]);
                response.success = true;
              }
              break;
            }
            case 'remove': {
              if (request.funkoid !== undefined) { // Check if the request has a funko id
                this.collection.removeFunko(request.funkoid);
                response.success = true;
              }
              break;
            }
            case 'modify': {
              if (request.funkos) { // Check if the request has funkos
                this.collection.modifyFunko(request.funkos[0]);
                response.success = true;
              }
              break;
            }
            case 'list': {
              const funkos = await this.collection.listFunkos(); // usamos await para esperar a que se resuelva la promesa
              response.success = true;
              response.funkos = funkos;
              
              break;
            }
            case 'show': {
              if (request.funkoid !== undefined) { // Check if the request has a funko id
                const funko = await this.collection.showFunko(request.funkoid); // usamos await para esperar a que se resuelva la promesa
                if (funko !== undefined && funko !== null) {
                  response.success = true;
                  response.funkos = [funko];
                }
              }
              break;
            }
            default: {
              console.log('Invalid request type');
            }
          }
          socket.write(JSON.stringify(response) + '\n');
        } catch (error) {
          console.error('Error processing request:', error);
          socket.write(JSON.stringify({ type: 'error', success: false }) + '\n');

        } finally {
          socket.end();
          console.log('Client disconnected');
        }
      });
      socket.on('error', (err) => {
        console.error('Socket error:', err);
      });

    });
    this.server.listen(this.port, () => {
      console.log('Server listening on port', this.port);
    });

  }
}