import { Funko } from "../models/cFunko.js";

export type RespondType = {
  type: 'add' | 'modify' | 'remove' | 'list' | 'show' | 'update';
  success: boolean;
  funkos?: Funko[]; // Optional
}