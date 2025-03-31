import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FunkoType } from "../enums/funkoType.js";
import { FunkoGenres } from "../enums/funkoGenres.js";
import { Funko} from "../models/cFunko.js";
import { RequestType } from "../types/requestType.js";
import { FunkoClient } from "../models/cClient.js";

const client = new FunkoClient("localhost", 60300);

yargs(hideBin(process.argv))
  .command(
    "add",
    "Adds a Funko to the collection",
    (yargs) => {
      return yargs.options({
        user: { type: "string", demandOption: true },
        id: { type: "number", demandOption: true },
        name: { type: "string", demandOption: true },
        desc: { type: "string", demandOption: true },
        type: { type: "string", demandOption: true },
        genre: { type: "string", demandOption: true },
        franch: { type: "string", demandOption: true },
        number: { type: "number", demandOption: true },
        exc: { type: "boolean", demandOption: true },
        feats: { type: "string", demandOption: false, default: "" },
        value: { type: "number", demandOption: true },
      });
    },
    (args) => {
      const funko = new Funko(
        args.id,
        args.name,
        args.desc,
        args.type as FunkoType,
        args.genre as FunkoGenres,
        args.franch,
        args.number,
        args.exc,
        args.feats,
        args.value
      );
      const request: RequestType = {
        type: "add",
        username: args.user,
        funkos: [funko],
      };
      client.sendRequest(request);
    }
  )
  .command(
    "remove",
    "Removes a Funko to the collection",
    (yargs) => {
      return yargs.options({
        user: { type: "string", demandOption: true },
        id: { type: "number", demandOption: true },
      });
    },
    (args) => {
      const request: RequestType = {
        type: "remove",
        username: args.user,
        funkoid: args.id,
      };
      client.sendRequest(request);
    }
  )
  .command(
    "list",
    "Lists the Funko collection of a user",
    (yargs) => {
      return yargs.options({
        user: { type: "string", demandOption: true },
      });
    },
    (args) => {
      const request: RequestType = {
        type: "list",
        username: args.user,
      };
      client.sendRequest(request);
    }
  )
  .command(
    "show",
    "Shows a singular Funko from a user's collection",
    (yargs) => {
      return yargs.options({
        user: { type: "string", demandOption: true },
        id: { type: "number", demandOption: true },
      });
    },
    (args) => {
      const request: RequestType = {
        type: "show",
        username: args.user,
        funkoid: args.id,
      };
      client.sendRequest(request);
    }
  )
  .command(
    "modify",
    "Modifica un Funko en la colección de un usuario",
    (yargs) => {
      return yargs.options({
        user: { type: "string", demandOption: true },
        id: { type: "number", demandOption: true },
        name: { type: "string", demandOption: true },
        desc: { type: "string", demandOption: true },
        type: { type: "string", demandOption: true },
        genre: { type: "string", demandOption: true },
        franch: { type: "string", demandOption: true },
        number: { type: "number", demandOption: true },
        exc: { type: "boolean", demandOption: true },
        feats: { type: "string", demandOption: false, default: "" },
        value: { type: "number", demandOption: true },
      });
    },
    (args) => {
      const funko = new Funko(
        args.id,
        args.name,
        args.desc,
        args.type as FunkoType,
        args.genre as FunkoGenres,
        args.franch,
        args.number,
        args.exc,
        args.feats,
        args.value
      );
      const request: RequestType = {
        type: "modify",
        username: args.user,
        funkos: [funko],
      };
      client.sendRequest(request);
    }
  )
  .help()
  .parse();