//Ripple class instantiated by the main sketch file. Displays music visualization upon instantiating the Oscillation, Spectrum Ring, Particle and Grid Systems and calling it's respective update and render methods.
class Ripples {
  #initialized;
  #gridDimension;
  #startPos;
  #gridSpace;
  #particleSystem;
  #cg;
  #gridSystem;
  #oscSystem;
  #mode;
  #modeButton;
  #specRingSystem;
  #beat;
  //Constructor properties of Ripples class.
  constructor() {
    this.name = "ripples";
    this.#initialized = false;
    this.#gridDimension = 39;
    this.#startPos = 10;
    this.#gridSpace = 12.5;
    this.#particleSystem;
    this.#cg;
    this.#gridSystem;
    this.#oscSystem;
    this.#specRingSystem;
    this.#beat = new BeatDetector();
    this.#mode = true;
    this.#modeButton;
  }

  //Private initialize method called by draw method. Instantiates and initialize relevant class objects and creates WEBGL graphics context.
  #init() {
    this.#cg = createGraphics(width, height, WEBGL);
    this.#cg.name = "ripples";
    frameRate(60);
    const [midX, midY] = [
      this.#startPos + ((this.#gridDimension - 1) * this.#gridSpace) / 2,
      2 * this.#startPos + ((this.#gridDimension - 1) * this.#gridSpace) / 2,
    ];
    [
      this.#gridSystem,
      this.#oscSystem,
      this.#specRingSystem,
      this.#particleSystem,
      this.#modeButton,
    ] = [
      new GridSys(
        midX,
        midY,
        this.#gridDimension,
        this.#startPos,
        this.#gridSpace
      ),
      new OscSys(midX, midY, this.#gridDimension, this.#gridSpace),
      new SpecRingSys(
        midX,
        midY,
        this.#gridDimension,
        this.#gridSpace,
        this.#startPos
      ),
      new ParticleSys(
        0.25,
        -4 * midX,
        8 * midX,
        -800,
        300,
        8,
        -2 * midY,
        midY * 4,
        2
      ),
      new ModeButton(0, height/5, 310, 50),
    ];
    this.#gridSystem.init();
    this.#specRingSystem.init(this.#gridSystem.gridData);
    this.#particleSystem.init();
    this.#initialized = true;
  }

  //Public draw method called by main sketch file. Calls on class objects' update and render methods.
  draw() {
    if (!this.#initialized) {
      this.#init();
    }
    this.#cg.push();
    this.#cg.translate(0, (mouseY - height / 2) / 20 - 50);
    this.#gridSystem.render(this.#cg, this.#mode);
    this.#gridSystem.update(
      this.#specRingSystem.Data.sys,
      this.#oscSystem.Data.sys
    );
    this.#cg.pop();
    this.#cg.push();
    this.#oscSystem.update(this.#beat.beatDetect());
    this.#particleSystem.update(this.#cg, false, this.#beat.beatDetect());
    this.#specRingSystem.update();

    this.#modeButton.draw(this.#cg, this.#mode);

    image(this.#cg, 0, 0, width, height);
    this.#cg.pop();
    this.#cg.clear();
  }

  hitCheck() {
    if (this.#modeButton.hitCheck()) {
      this.#mode = !this.#mode;
      return true;
    } else {
      return false;
    }
  }
}
