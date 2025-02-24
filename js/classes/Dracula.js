/**
 * @type {gameObject}
 */
import { gameObject } from './gameObject.js';

/**
 * @class Dracula
 * @extends gameObject
 */
export class Dracula extends gameObject {

  /**
   * Crea una nova instància de Dracula.
   * @param {number} row - Numero de fila
   * @param {number} column - Numero de columna
   */
  constructor(row, column) {
    super(row, column);

    /**
     * @type {number} pointsDracula - Punts que dóna el menjar
     */
    this.pointsDracula = 10;
  }

  toString() {
    /**
     * Mostra la informació de l'objecte Dracula
     */
    console.log( `Dracula at row ${this.rowNumber}
    and column ${this.columnObjectNumber}
    with ${this.pointsDracula} points`);
  }
}
