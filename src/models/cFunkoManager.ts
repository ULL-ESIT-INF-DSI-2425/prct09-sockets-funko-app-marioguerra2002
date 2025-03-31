import * as fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import { Funko } from "./cFunko.js";
// import { FunkoType } from "../enums/funkotype.js";
// import { FunkoGenre } from "../enums/funkogenre.js";
// import { Funko } from "../models/funko.js";

/**
 * Class that represents a Funko Collection of a user
 *
 * Class FunkoCollection
 */
export class FunkoCollection {
  accessor _userDir: string;

  /**
   * Constructs a FunkoCollection object and creates the folder that will hold it
   * @param username - name of the user that will hold a collection on an specific folder
   */
  constructor(private username: string) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this._userDir = path.join(__dirname, "../../data", username);
    fs.mkdir(this._userDir, { recursive: true }).catch(console.error);
  }

  /**
   * Adds a funko to the collection of a person
   * @param funko - funko to add to the collection (Funko)
   * @returns void
   */
  async addFunko(funko: Funko) {
    const funkoPath = path.join(this._userDir, `${funko.id}.json`);

    try {
      await fs.access(funkoPath); // Check if the file exists
      console.log(
        chalk.red(
          `Funko with ID ${funko.id} already exists in ${this.username}'s collection!`,
        ),
      );
    } catch {
      await fs.writeFile(funkoPath, JSON.stringify(funko, null, 2));
      console.log(
        chalk.green(
          `Funko with ID ${funko.id} has been added to ${this.username}'s collection!`,
        ),
      );
    }
  }

  /**
   * Modifies a funko object
   * @param updatedFunko - funko object to change
   * @returns
   */
  async modifyFunko(updatedFunko: Funko) {
    const funkoPath = path.join(this._userDir, `${updatedFunko.id}.json`);

    try {
      await fs.access(funkoPath); // Check if the file exists
      await fs.writeFile(funkoPath, JSON.stringify(updatedFunko, null, 2));
      console.log(
        chalk.green(
          `Funko with ID ${updatedFunko.id} has been updated in ${this.username}'s collection!`,
        ),
      );
    } catch {
      console.log(
        chalk.red(
          `Funko with ID ${updatedFunko.id} not found in ${this.username}'s collection!`,
        ),
      );
    }
  }

  /**
   * Removes a funko from the collection
   * @param funkoId - id of the funko object to remove from the collection
   * @returns
   */
  async removeFunko(funkoId: number) {
    const funkoPath = path.join(this._userDir, `${funkoId}.json`);
    try {
      await fs.access(funkoPath); // Check if the file exists
      await fs.unlink(funkoPath);
      console.log(
        chalk.green(
          `Funko with ID ${funkoId} has been removed from ${this.username}'s collection!`,
        ),
      );
    } catch {
      console.log(
        chalk.red(
          `Funko with ID ${funkoId} not found in ${this.username}'s collection!`,
        ),
      );
    }
  }

  /**
   * Lists the entire collection of Funkos of a user
   * @returns
   */
  async listFunkos(): Promise<Funko[]> {
    let funkoList: Funko[] = [];
    try {
      const files = await fs.readdir(this._userDir);
      if (files.length === 0) {
        console.log(
          chalk.red(`No Funkos found in ${this.username}'s collection!`),
        );
        return funkoList;
      }
      console.log(chalk.blue.bold(`Funko Collection of ${this.username}:`));
      for (const file of files) {
        const filePath = path.join(this._userDir, file);
        const data = await fs.readFile(filePath, "utf-8");
        const funko = Funko.fromJSON(JSON.parse(data));
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
        if (funko != null) {
          funkoList.push(funko);
        }
      }
    } catch {
      console.log(chalk.red("Error reading files"));
    }
    return funkoList;
    
  }

  /**
   * Shows a single Funko from a user's collection
   * @param id - id of the funko to be shown
   * @returns 
   */
  async showFunko(id: number) {
    const filePath = path.join(this._userDir, `${id}.json`);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const funko = Funko.fromJSON(JSON.parse(data));
      if (funko != null) {
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
        console.log(chalk.blue.bold(`Funko ID ${id} Information:`));
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
      return funko;
    } catch {
      console.log(chalk.red(`Funko with ID ${id} not found in ${this.username}'s collection!`));
      return;
    }
  }
}