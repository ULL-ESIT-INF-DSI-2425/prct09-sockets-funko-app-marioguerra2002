import { FunkoType } from "../enums/funkoType.js"
import { FunkoGenres } from "../enums/funkoGenres.js"

/**
 * Interfaces that defines the characteristics of a Funko figure
 * 
 * Interface Funko Figure
 */
export interface FunkoFigure {
  id: number,
  name: string,
  description: string,
  type: FunkoType,
  genre: FunkoGenres,
  franchise: string,
  number: number,
  exclusive: boolean,
  specialFeatures: string,
  marketValue: number
}