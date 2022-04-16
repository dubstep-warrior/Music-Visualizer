//Blocks class instantiated by the main sketch file. Displays music visualization upon instantiating the Box system and calling it's respective update and render methods.
class Blocks {
  #initialized;
  #boxSystem;
  #cg;
  #rotSpeed;
  //Constructor properties of Blocks class.
  constructor() {
    this.name = "blocks";
    this.#initialized = false;
    this.#cg;
    this.#rotSpeed = 0;
  }

  //Initalize method to create a WEBGL graphics context, inital rotations and instantiate/initalize the relevant classes.
  #init() {
    this.#cg = createGraphics(width, height, WEBGL);
    this.#cg.rotateX(45);
    this.#cg.rotateY(7);
    this.#boxSystem = new BoxSys();
    this.#boxSystem.init();
    this.#initialized = true;
  }

  //Main draw method called by main sketch file. Updated rotations and calls on the relevant class methods.
  draw() {
    const [minRotSpd, maxRotSpd] = [0, 0.006];
    if (!this.#initialized) {
      this.#init();
    }
    if (sound.isPlaying() && this.#rotSpeed < maxRotSpd) {
      this.#rotSpeed += 0.00005;
    } else if (this.#rotSpeed > minRotSpd) {
      this.#rotSpeed -= 0.00005;
    }
    this.#cg.rotateZ(this.#rotSpeed);
    this.#cg.push();
    this.#cg.rotateZ(mouseX / 10000);
    this.#boxSystem.render(this.#cg);
    image(this.#cg, 0, 0, width, height);
    this.#cg.pop();
    this.#cg.clear();
  }
}
