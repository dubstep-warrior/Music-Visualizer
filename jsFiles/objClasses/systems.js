//Abstract classes with protected/public accesor methods to the main private data structure. Cannot be instantiated.
class Sys {
  #sys;
  //Constructor properties of abstract Sys class.
  constructor() {
    this.#sys = [];
    if (this.constructor == Sys) {
      throw new Error("Abstract Classes cannot be instantiated");
    }
  }

  //Public getter to return private array
  get Data() {
    return this.#sys;
  }

  //Protected accessor to push data into array.
  _addNewRing(ring) {
    this.#sys.push(ring);
  }

  //Protected accessor to remove data from array.
  _removeRing(position, number) {
    this.#sys.splice(position, number);
  }
}

//Spectrum Ring system used in Ripples visualization. Extended from abstract class 'Sys', manages specRing objects.
class SpecRingSys extends Sys {
  #gridDimension;
  #startPos;
  #gridSpace;
  #midX;
  #midY;

  //Constructor properties of Spec Ring class. Inherit's abstract classes constructor properties.
  constructor(midX, midY, gridDimension, gridSpace, startPos) {
    super();
    this.#gridDimension = gridDimension;
    this.#startPos = startPos;
    this.#gridSpace = gridSpace;
    this.#midX = midX;
    this.#midY = midY;
  }

  //Public getter Data overriding abstract class's getter. Also returns abstracts class's getter Data in sys attribute.
  get Data() {
    return {
      gridDimension: this.#gridDimension,
      startPos: this.#startPos,
      gridSpace: this.#gridSpace,
      midX: this.#midX,
      midY: this.#midY,
      sys: super.Data,
    };
  }

  //Public init method called by Ripples init method. Initializes grid data using parent class protected accessors. Instantiate Ring objects and adds them into parent class array.
  init(gridData) {
    const gridLength = (this.#gridDimension - 1) * this.#gridSpace;
    for (let i = 0; i < 4; i++) {
      const ring = new SpecRing(
        ((2 + i) / 10) * gridLength,
        this.#midX,
        this.#midY
      );
      ring.init(gridData);
      this._addNewRing(ring);
    }
  }

  //Public update method called by Ripple's draw method. Updates Ring data with fourier analyzed data.
  update() {
    const spectrum = fourier.analyze();
    const amplitudeTime = (tick * PI) / 15;
    const spectrumbinLength = spectrum.length / 4;
    for (let i = 0; i < spectrum.length; i++) {
      const bin = Math.floor(i / spectrumbinLength);
      const period = Math.floor(map(spectrum[i], 0, 255, 0, 12));
      const vertexSys = this.Data.sys[bin].Data.vertexSys;
      const vIndex = Math.floor(
        map(
          i - bin * spectrumbinLength,
          0,
          spectrumbinLength,
          0,
          vertexSys.length - 1
        )
      );
      const amplitude = 4 * (sin(period * amplitudeTime - PI / 2) + 1);
      this.Data.sys[bin].update(vIndex, amplitude, period);
    }
  }
}

//Oscillation System used in Ripples visualization. Extended from it's parent class specRingSys, manages oscRing objects using a beat detector object.
class OscSys extends SpecRingSys {
  //Constructor properties of Osc Ring class. Inherit's abstract classes constructor properties.
  constructor(midX, midY, gridDimension, gridSpace) {
    super(midX, midY, gridDimension, gridSpace);
  }

  //Private method to add new data into the parent class array. Uses parents protected accessors to do so.
  #oscAddWave() {
    const data = this.Data;
    const startHue = Math.floor(random(0, 90));
    for (let i = 30; i < 180; i += 30) {
      const val = (i * PI) / 180;
      const radius = i / 6 - 5;
      const height = 10;
      const ringZ = height * sin(val);
      const ring = new OscRing(ringZ, radius, data.midX, data.midY);
      const wave = {
        l: map(ringZ, 0, height, 25, 42),
        vertices: ring,
      };
      this._addNewRing(wave);
    }
  }

  //Public method to update data in parent class array. Does so by calling private method #oscAddWave and protected accessors in abstract parent class.
  update(beat) {
    const data = this.Data;
    const gridRadius =
      Math.sqrt(
        Math.pow((data.gridDimension + 1) * data.gridSpace, 2) +
          Math.pow((data.gridDimension + 1) * data.gridSpace, 2)
      ) / 2;
    this.Data.sys.forEach(function (ring) {
      ring.vertices.update();
    });
    if (
      this.Data.sys.length > 3 &&
      this.Data.sys[4].vertices.Data.ringRad > gridRadius + 100
    ) {
      this._removeRing(0, 5);
    }

    if (beat && frameCount % 15 == 0) {
      this.#oscAddWave();
    }
  }
}

//Box System used in the blocks visualization. Extended from abstract class 'Sys', manages boxRing objects.
class BoxSys extends Sys {
  //Constructor properties inherited from abstract parent class Sys
  constructor() {
    super();
  }

  //Initialize method called by the Block's init method. Updates parent class's private array using protected accessors, pushing in instantiated BoxRing objects.
  init() {
    for (let i = 0; i < 4; i++) {
      const radius = 50 + i * 130;
      const boxCount = 10 + i * 30;
      let factor = Math.floor(180 / boxCount);
      if (i == 4) {
        factor = Math.floor(100 / boxCount);
      }
      const bin = {
        no: i,
        radius: radius,
        boxCount: boxCount,
        factor: factor,
        vertices: new BoxRing(radius, i, boxCount, factor),
      };
      bin.vertices.init();
      this._addNewRing(bin);
    }
  }

  //Public method called by Ripples draw method. Calls BoxRing objects' update and render method, these objects being stored in parent class private array.
  render(graphicsContext) {
    for (let i = 0; i < this.Data.length; i++) {
      this.Data[i].vertices.update();
      this.Data[i].vertices.render(graphicsContext);
    }
  }
}

//Wave System used in the ridgePlots visualization. Extended from abstract class 'Sys', manages line objects.
class WaveSys extends Sys {
  #startX;
  #startY;
  #spectrumWidth;
  #endY;
  #speed;

  //Constructor properties of WaveSys class, inherits properties from parent abstract class Sys.
  constructor(startX, spectrumWidth, startY, endY, speed) {
    super();
    this.#startX = startX;
    this.#startY = startY;
    this.#spectrumWidth = spectrumWidth;
    this.#endY = endY;
    this.#speed = speed;
  }

  //Private add method called by class's update method. Instantiate Line class objects and adds them into parent class private array using protected accessor.
  #add() {
    const line = new Line(this.#startX, this.#startY, this.#spectrumWidth);
    line.init();
    this._addNewRing(line);
  }

  //Public update method called by Ridge Plot visualisation. Updates Line objects data using protected accessors.
  update(beat) {
    const data = this.Data;

    if (frameCount % 10 == 0) {
      this.#add();
    }

    if (data.length > 0 && data[0].Data.vertexSys[0].y > this.#endY) {
      this._removeRing(0, 1);
    }

    for (let i = 0; i < data.length; i++) {
      const vertexSys = data[i].Data.vertexSys;
      for (let j = 0; j < vertexSys.length; j++) {
        if (beat) {
          data[i]._updateSys(j, "y", vertexSys[j].y + 3 * this.#speed);
        } else {
          data[i]._updateSys(j, "y", vertexSys[j].y + this.#speed);
        }
        if (vertexSys[j].z < (4 * 255) / 20) {
          const sinFactor = map(
            vertexSys[j].y,
            this.#startY,
            this.#endY,
            2 * PI,
            0
          );
          data[i]._updateSys(j, "z", vertexSys[j].z + 7 * sin(5 * sinFactor));
        }
      }
    }
  }

  //Public render method called by Ridge Plot visualisation. Render Line objects data through public getter in parent class.
  render(graphicsContext) {
    const data = this.Data;
    for (let i = 0; i < data.length; i++) {
      graphicsContext.fill(0);
      graphicsContext.strokeWeight(4);
      graphicsContext.beginShape(TRIANGLE_STRIP);
      const vertexSys = data[i].Data.vertexSys;
      for (let j = 0; j < vertexSys.length; j++) {
        if (
          data.length != 0 &&
          vertexSys.length != 0 &&
          i + 1 < data.length &&
          j + 1 < vertexSys.length
        ) {
          const vertex2 = data[i + 1].Data.vertexSys[j + 1];
          const meanColorMap = map(
            (vertexSys[j].z + vertex2.z + data[i + 1].Data.vertexSys[j].z) / 3,
            0,
            255 * 8,
            0,
            255
          );

          let b = 255 - meanColorMap * 1.5;
          if (b < 0) {
            b = 0;
          }

          graphicsContext.fill(meanColorMap, 0, b);
          graphicsContext.vertex(
            vertexSys[j].x,
            vertexSys[j].y,
            vertexSys[j].z
          );
          graphicsContext.vertex(vertex2.x, vertex2.y, vertex2.z);
        }
      }

      graphicsContext.endShape();
    }
  }
}

//Plot System used in the Needles visualization. Extended from abstract class 'Sys', it instantiate multiple Tick,Plot and Needle objects and manages them
class PlotSys extends Sys {
  #frequencyBins;
  #plotsAcross;
  #plotsDown;
  #minAngle;
  #maxAngle;
  #pad;
  #plotWidth;
  #plotHeight;
  #dialRadius;
  #ticks;
  #needles;

  //Constructor properties of Plot Sys class, inherits properties from parent abstract class Sys and initializes serveral properties of its own.
  constructor(frequencyBins, plots, minAngle, maxAngle) {
    super();
    this.#frequencyBins = frequencyBins;
    this.#plotsAcross = plots;
    this.#plotsDown = plots;
    this.#ticks = [];
    this.#needles = [];
    this.#minAngle = minAngle;
    this.#maxAngle = maxAngle;
    this.#pad;
    this.#plotWidth;
    this.#plotHeight;
    this.#dialRadius;
  }

  //Public initialize method called by Needles visualisation. Instantiate various class objects and pushes it into its own array and parents private array using protected accesors.
  init() {
    for (let i = 0; i < this.#plotsDown; i++) {
      for (let j = 0; j < this.#plotsAcross; j++) {
        const x = this.#pad + j * this.#plotWidth;
        const y = this.#pad + i * this.#plotHeight;
        const w = this.#plotWidth - this.#pad;
        const h = this.#plotHeight - this.#pad;
        this.#ticks.push(new Tick());
        this._addNewRing(new Plot());
        this.#needles.push(new Needle());
      }
    }
  }

  //Public resize method called by Needles Visualisation. Updates it's constructor properties that pertain to width and height of various class objects.
  resize() {
    this.#pad = width / 20;
    this.#plotWidth = (width - this.#pad) / this.#plotsAcross;
    this.#plotHeight = (height - this.#pad) / this.#plotsDown;
    this.#dialRadius = (this.#plotWidth - this.#pad) / 2 - 5;
  }

  //Public update method called by Needles visualisation. Updates instantiated objects' constructor properties and draws them by calling their update and render methods.
  update() {
    const data = this.Data;
    for (let i = 0; i < this.#plotsDown; i++) {
      for (let j = 0; j < this.#plotsAcross; j++) {
        const index = 2 * i + j;
        const x = this.#pad + j * this.#plotWidth;
        const y = this.#pad + i * this.#plotHeight;
        const w = this.#plotWidth - this.#pad;
        const h = this.#plotHeight - this.#pad;
        data[index].update(x, y, w, h);
        data[index].render();
        this.#ticks[index].update(
          this.#minAngle,
          this.#plotHeight,
          this.#dialRadius
        );
        this.#ticks[index].render(x + w / 2, y + h, this.#frequencyBins[index]);
        const spectrum = fourier.analyze();
        const energy = fourier.getEnergy(this.#frequencyBins[index]);
        this.#needles[index].update(
          energy,
          this.#minAngle,
          this.#maxAngle,
          this.#dialRadius
        );
        this.#needles[index].render(x + w / 2, y + h);
      }
    }
  }
}
