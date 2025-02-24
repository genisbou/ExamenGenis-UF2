import { gameObject } from "./classes/gameObject.js";
import { Pacman } from "./classes/pacman.js";
import { Food } from "./classes/food.js";
import { configGame} from "./constants.js";
import {ErrorPac} from "./classes/errorPac.js";
import {Powup} from "./classes/powup.js";

let imgRock;
let numberImagesLoaded = 0;

const arrRocks = [];

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
const arrPowerUp = [];
let isPaused = false; // Variable per controlar si el joc està pausat

function preload() {
  imgRock = loadImage("../media/roca.png", handleImage, handleError);
  imgFood = loadImage("../media/food.png", handleImage, handleError);
  imgPacman = loadImage("../media/pacLeft.png", handleImage, handleError);
  imgPacmanRight = loadImage("../media/pacRight.png", handleImage, handleError);
  imgPacmanUp = loadImage("../media/pacUp.png", handleImage, handleError);
  imgPacmanLeft = loadImage("../media/pacLeft.png", handleImage, handleError);
  imgPacmanDown = loadImage("../media/pacDown.png", handleImage, handleError);
  imgPowerUp = loadImage("../media/aigua-beneida.png", handleImage, handleError);

  wakaSound = loadSound("../media/audio/WakaWaka.mp3", handleSound, handleErrorSound);
}

function handleSound() {
  console.error("S'ha carregat correctament l'audio");
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
  console.error("Images carregada correctament");
  numberImagesLoaded++;
}

function setup() {

  //numberImagesLoaded = 5; i numberErrorLoadedSounds = 1;
  createCanvas(configGame.WIDTH_CANVAS, configGame.HEIGHT_CANVAS + configGame.EXTRA_SIZE_HEIGHT).parent("sketch-pacman");
  for (let filaActual = 0; filaActual < configGame.ROWS; filaActual++) {
    for (let columnaActual = 0; columnaActual < configGame.COLUMNS; columnaActual++) {
      if (configGame.map[filaActual][columnaActual] === 1) {
        const roca = new gameObject(filaActual, columnaActual);
       // console.log("\n he creat una roca a posicio: fila -> " + filaActual + " columna -> " + columnaActual);
        arrRocks.push(roca);
      }
      else if (configGame.map[filaActual][columnaActual] === 2) {
        const food = new Food(filaActual, columnaActual);
      //  console.log("\n he craat una food a posicio: fila -> " + filaActual + " columna -> " + columnaActual);
        arrFood.push(food);
      }
      else if (configGame.map[filaActual][columnaActual] === 3) {
        myPacman = new Pacman(filaActual, columnaActual);
       // console.log("\n he craat una pacaman a posicio: fila -> " + filaActual + " columna -> " + columnaActual);
      }
      else if (configGame.map[filaActual][columnaActual] === 5) {
        const powerUp = new Powup(filaActual, columnaActual);
        arrPowerUp.push(powerUp);
      }
      else {
        //Error objecte no defini

      }
    } // fi for columnes
  } // fi for files
  console.log("array rocks mida es : ", arrRocks.length);
  console.log("array foods mida es : ", arrFood.length);
startTimeGame = millis();
} // fi setup

function draw() {
  if (!isPaused) {
    background(171, 248, 168);
     //arrRocks.forEach((roca) => roca.showObject(imgRock));

      arrFood.forEach((food) => {
        if (myPacman.testCollideFood(food)) {
          let PointsPowerUp = food.pointsFood ;
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

    //Pintem roques
    for (let i = 0; i < arrRocks.length; i++) {
      arrRocks[i].showObject(imgRock);
    }

    //Pintem powerups
    for (let i = 0; i < arrPowerUp.length; i++) {
      arrPowerUp[i].showObject(imgPowerUp);
    }

    //Pintem food
    for (let i = 0; i < arrFood.length; i++) {
      arrFood[i].showObject(imgFood);
    }
    //comprovar colisions pacman amb roques
    for (let i = 0; i < arrRocks.length; i++) {
      myPacman.testCollideRock ( arrRocks[i]);
    }

//comprovar colisions pacman amb food
    for (let i = 0; i < arrFood.length; i++) {
      let resultTest = myPacman.testCollideFood(arrFood[i]);
      if (resultTest) {
        myPacman.scorePacman = myPacman.scorePacman + arrFood[i].pointsFood;
        arrFood.splice(i, 1);
      }
    }
    //pINTEM ScoreBoard

    // Comprovar col·lisions Pacman amb PowerUp
    for (let i = 0; i < arrPowerUp.length; i++) {
      let resultTest = myPacman.testCollidePowerup(arrPowerUp[i]);

      if (resultTest) {
        // Activem el PowerUp si encara no està activat
        if (!arrPowerUp[i].enabledPowerup) {
          arrPowerUp[i].enabledPowerup = true;
          arrPowerUp[i].startTimePowerup = millis();
          console.log("PowerUp activat!");
        }
      }

      if (arrPowerUp[i].enabledPowerup) {
        for (let j = 0; j < arrFood.length; j++) {
          let resultTest = myPacman.testCollideFood(arrFood[j]);
          if (resultTest) {
            myPacman.scorePacman += Poi;
            arrFood.splice(j, 1);
            console.log("Pacman ha menjat una food! Nova puntuació: " + myPacman.scorePacman);
          }
        }
      }

    }

    // textFont(font);
    textSize(20);
    textAlign(CENTER, CENTER);
    timer = Math.floor((millis() - startTimeGame) / 1000);
    text("Score: " + myPacman.scorePacman, 150, configGame.HEIGHT_CANVAS + 50);
//   text("Score: " + myPacman.scorePacman, 150, HEIGHT_CANVAS + 50);
    text("Time: " + timer, 150, configGame.HEIGHT_CANVAS + 100);
    text("Lives: " + myPacman.pacmanlives, 150, configGame.HEIGHT_CANVAS + 150);
    //Pintem pacman
    //myPacman.showObject(imgPacman);
    switch(myPacman.directionPacman){
      case 1: //Move right
        myPacman.showObject(imgPacmanRight);
        break;
      case 2: //Move up
        myPacman.showObject(imgPacmanUp);
        break;
      case 3: //Move left
        myPacman.showObject(imgPacmanLeft);
        break
      case 4: //Move down
        myPacman.showObject(imgPacmanDown);
        break;
      default : myPacman.showObject(imgPacman);

    }

    if( wakaSound.isPlaying() === false) {
      wakaSound.play();
    }
    else {
      //wakaSound.play();
    }
    testFinishPowerup();
    testFinishGame();
  }
    else {
        //Pausa
        wakaSound.pause();
        textSize(32);
        textAlign(CENTER, CENTER);
        text("PAUSA", configGame.WIDTH_CANVAS / 2, configGame.HEIGHT_CANVAS / 2);
        }

  // pacmanEnemy.showObject(imgPacman);
} // fi draw

function keyPressed() {
  // Pausar el joc
  if (key === 'P' || key === 'p') {
    isPaused = !isPaused;
    console.log(isPaused ? "Joc en pausa" : "Joc reprès");
    return; // Evita processar altres tecles si s'ha pausat el joc
  }

  // Si el joc està en pausa, no fer res més
  if (isPaused) {
    return;
  }

  // Controls de moviment
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

function showError(){
  let errorImage = new ErrorPac(105, "Error 2loading image");
  errorImage.toString();
  const parent = document.getElementById("error-holder");
  const node = document.createElement("media");
  node.setAttribute("src", "./media/tristesa.webp");
  node.setAttribute("alt", "Imatge Error");
  node.setAttribute("width", 300);
  node.setAttribute("height", 300);

  parent.appendChild(node);
  noLoop();
  remove();
}

function testFinishGame(){

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
        }
        else if (configGame.map[filaActual][columnaActual] === 2) {
          const food = new Food(filaActual, columnaActual);
          arrFood.push(food);
        }
        else if (configGame.map[filaActual][columnaActual] === 3) {
          myPacman = new Pacman(filaActual, columnaActual);
        }
        else if (configGame.map[filaActual][columnaActual] === 5) {
          const powerUp = new Powup(filaActual, columnaActual);
          arrPowerUp.push(powerUp);
        }
        else {
          //Error objecte no defini

        }
      } // fi for columnes
    } // fi for files
  };
  if (arrFood.length === 0){
    //Fi del joc
    noLoop();
    let theconfirm =confirm("Fi del joc, has guanyat. Desitja jugar una altra partida ?");
    loop`();`
    if( theconfirm)
    {
      restartGame();
    }
    else {
      alert("Gracies per jugar");
        remove();
    }
    loop();
  }/*
  else if {
    //test if loose game
  }
  else {
    //continume
  }*/
}

function testFinishPowerup() {

  for (let i = 0; i < arrPowerUp.length; i++) {
    if (arrPowerUp[i].enabledPowerup === true) {
      text ("⚡PowerUp activat ", 150, configGame.HEIGHT_CANVAS + 200);
      text("🚀Temps restant : " + (10 - Math.floor((millis() - arrPowerUp[i].startTimePowerup) / 1000)), 150, configGame.HEIGHT_CANVAS + 250);
      console.log("Powerup activat numero " + i);
      console.log("Powerup activat startTime " + arrPowerUp[i].startTimePowerup);
      console.log("Powerup activat enabled " + arrPowerUp[i].enabledPowerup);
      if ( (millis() - arrPowerUp[i].startTimePowerup) > 10000) {
        arrPowerUp[i].enabledPowerup = false;
        arrPowerUp.splice(i, 1);
        console.log("Powerup desactivat numero " + i );
      }
    }
  }
}
/*globalThis: globalThis object. This is done to ensure
that the p5.js library can call these functions when needed.
 */
globalThis.setup = setup;
globalThis.draw = draw;
globalThis.preload = preload;
globalThis.keyPressed = keyPressed;
