/**
 * @type {gameObject}
 */
import { gameObject } from './gameObject.js';

/**
 * @class Zombie
 * @extends gameObject
 */
export class Zombie extends gameObject {

  /**
   * Crea una nova instància de Zombie.
   * @param {number} row - Numero de fila
   * @param {number} column - Numero de columna
   */
  constructor(row, column) {
    super(row, column);

    /**
     * @type {number} pointsZombie - Punts que dóna el menjar
     */
    this.pointsZombie = 10;
  }

  toString() {
    /**
     * Mostra la informació de l'objecte Zombie
     */
    console.log( `Zombie at row ${this.rowNumber}
    and column ${this.columnObjectNumber}
    with ${this.pointsZombie} points`);
  }
}
