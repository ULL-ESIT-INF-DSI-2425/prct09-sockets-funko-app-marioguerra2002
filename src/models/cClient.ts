import * as net from 'net';
import chalk from 'chalk';
import { RequestType } from '../types/requestType.js';
import { RespondType } from '../types/respondType.js';
// import { Funko } from './funko.js';
// import { FunkoCollection } from './funkocollection.js';


/**
 * Class that manages a Client of a FunkoServer that owns a FunkoCollection
 * 
 * Class FunkoClient
 */
export class FunkoClient {
  private socket: net.Socket;

  constructor(private serverHost: string, private serverPort: number) {
    this.socket = new net.Socket();
    this.socket.connect(serverPort, serverHost, () => {
      console.log(chalk.greenBright('Connected to server on port', serverPort));
    });
    this.socket.on('data', (data) => {
      try {
        const response: RespondType = JSON.parse(data.toString());
        this.handleResponse(response);
      } catch (error) {
        console.log(chalk.redBright('Error parsing response:', error));
      }
    });
    this.socket.on('error', (error) => {
      console.error(chalk.redBright('Error:', error));
    });
  }
  private handleResponse(response: RespondType): void{
    if (response.success) {
      switch (response.type) {
        case 'add':
          if(response.success) {
            console.log(chalk.green('Funko Pop successfully added!.'));
          } else {
            console.log(chalk.red('Funko already exists.'));
          }
          break;
        case 'modify':
          if(response.success) {
            console.log(chalk.green('Funko Pop successfully modified!.'));
          } else {
            console.log(chalk.red('Could not modify the funko.'));
          }
          break;
        case 'remove':
          if(response.success) {
            console.log(chalk.green('Funko Pop successfully removed from the collection!.'));
          } else {
            console.log(chalk.red('Funko is not in the collection.'));
          }
          break;
        case 'show':
          if(response.success && response.funkos && response.funkos.length > 0) {
            const funko = response.funkos[0];
            if(funko != null) {
              let marketValueColor;
              if (funko.marketValue >= 100) {
                marketValueColor = chalk.green; 
              } else if (funko.marketValue >= 50) {
                marketValueColor = chalk.yellow; 
              } else if (funko.marketValue >= 20) {
                marketValueColor = chalk.magenta; 
              } else {
                marketValueColor = chalk.red; 
              }
        
              console.log(chalk.blue.bold(`Funko with ID ${funko.name} information`));
              console.log(chalk.blue("--------------------------------------"));
              console.log(`
              ${chalk.cyan.bold("ID:")} ${funko.id}
              ${chalk.cyan.bold("Name:")} ${funko.name}
              ${chalk.cyan.bold("Description:")} ${funko.description}
              ${chalk.cyan.bold("Type:")} ${funko.type}
              ${chalk.cyan.bold("Genre:")} ${funko.genre}
              ${chalk.cyan.bold("Franchise:")} ${funko.franchise}
              ${chalk.cyan.bold("Number:")} ${funko.number}
              ${chalk.cyan.bold("Exclusive:")} ${funko.exclusive ? chalk.green("Yes") : chalk.red("No")}
              ${chalk.cyan.bold("Special Features:")} ${funko.specialFeatures || "None"}
              ${chalk.cyan.bold("Market Value:")} ${marketValueColor(`$${funko.marketValue}`)}
              `);
            }
            console.log(chalk.blue("--------------------------------------"));
          } else {
            console.log(chalk.red('Could not find funko in the collection.'));
          }
          break;
        case 'list':
          if (response.funkos && response.funkos.length > 0) {
            console.log(chalk.green.bold('FUNKO COLLECTION'));
            response.funkos.forEach((funko) => {
              if (funko != null) {
                let marketValueColor;
                if (funko.marketValue >= 50) {
                  marketValueColor = chalk.green; 
                } else if (funko.marketValue >= 30) {
                  marketValueColor = chalk.yellow;
                } else if (funko.marketValue >= 10) {
                  marketValueColor = chalk.magenta; 
                } else {
                  marketValueColor = chalk.red; 
                }
                console.log(chalk.blue('-------------------------------------\n'));
                console.log(`
                ${chalk.cyan.bold("ID:")} ${funko.id}
                ${chalk.cyan.bold("Name:")} ${funko.name}
                ${chalk.cyan.bold("Description:")} ${funko.description}
                ${chalk.cyan.bold("Type:")} ${funko.type}
                ${chalk.cyan.bold("Genre:")} ${funko.genre}
                ${chalk.cyan.bold("Franchise:")} ${funko.franchise}
                ${chalk.cyan.bold("Number:")} ${funko.number}
                ${chalk.cyan.bold("Exclusive:")} ${funko.exclusive ? chalk.green("Yes") : chalk.red("No")}
                ${chalk.cyan.bold("Special Features:")} ${funko.specialFeatures || "None"}
                ${chalk.cyan.bold("Market Value:")} ${marketValueColor(`$${funko.marketValue}`)}
                `);
              }
            });
          } else {
            console.log(chalk.red('The collection is empty.'));
          }
          break;
        default:
          console.log(chalk.red('Unknown response type.'));
      }
    } else {
      console.log(chalk.red('Operation failed.'));
    }
  }
  public sendRequest(request: RequestType): void {
    this.socket.write(JSON.stringify(request) + '\n');
  }
}