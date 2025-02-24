import { gameObject } from "./classes/gameObject.js";
import { Pacman } from "./classes/pacman.js";
import { Food } from "./classes/food.js";
import { configGame } from "./constants.js";
import { ErrorPac } from "./classes/errorPac.js";
import { Powup } from "./classes/powup.js";
import { Dracula } from "./classes/dracula.js";
import { Zombie } from "./classes/zombie.js";

let imgRock;
let numberImagesLoaded = 0;

const arrRocks = [];
const arrDracula = [];
const arrZombie = [];

let imgFood;
const arrFood = [];

let imgPacmanLeft;
let imgPacmanRight, imgPacmanUp, imgPacmanDown, imgPacman;
let myPacman;
let pacmanEnemy;
let wakaSound;
let timer = 0;
let startTimeGame = 0;
let endTimeGame = 0;
let numberErrorLoadedSounds = 0;
let imgPowerUp;
let imgDracula;
let imgZombie;
const arrPowerUp = [];
let isPaused = false; // Variable per controlar si el joc està pausat

function preload() {
  imgRock = loadImage("../media/terra.png", handleImage, handleError);
  imgFood = loadImage("../media/all.png", handleImage, handleError);
  imgPacman = loadImage("../media/left.jpg", handleImage, handleError);
  imgPacmanRight = loadImage("../media/right.jpg", handleImage, handleError);
  imgPacmanUp = loadImage("../media/up.jpg", handleImage, handleError);
  imgPacmanLeft = loadImage("../media/left.jpg", handleImage, handleError);
  imgPacmanDown = loadImage("../media/down.jpg", handleImage, handleError);
  imgPowerUp = loadImage("../media/aigua-beneida.png", handleImage, handleError);
  imgDracula = loadImage("../media/dracula.png", handleImage, handleError);
  imgZombie = loadImage("../media/zombie.png", handleImage, handleError);

  wakaSound = loadSound("../media/audio/WakaWaka.mp3", handleSound, handleErrorSound);
}

function handleSound() {
  console.log("S'ha carregat correctament l'audio");
}

function handleErrorSound() {
  console.error("Error carregar audio");
  numberErrorLoadedSounds++;
}

function handleError() {
  console.error("Error carregar alguna imatge");
  try {
    throw new ErrorPac(20, "Falta imatge per carregar");
  } catch (error) {
    console.error("Error carregar alguna imatge");
    showError();
  }
}

function handleImage() {
  console.log("Imatge carregada correctament");
  numberImagesLoaded++;
}

function setup() {
  createCanvas(configGame.WIDTH_CANVAS, configGame.HEIGHT_CANVAS + configGame.EXTRA_SIZE_HEIGHT).parent("sketch-pacman");
  for (let filaActual = 0; filaActual < configGame.ROWS; filaActual++) {
    for (let columnaActual = 0; columnaActual < configGame.COLUMNS; columnaActual++) {
      if (configGame.map[filaActual][columnaActual] === 1) {
        const roca = new gameObject(filaActual, columnaActual);
        arrRocks.push(roca);
      } else if (configGame.map[filaActual][columnaActual] === 2) {
        const food = new Food(filaActual, columnaActual);
        arrFood.push(food);
      } else if (configGame.map[filaActual][columnaActual] === 3) {
        myPacman = new Pacman(filaActual, columnaActual);
      } else if (configGame.map[filaActual][columnaActual] === 5) {
        const powerUp = new Powup(filaActual, columnaActual);
        arrPowerUp.push(powerUp);
      } else if (configGame.map[filaActual][columnaActual] === 6) {
        const dracula = new Dracula(filaActual, columnaActual);
        arrDracula.push(dracula);
      } else if (configGame.map[filaActual][columnaActual] === 7) {
        const zombie = new Zombie(filaActual, columnaActual);
        arrZombie.push(zombie);
      }
    }
  }
  console.log("array rocks mida es : ", arrRocks.length);
  console.log("array foods mida es : ", arrFood.length);
  startTimeGame = millis();
}

function draw() {
  if (!isPaused) {
    background(171, 248, 168);

    arrFood.forEach((food) => {
      if (myPacman.testCollideFood(food)) {
        let PointsPowerUp = food.pointsFood;
        for (let i = 0; i < arrPowerUp.length; i++) {
          if (arrPowerUp[i].enabledPowerup) {
            PointsPowerUp = PointsPowerUp * 10;
          }
        }
        myPacman.scorePacman += PointsPowerUp;
        arrFood.splice(arrFood.indexOf(food), 1);
      }
    });

    testFinishPowerup();

    arrRocks.forEach((roca) => roca.showObject(imgRock));
    arrPowerUp.forEach((powerUp) => powerUp.showObject(imgPowerUp));
    arrFood.forEach((food) => food.showObject(imgFood));
    arrDracula.forEach((dracula) => dracula.showObject(imgDracula));
    arrZombie.forEach((zombie) => zombie.showObject(imgZombie));

    arrRocks.forEach((roca) => myPacman.testCollideRock(roca));
    arrFood.forEach((food, i) => {
      if (myPacman.testCollideFood(food)) {
        myPacman.scorePacman += food.pointsFood;
        arrFood.splice(i, 1);
      }
    });

    arrPowerUp.forEach((powerUp, i) => {
      if (myPacman.testCollidePowerup(powerUp)) {
        if (!powerUp.enabledPowerup) {
          powerUp.enabledPowerup = true;
          powerUp.startTimePowerup = millis();
          console.log("PowerUp activat!");
        }
      }
      if (powerUp.enabledPowerup) {
        arrFood.forEach((food, j) => {
          if (myPacman.testCollideFood(food)) {
            myPacman.scorePacman += food.pointsFood;
            arrFood.splice(j, 1);
            console.log("Pacman ha menjat una food! Nova puntuació: " + myPacman.scorePacman);
          }
        });
      }
    });


    arrZombie.forEach((zombie) => {
      if (myPacman.testCollideZombie(zombie)) {
        endGame("Fi del joc, has perdut. Has xocat amb un zombie.");
      }
    });

    textSize(20);
    textAlign(CENTER, CENTER);
    timer = Math.floor((millis() - startTimeGame) / 1000);
    text("Score: " + myPacman.scorePacman, 150, configGame.HEIGHT_CANVAS + 50);
    text("Time: " + (90 - timer), 150, configGame.HEIGHT_CANVAS + 100);

    switch (myPacman.directionPacman) {
      case 1:
        myPacman.showObject(imgPacmanRight);
        break;
      case 2:
        myPacman.showObject(imgPacmanUp);
        break;
      case 3:
        myPacman.showObject(imgPacmanLeft);
        break;
      case 4:
        myPacman.showObject(imgPacmanDown);
        break;
      default:
        myPacman.showObject(imgPacman);
    }

    if (!wakaSound.isPlaying()) {
      wakaSound.play();
    }

    testFinishPowerup();
    testFinishGame();
  } else {
    wakaSound.pause();
    textSize(32);
    textAlign(CENTER, CENTER);
    text("PAUSA", configGame.WIDTH_CANVAS / 2, configGame.HEIGHT_CANVAS / 2);
  }
}

function keyPressed() {
  if (key === 'P' || key === 'p') {
    isPaused = !isPaused;
    console.log(isPaused ? "Joc en pausa" : "Joc reprès");
    return;
  }

  if (isPaused) {
    return;
  }

  if (keyCode === RIGHT_ARROW) {
    console.log("Dreta");
    myPacman.moveRight();
  } else if (keyCode === LEFT_ARROW) {
    console.log("Esquerra");
    myPacman.moveLeft();
  } else if (keyCode === UP_ARROW) {
    console.log("Amunt");
    myPacman.moveUp();
  } else if (keyCode === DOWN_ARROW) {
    console.log("Avall");
    myPacman.moveDown();
  } else {
    console.error("Error, tecla no reconeguda");
  }
}

function showError() {
  let errorImage = new ErrorPac(105, "Error carregant imatge");
  errorImage.toString();
  const parent = document.getElementById("error-holder");
  const node = document.createElement("img");
  node.setAttribute("src", "./media/tristesa.webp");
  node.setAttribute("alt", "Imatge Error");
  node.setAttribute("width", 300);
  node.setAttribute("height", 300);

  parent.appendChild(node);
  noLoop();
  remove();
}

function testFinishGame() {
  const restartGame = () => {
    arrFood.length = 0;
    arrPowerUp.length = 0;
    myPacman.scorePacman = 0;
    startTimeGame = millis();
    for (let filaActual = 0; filaActual < configGame.ROWS; filaActual++) {
      for (let columnaActual = 0; columnaActual < configGame.COLUMNS; columnaActual++) {
        if (configGame.map[filaActual][columnaActual] === 1) {
          const roca = new gameObject(filaActual, columnaActual);
          arrRocks.push(roca);
        } else if (configGame.map[filaActual][columnaActual] === 2) {
          const food = new Food(filaActual, columnaActual);
          arrFood.push(food);
        } else if (configGame.map[filaActual][columnaActual] === 3) {
          myPacman = new Pacman(filaActual, columnaActual);
        } else if (configGame.map[filaActual][columnaActual] === 5) {
          const powerUp = new Powup(filaActual, columnaActual);
          arrPowerUp.push(powerUp);
        } else if (configGame.map[filaActual][columnaActual] === 6) {
          const dracula = new Dracula(filaActual, columnaActual);
          arrDracula.push(dracula);
        } else if (configGame.map[filaActual][columnaActual] === 7) {
          const zombie = new Zombie(filaActual, columnaActual);
          arrZombie.push(zombie);
        }
      }
    }
  };

  if (arrFood.length === 0) {
    noLoop();
    let theconfirm = confirm("Fi del joc, has guanyat. Desitja jugar una altra partida?");
    if (theconfirm) {
      restartGame();
    } else {
      alert("Gràcies per jugar");
      remove();
    }
    loop();
  }
  // Si supera el time perd,
  if (timer > 90) {
    noLoop();
    let theconfirm = confirm("Fi del joc, has perdut. Desitja jugar una altra partida?");
    if (theconfirm) {
      restartGame();
    } else {
      alert("Gràcies per jugar");
      remove();
    }
    loop();
  }
}

function testFinishPowerup() {
  arrPowerUp.forEach((powerUp, i) => {
    if (powerUp.enabledPowerup) {
      text("⚡Mata al dràcula", 150, configGame.HEIGHT_CANVAS + 200);
      text("🚀Temps restant: " + (10 - Math.floor((millis() - powerUp.startTimePowerup) / 1000)), 150, configGame.HEIGHT_CANVAS + 250);
      if ((millis() - powerUp.startTimePowerup) > 10000) {
        powerUp.enabledPowerup = false;
        arrPowerUp.splice(i, 1);
      }
    }
  });
}

function endGame(message) {
  noLoop();
  wakaSound.stop();
  alert(message);
  remove();
}

globalThis.setup = setup;
globalThis.draw = draw;
globalThis.preload = preload;
globalThis.keyPressed = keyPressed;
