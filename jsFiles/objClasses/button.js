//Abstract class button, cannot be instantiated
class Button {
  #x;
  #y;
  #width;
  #height;
  #alpha;
  // constructor properties of abstract class
  constructor(x, y, width, height) {
    if (this.constructor == Button) {
      throw new Error("Abstract Classes cannot be instantiated");
    }

    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
    this.#alpha = 0;
  }

  // Protected accessor for child class to update constructor x property
  _setX(value) {
    this.#x = value;
  }

  // Public accessor for child class to update constructor y property
  setY(value) {
    this.#y = value;
  }

  // Protected accessor for child class to update constructor alpha property
  _setalpha(value) {
    this.#alpha = value;
  }

  //Protected accesor for child class to retrieve constructor properties
  _data() {
    return {
      x: this.#x,
      y: this.#y,
      width: this.#width,
      height: this.#height,
      alpha: this.#alpha,
    };
  }

  //Protected method to check if mouse is hovering over the object
  _check() {
    if (
      mouseX > this.#x &&
      mouseX < this.#x + this.#width &&
      mouseY > this.#y &&
      mouseY < this.#y + this.#height
    ) {
      return true;
    }
    return false;
  }
}

//displays and handles clicks on the forward button.
class ForwardButton extends Button {
  //Constructor properties of ForwardButton class.
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  //Public draw method called by main sketch file. Contains render functions to draw the button.
  draw() {
    const data = this._data();
    push();
    if (this._check()) {
      fill(150);
    }
    triangle(
      data.x,
      data.y,
      data.x + (2 / 3) * data.width,
      data.y + data.height / 2,
      data.x,
      data.y + data.height
    );
    triangle(
      data.x + (1 / 3) * data.width,
      data.y,
      data.x + data.width,
      data.y + data.height / 2,
      data.x + (1 / 3) * data.width,
      data.y + data.height
    );
    pop();
  }

  //Public hitcheck method called by the controls and input file. Skips to the next song on playlist.
  hitCheck() {
    if (this._check() == true) {
      selectedSoundIndex++;
      while (selectedSoundIndex > soundPlaylist.length - 1) {
        selectedSoundIndex -= soundPlaylist.length;
      }
      if (sound.isPlaying()) {
        sound.stop();
        sound = soundPlaylist[selectedSoundIndex];
        sound.loop();
      } else {
        sound.stop();
        sound = soundPlaylist[selectedSoundIndex];
      }
      return true;
    }
    return false;
  }
}

//displays and handles clicks on the backwards button.
class BackwardButton extends Button {
  //Constructor properties of Backward Button class.
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  //Public draw method called by main sketch file. Contains render functions to draw the button.
  draw() {
    const data = this._data();
    push();
    if (this._check()) {
      fill(150);
    }
    triangle(
      data.x + data.width,
      data.y,
      data.x + (1 / 3) * data.width,
      data.y + data.height / 2,
      data.x + data.width,
      data.y + data.height
    );
    triangle(
      data.x + (2 / 3) * data.width,
      data.y,
      data.x,
      data.y + data.height / 2,
      data.x + (2 / 3) * data.width,
      data.y + data.height
    );
    pop();
  }

  //Public hitcheck method called by the controls and input file. Skips to the previous song in the playlist.
  hitCheck() {
    if (this._check() == true) {
      selectedSoundIndex--;
      while (selectedSoundIndex < 0) {
        selectedSoundIndex += soundPlaylist.length;
      }
      if (sound.isPlaying()) {
        sound.stop();
        sound = soundPlaylist[selectedSoundIndex];
        sound.loop();
      } else {
        sound.stop();
        sound = soundPlaylist[selectedSoundIndex];
      }
      return true;
    }
    return false;
  }
}

//displays and handles clicks on the playback button.
class PlaybackButton extends Button {
  #playing;
  //Constructor properties of PlayBackButton class.
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.#playing = false;
  }

  //Public draw method called by main sketch file. Contains render functions to draw the button.
  draw() {
    const data = this._data();
    this.#playing = sound.isPlaying();
    push();
    if (this._check()) {
      fill(150);
    }
    if (this.#playing) {
      rect(data.x, data.y, data.width / 2 - 2, data.height);
      rect(
        data.x + (data.width / 2 + 2),
        data.y,
        data.width / 2 - 2,
        data.height
      );
    } else {
      triangle(
        data.x,
        data.y,
        data.x + data.width,
        data.y + data.height / 2,
        data.x,
        data.y + data.height
      );
    }
    pop();
  }

  //Public hitcheck method called by the controls and input file. Starts and stop music & changes it's constructor this.#playing property.
  hitCheck() {
    if (this._check() == true) {
      if (sound.isPlaying()) {
        sound.pause();
      } else {
        sound.loop();
      }
      return true;
    }
    return false;
  }
}

//Playlist class for displaying the track buttons and drag song section
class Playlist extends Button {
  #playlist;
  #showTracks;
  #initialized;
  //constructor properties of playlist class.
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.#playlist = [];
    this.#showTracks = false;
    this.#initialized = false;
  }

  //init method activated once, adds track buttons and audio file drop object for display.
  #init() {
    if (this.#playlist.length > 0) {
      this.#playlist[this.#playlist.length - 1].update();
    }
    this.#playlist = [];
    const data = this._data();
    let c = 0;
    for (let i = 0; i < soundPlaylist.length; i++) {
      c = i;
      let name;
      if (soundPlaylist[i].file.name) {
        const split1 = soundPlaylist[i].file.name.toString().split(".mp3")[0];
        name = split1.split(".wav")[0];
      } else {
        name = soundPlaylist[i].file
          .toString()
          .split("assets/")[1]
          .split(".mp3")[0];
      }
      this.#playlist.push(
        new TrackButton(
          data.x,
          data.y + 50 + i * data.height,
          data.width,
          data.height,
          i,
          name
        )
      );
    }
    this.#playlist.push(
      new AudioDrop(
        data.x,
        data.y + 60 + (c + 1) * data.height,
        data.width,
        data.height
      )
    );
  }

  //hitcheck method to show/unshow track/audio drop display.
  hitCheck() {
    const data = this._data();
    if (this._check() == true) {
      this.#showTracks = !this.#showTracks;

      return true;
    }
    if (this.#showTracks == true) {
      for (let i = 0; i < this.#playlist.length - 1; i++) {
        if (this.#playlist[i].hitCheck()) {
          return true;
        }
      }
    }
    return false;
  }

  //draw method to render playlist, playlist tracks and audio drop section.
  draw() {
    const data = this._data();
    if (this.#showTracks || !sound.isPlaying()) {
      this._setalpha(255);
    } else {
      if (!this._check()) {
        this._setalpha(data.alpha - 2);
      } else {
        this._setalpha(255);
      }
    }
    if (
      this.#initialized == false ||
      soundPlaylist.length != this.#playlist.length - 1
    ) {
      this.#init();
      this.#initialized = true;
    }
    push();
    noFill();
    stroke(255, 255, 255, data.alpha);

    if (this.#showTracks) {
      for (let i = 0; i < this.#playlist.length; i++) {
        this.#playlist[i].draw();
      }

      beginShape();
      vertex(data.x + (9.2 / 10) * data.width, data.y + (7 / 10) * data.height);
      vertex(data.x + (9.2 / 10) * data.width + 20, data.y + 15);
      vertex(
        data.x + (9.2 / 10) * data.width + 40,
        data.y + (7 / 10) * data.height
      );
      endShape();
    } else {
      this.#playlist[this.#playlist.length - 1].update();
      beginShape();
      vertex(data.x + (9.2 / 10) * data.width, data.y + 15);
      vertex(
        data.x + (9.2 / 10) * data.width + 20,
        data.y + (7 / 10) * data.height
      );
      vertex(data.x + (9.2 / 10) * data.width + 40, data.y + 15);
      endShape();
    }
    push();
    if (this._check()) {
      strokeWeight(5);
    }
    noFill();
    stroke(255, 255, 255, data.alpha);
    rect(data.x, data.y, data.width, data.height);
    let string;
    if (soundPlaylist[selectedSoundIndex].isLoaded()) {
      if (
        this.#playlist[selectedSoundIndex % this.#playlist.length].Data.name
          .length > 24
      ) {
        string =
          this.#playlist[selectedSoundIndex % this.#playlist.length].Data.name
            .slice(0, 25)
            .toUpperCase() + "...";
      } else {
        string =
          this.#playlist[
            selectedSoundIndex % this.#playlist.length
          ].Data.name.toUpperCase();
      }
    } else {
      string = "LOADING...";
    }
    pop();
    stroke(255, 255, 255, data.alpha);
    text("NOW PLAYING: " + string, data.x + 20, data.y + 35);
    pop();
  }
}

//Track button class for display/changing selected song based on the button clicked.
class TrackButton extends Button {
  #index;
  #name;
  #deletebutton;
  //constructor properties of track button class, contains a delete button object.
  constructor(x, y, width, height, index, name) {
    super(x, y, width, height);
    this.#index = index;
    this.#name = name;
    this.#deletebutton = new DeleteButton(
      this.Data.x + (9.2 / 10) * this.Data.width,
      this.Data.y + 10,
      40,
      (6 / 10) * this.Data.height,
      this.#index
    );
  }

  //public get method for playlist to access and get required data from track button
  get Data() {
    return {
      x: this._data().x,
      y: this._data().y,
      width: this._data().width,
      height: this._data().height,
      index: this.#index,
      name: this.#name,
    };
  }

  //public method called by playlist to set track button's index property
  setIndex(value) {
    this.#index = value;
  }

  //public draw method to render the button on canvas.
  draw() {
    const data = this._data();
    push();
    this.#deletebutton.draw();
    textStyle(NORMAL);
    if (this._check() == true) {
      textStyle(BOLD);
    }
    if (soundPlaylist[this.#index].isLoaded()) {
      if (this.#name.length > 34) {
        this.#name = this.#name.slice(0, 35);
        text(
          this.#index + 1 + " : " + this.#name.toUpperCase() + "...",
          data.x + 20,
          data.y + 35
        );
      } else {
        text(
          this.#index + 1 + " : " + this.#name.toUpperCase(),
          data.x + 20,
          data.y + 35
        );
      }
    } else {
      text("LOADING...", data.x + 20, data.y + 35);
    }
    if (this.#index == selectedSoundIndex) {
      noFill();
      stroke(0, 125, 255);
      rect(data.x, data.y, data.width, data.height);
    }
    pop();
  }

  //hitcheck method to change selected song.
  hitCheck() {
    if (this.#deletebutton.hitCheck()) {
      return true;
    } else {
      if (this._check() == true) {
        selectedSoundIndex = this.#index;
        if (sound.isPlaying()) {
          sound.stop();
          sound = soundPlaylist[selectedSoundIndex];
          sound.loop();
        } else {
          sound.stop();
          sound = soundPlaylist[selectedSoundIndex];
        }
        return true;
      }
    }
    return false;
  }
}

//Delete button class to delete songs from soundPlaylist
class DeleteButton extends Button {
  #index;
  //constructor properties of class
  constructor(x, y, width, height, index) {
    super(x, y, width, height);
    this.#index = index;
  }

  //public hitcheck method to delete song from soundPlaylist and change selected sound index appropiately
  hitCheck() {
    if (this._check() == true) {
      if (soundPlaylist.length > 1) {
        if (this.#index == selectedSoundIndex) {
          sound.stop();
        }
        soundPlaylist.splice(this.#index, 1);
        if (this.#index < selectedSoundIndex) {
          selectedSoundIndex--;
        } else if (this.#index == selectedSoundIndex) {
          selectedSoundIndex = soundPlaylist.length - 1;
        }

        sound = soundPlaylist[selectedSoundIndex];
      } else {
        alert("Only 1 song remaining, add more before deleting");
      }
      return true;
    } else {
      return false;
    }
  }

  // public draw method to display the delete button.
  draw() {
    const data = this._data();
    push();
    if (this._check()) {
      stroke(255, 0, 0);
      strokeWeight(4);
    } else {
      stroke(255);
      strokeWeight(2);
    }
    rect(data.x, data.y, data.width, data.height);

    line(
      data.x + 10,
      data.y + 10,
      data.x + data.width - 10,
      data.y + data.height - 10
    );
    line(
      data.x + 10,
      data.y + data.height - 10,
      data.x + data.width - 10,
      data.y + 10
    );
    pop();
  }
}

// Audio drop class to add songs into the playlist.
class AudioDrop extends Button {
  #show;
  // constructor properties for class
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.display;
    this.#show = false;
  }

  // public get method for playlist to access class data.
  get Data() {
    return this._data();
  }

  // private init method runs once. Setting display and show status
  #init() {
    this.display = createDiv("DRAG FILE HERE");
    this.#show = true;
  }

  // public draw method called by controls to display audio drop section
  draw() {
    if (!this.#show) {
      this.#init();
    }
    push();
    this.display.style("color", "white");

    this.display.style("font-size", "32px");
    this.display.style("border-style", "dotted");
    this.display.style("width", (this.Data.width - 8).toString() + "px");
    this.display.style("height", this.Data.height.toString() + "px");
    this.display.style("text-align", "center");
    this.display.style("padding-top", "10px");
    this.display.position(this.Data.x, this.Data.y);

    this.display.dragOver(() => {
      this.display.style("background-color", "rgba(255,255,255,0.5)");
    });
    this.display.dragLeave(() => {
      this.display.style("background-color", "rgba(0,0,0)");
    });
    let errCount = 0;
    this.display.drop((file) => {
      if (soundPlaylist.length < 10) {
        soundPlaylist.push(loadSound(file));
        sound.stop();
        selectedSoundIndex = soundPlaylist.length - 1;
        sound = soundPlaylist[selectedSoundIndex];
        removeElements();
      } else {
        if (errCount < 1) {
          alert(
            "Too many tracks, Please delete some tracks before proceeding."
          );
          errCount++;
        }
      }
    });
    pop();
  }

  //public update method called by playlist to change status and remove element
  update() {
    this.#show = false;
    removeElements();
  }
}

// Mode button class for ripples visualization to switch rendering modes.
class ModeButton extends Button {
  #preloaded;
  #font;
  //constructor properties for class
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.#preloaded = false;
    this.#font;
  }

  //private init method that runs once, loads otf font for WEBGL graphics context
  #init() {
    this.#font = loadFont("font/LMR.otf");
    this.#preloaded = true;
  }

  //public draw method called by ripples visualisation. Displays the button .
  draw(contextGraphics, sphereMode) {
    if (!this.#preloaded) {
      this.#init();
    }
    contextGraphics.textFont(this.#font);
    contextGraphics.push();
    if (this._check()) {
      contextGraphics.fill(150);
    } else {
      contextGraphics.noFill();
    }
    contextGraphics.stroke(255);
    const data = this._data();
    const realX = data.x - width / 2;
    const realY = data.y - height / 2;
    contextGraphics.rect(realX, realY, data.width, data.height);
    let string;
    if (sphereMode) {
      string = "SPHERE";
    } else {
      string = "GRID";
    }
    contextGraphics.textSize(30);
    contextGraphics.fill(255);
    contextGraphics.text(
      "MODE: " + string,
      realX + 45,
      realY + (3 * data.height) / 4
    );
    contextGraphics.pop();
  }

  //Public hitcheck method called by ripples visualisation.
  hitCheck() {
    if (this._check()) {
      return true;
    } else {
      return false;
    }
  }
}

//Scrubber class to jump to different time in audio.
class Scrubber extends Button {
  #currentTime;
  #totalTime;
  #timeString;
  #scrubButton;
  //constructor properties of class
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.#currentTime;
    this.#totalTime;
    this.#scrubButton = new ScrubButton(
      this._data().x + 50,
      this._data().y + this._data().height / 2,
      this._data().x + 50,
      this._data().x + (4 / 5) * this._data().width - 50
    );
  }

  // private update method to update alpha and property values.
  #update() {
    if (this._check() || !sound.isPlaying()) {
      this._setalpha(255);
      const data = this._data();
    } else {
      this._setalpha(this._data().alpha - 2);
    }
    this.#timeString = this.#timeCheck(Math.floor(sound.currentTime() % 60));
    this.#currentTime =
      Math.floor(sound.currentTime() / 60) +
      this.#timeString +
      Math.floor(sound.currentTime() % 60);
    this.#timeString = this.#timeCheck(Math.floor(sound.duration() % 60));
    this.#totalTime =
      Math.floor(sound.duration() / 60) +
      this.#timeString +
      Math.floor(sound.duration() % 60);
  }

  //public draw method to display the time of audio against total duration
  draw() {
    push();
    const data = this._data();
    this.#update();
    fill(255, 255, 255, data.alpha);
    if (
      this._check() &&
      mouseX > data.x + 50 &&
      mouseX < data.x + (4 / 5) * data.width - 50
    ) {
      ellipse(mouseX, data.y + data.height / 2, 20);
    }
    if (data.alpha > 0) {
      text(
        this.#currentTime + " / " + this.#totalTime,
        data.x + (4 / 5) * data.width,
        data.height + 15
      );
    }
    this.#scrubButton.draw(data.alpha);
    pop();
  }

  //public method to check if it is clicked
  hitCheck() {
    const data = this._data();
    if (
      this._check() &&
      mouseX > data.x + 50 &&
      mouseX < data.x + (4 / 5) * data.width - 50
    ) {
      const jumpVal = map(
        mouseX,
        data.x + 50,
        data.x + (4 / 5) * data.width - 50,
        0,
        sound.duration()
      );
      sound.jump(jumpVal);
      return true;
    }
    return false;
  }

  //private timecheck method to change display format.
  #timeCheck(time) {
    if (time.toString().length < 2) {
      return ":0";
    } else {
      return ":";
    }
  }
}

//Scrub button class to display position of audio in time bar
class ScrubButton extends Button {
  #startX;
  #endX;
  #eSize;
  // constructor properties of class
  constructor(x, y, startX, endX) {
    super(x, y);
    this.#startX = startX;
    this.#endX = endX;
    this.#eSize = 20;
  }

  // private update method to change x property values
  #update() {
    const data = this._data();
    this._setX(
      map(sound.currentTime(), 0, sound.duration(), this.#startX, this.#endX)
    );
  }

  //public draw method to display position of audio in time bar
  draw(alpha) {
    this.#update();
    const data = this._data();
    const size = map(alpha, 0, 255, 0, 5);
    strokeWeight(2 + size);
    stroke(255, 0, 0, alpha);
    line(this.#startX, data.y, data.x, data.y);
    stroke(255, 255, 255, alpha);
    line(data.x, data.y, this.#endX, data.y);
    if (alpha < 250 && this.#eSize > 0) {
      this.#eSize -= 1;
    } else if (alpha > 250) {
      this.#eSize = 20;
    }
    fill(255, 0, 0);
    stroke(255, 0, 0);
    if (this.#eSize > 0) {
      ellipse(data.x, data.y, this.#eSize);
    }
  }
}
