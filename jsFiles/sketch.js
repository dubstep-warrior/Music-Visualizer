//global for the controls and input
let controls = null;
//store visualisations in a container
let vis = null;
//variable for the p5 sound object
let sound = null;
//variable for p5 fast fourier transform
let fourier;

let soundPlaylist = [];
let selectedSoundIndex = 0;
let tick = 0;

function preload() {
  soundPlaylist.push(loadSound("assets/fisher_losingIt.mp3"));
  soundPlaylist.push(loadSound("assets/slander_potionsEliminateRemix.mp3"));
  soundPlaylist.push(loadSound("assets/jamesM_wayOfTheWarrior.mp3"));
  soundPlaylist.push(loadSound("assets/stomper_reggae_bit.mp3"));

  sound = soundPlaylist[selectedSoundIndex];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  controls = new ControlsAndInput();

  //instantiate the fft object
  fourier = new p5.FFT();

  //create a new visualisation container and add visualisations
  vis = new Visualisations();
   
  vis.add(new RidgePlots());
  vis.add(new Blocks());
  vis.add(new Ripples());
}

function draw() {
  background(0);
  //draw the selected visualisation

  vis.selectedVisual.draw();
  //draw the controls on top.
  controls.draw();
  tick++;
}

function mouseClicked() {
  controls.mousePressed();
}

function keyPressed() {
  controls.keyPressed(keyCode);
}

//when the window has been resized. Resize canvas to fit
//if the visualisation needs to be resized call its onResize method
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (
    vis.selectedVisual.hasOwnProperty("onResize") ||
    "onResize" in vis.selectedVisual === true
  ) {
    vis.selectedVisual.onResize(windowWidth, windowHeight);
  }
}
