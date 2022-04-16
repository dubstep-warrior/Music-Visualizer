//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class ControlsAndInput {
  #menuDisplayed;
  #playbackButton;
  #forwardButton;
  #backwardButton;
  #playlistManager;
  #scrubber;
  //Constructor properties of ControlsAndInput class.
  constructor() {
    this.#menuDisplayed = false;
    this.#playbackButton = new PlaybackButton(75, 25, 20, 20);
    this.#forwardButton = new ForwardButton(120, 25, 30, 20);
    this.#backwardButton = new BackwardButton(20, 25, 30, 20);
    this.#playlistManager = new Playlist(width/2, 2, 900, 50);
    this.#scrubber = new Scrubber(150, 20, (3.5 / 10) * width, 30);
  }

  //mouse pressed method creates full screen if playback button is not clicked.
  mousePressed() {
    if (vis.selectedVisual.name != "ripples") {
      if (
        !this.#playbackButton.hitCheck() &&
        !this.#forwardButton.hitCheck() &&
        !this.#backwardButton.hitCheck() &&
        !this.#playlistManager.hitCheck() &&
        !this.#scrubber.hitCheck()
      ) {
        const fs = fullscreen();
        fullscreen(!fs);
      }
    } else {
      if (
        !vis.selectedVisual.hitCheck() &&
        !this.#playbackButton.hitCheck() &&
        !this.#forwardButton.hitCheck() &&
        !this.#backwardButton.hitCheck() &&
        !this.#playlistManager.hitCheck() &&
        !this.#scrubber.hitCheck()
      ) {
        const fs = fullscreen();
        fullscreen(!fs);
      }
    }
  }

  //key press method checks for relevant keycode that calls on vis to select different visuals.
  keyPressed(keycode) {
    if (keycode == 32) {
      this.#menuDisplayed = !this.#menuDisplayed;
    }

    if (keycode > 48 && keycode < 58) {
      const visNumber = keycode - 49;
      vis.selectVisual(vis.visuals[visNumber].name);
    }
  }

  //main draw method called by main sketch file, draws the playback button and menu.
  draw() {
    push();
    fill("white");
    stroke("black");
    strokeWeight(2);
    textSize(34);

    //playback button
    this.#playbackButton.draw();

    //draw forward button
    this.#forwardButton.draw();

    //draw backward button
    this.#backwardButton.draw();

    //draw playlist manager
    this.#playlistManager.draw();

    //draw scrubber
    this.#scrubber.draw();

    //only draw the menu if menu displayed is set to true.
    if (this.#menuDisplayed) {
      const yBase = 350;
      text("Select visualisation", 25, yBase);
      text("Press Number Key:", 25, yBase + 50);
      this.#menu(yBase + 50);
    }
    pop();
  }

  //private method called by the draw method. Draws the menu consisting of different visualizations.
  #menu(yBase) {
    for (let i = 0; i < vis.visuals.length; i++) {
      const yLoc = yBase + 60 + i * 40;
      text(i + 1 + ":  " + vis.visuals[i].name, 25, yLoc);
    }
  }
}
