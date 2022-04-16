//Ridge Plot Class instantiated by the main sketch file. Displays music visualization upon instantiating the Wave and Particle Systems. Calls it's respective update and render methods in the visualizer draw method.
class RidgePlots {
  #startX;
  #startY;
  #spectrumWidth;
  #endY;
  #speed;
  #initialized;
  #particleSystem;
  #WaveSystem;
  #beat;
  #cg;
  //Constructor properties of RidgePlot class.
  constructor() {
    this.name = "ridgeplot";
    this.#startX = -2 * width;
    this.#startY = -3.5 * height;
    this.#endY = 2000;
    this.#spectrumWidth = 5 * width;
    this.#speed = 15;
    this.#initialized = false;
    this.#particleSystem;
    this.#WaveSystem;
    this.#beat;
    this.#cg;
  }

  //Private initialize method called by draw method. Instantiates and initialize relevant class objects and creates WEBGL graphics context.
  #init() {
    this.#cg = createGraphics(width, height, WEBGL);
    this.#cg.name = "ridgeplot";
    this.#cg.translate(-width / 2, height / 2);
    this.#cg.rotateX(PI / 3);
    frameRate(60);
    this.#WaveSystem = new WaveSys(
      this.#startX,
      this.#spectrumWidth,
      this.#startY,
      this.#endY,
      this.#speed
    );
    this.#particleSystem = new ParticleSys(
      0.75,
      this.#startX + this.#spectrumWidth / 4,
      this.#spectrumWidth / 2,
      this.#startY,
      this.#endY,
      this.#speed,
      700,
      4000,
      3
    );
    this.#particleSystem.init();
    this.#beat = new BeatDetector();
    this.#initialized = true;
  }

  //Public draw method called by main sketch file. Calls on class objects' update and render methods.
  draw() {
    if (!this.#initialized) {
      this.#init();
    }
    this.#cg.push();
    const viewX = map(mouseX, 0, windowWidth, -1000, 1000);
    const viewY = map(mouseY, 0, windowHeight, -2000, 0);
    this.#cg.camera(
      this.#startX + this.#spectrumWidth / 2,
      this.#endY - 300,
      3500,
      1400 + viewX,
      -5000 + viewY * 2,
      0,
      0,
      0,
      -1
    );
    this.#cg.stroke(255);
    this.#WaveSystem.update(this.#beat.beatDetect());
    this.#particleSystem.update(this.#cg, true, this.#beat.beatDetect());
    this.#WaveSystem.render(this.#cg);
    image(this.#cg, 0, 0, width, height);
    this.#cg.pop();
    this.#cg.clear();
  }
}
