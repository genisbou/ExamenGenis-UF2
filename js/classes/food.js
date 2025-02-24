/**
 * @type {gameObject}
 */
import { gameObject } from './gameObject.js';

/**
 * @class Food
 * @extends gameObject
 */
export class Food extends gameObject {

  /**
   * Crea una nova instància de Food.
   * @param {number} row - Numero de fila
   * @param {number} column - Numero de columna
   */
  constructor(row, column) {
    super(row, column);

    /**
     * @type {number} pointsFood - Punts que dóna el menjar
     */
    this.pointsFood = 10;
  }

  toString() {
    /**
     * Mostra la informació de l'objecte Food
     */
    console.log( `Food at row ${this.rowNumber}
    and column ${this.columnObjectNumber}
    with ${this.pointsFood} points`);
  }
}
