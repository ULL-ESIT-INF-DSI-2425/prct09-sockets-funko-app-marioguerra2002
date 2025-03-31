import { Funko } from "../models/cFunko.js";

export type RequestType = {
  type: 'add' | 'modify' | 'remove' | 'list' | 'show' | 'update';
  username: string;
  funkoid?: number; // Optional
  funkos?: Funko[]; // Optional
};