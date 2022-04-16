//Abstract classes with protected/public accesor methods to the main private data structure. Cannot be instantiated.
class Ring {
  #vertexSys;
  #ringRad;
  #midX;
  #midY;
  //Constructor properties of abstract class Ring. Contains private array and several essential properties relating to a ring.
  constructor(ringRad, midX, midY) {
    if (this.constructor == Ring) {
      throw new Error("Abstract Classes cannot be instantiated");
    }
    this.#vertexSys = [];
    this.#ringRad = ringRad;
    this.#midX = midX;
    this.#midY = midY;
  }

  //Protected accessor to set private array's data.
  _setVertexData(vertex) {
    this.#vertexSys.push(vertex);
  }

  //Protected accessor to set private property's data.
  _setRingRadius(value) {
    this.#ringRad = value;
  }

  //Public getter to return constructor properties.
  get Data() {
    return {
      vertexSys: this.#vertexSys,
      ringRad: this.#ringRad,
      midX: this.#midX,
      midY: this.#midY,
    };
  }

  //Protected accessor to update private array item's attribute.
  _updateSys(index, attribute, value) {
    this.#vertexSys[index][attribute] = value;
  }

  //Protected accessor to swap item positions in the private array.
  _swap(index1, index2) {
    let temp = this.#vertexSys[index2];
    this.#vertexSys[index2] = this.#vertexSys[index1];
    this.#vertexSys[index1] = temp;
  }
}

//Spectrum Ring instantiated by the Spectrum Ring system. Extending the Ring abstract class, contain data points that models a circle, which is updated by the specRingsys.
class SpecRing extends Ring {
  //Constructor properties of spec ring is inherited from abstract class Ring.
  constructor(ringRad, midX, midY) {
    super(ringRad, midX, midY);
  }

  //Public init method called by Spec system's init method. Initialises data to form a ring using a reference to gridData. Makes use of parent protected accessors.
  init(gridData) {
    const data = this.Data;
    for (let theta = 0; theta < 2 * PI; theta += (2 * PI) / 180) {
      const ringX = data.midX + data.ringRad * cos(theta);
      const ringY = data.midY + data.ringRad * sin(theta);
      const ringZ = 0;
      if (gridData) {
        for (let i = 0; i < gridData.length; i++) {
          if (
            ringX < gridData[i].x + 3 &&
            ringX > gridData[i].x - 3 &&
            ringY < gridData[i].y + 3 &&
            ringY > gridData[i].y - 3
          ) {
            const vertex = {
              h: null,
              x: ringX,
              y: ringY,
              z: ringZ,
              period: null,
            };
            this._setVertexData(vertex);
          } else {
            continue;
          }
        }
      } else {
        const vertex = {
          h: null,
          x: ringX,
          y: ringY,
          z: ringZ,
          period: null,
        };
        this._setVertexData(vertex);
      }
    }
  }

  //Update method called by Spec ring systems update method, uses parent protected methods to update several object attributes.
  update(index, amplitude, period) {
    this._updateSys(index, "z", amplitude);
    this._updateSys(index, "period", period);
    const hue = map(period, 0, 12, 175, 720) % 360;
    this._updateSys(index, "h", hue);
  }
}

//Oscillation Ring instantiated by the Oscillation Ring System. Extending the abstract class Ring, contains data points that models a circle, which is updated by oscRingSys
class OscRing extends Ring {
  #zVal;

  //Constructor properties of osc ring is inherited from abstract class Ring with an addition z value.
  constructor(ringZ, ringRad, midX, midY) {
    super(ringRad, midX, midY);
    this.#zVal = ringZ;
  }

  //Public getter to return z value property
  get zValue() {
    return this.#zVal;
  }

  //Public update method called by Osc systems update method. Updates ringRadius property using parent protected accessor.
  update() {
    const ringRad = this.Data.ringRad;
    this._setRingRadius(ringRad + 8);
  }
}

//Box Ring instantiated by the Box System. Extending the abstract class Ring, contain data points that model a circle. The Box System calls on it's update and render methods,
class BoxRing extends Ring {
  #index;
  #boxCount;
  #factor;

  //Constructor properties of box ring is inherited from abstract class Ring with additional values.
  constructor(ringRad, index, boxCount, factor) {
    super(ringRad);
    this.#index = index;
    this.#boxCount = boxCount;
    this.#factor = factor;
  }

  //Public init method called by the box system init method. Initializes the data in it's parent's private array using protected accessors.
  init() {
    const data = this.Data;
    for (let i = 0; i < this.#boxCount; i++) {
      let globalHue;
      const theta = map(i, 0, this.#boxCount, 0, 2 * PI);
      const x = data.ringRad * cos(theta);
      const y = data.ringRad * sin(theta);

      const localHue = map(i, 0, this.#boxCount, 0, 165);
      if (localHue > 165 / 2) {
        globalHue = (330 + this.#index * 82.5 + 82.5 - localHue) % 360;
      } else {
        globalHue = (330 + this.#index * 82.5 + localHue) % 360;
      }
      const spectrumIndex = this.#index * 200 + i * this.#factor;
      const vertex = {
        x: x,
        y: y,
        height: null,
        globalHue: globalHue,
        spectrumIndex: spectrumIndex,
        saturation: null,
        lightness: null,
      };
      this._setVertexData(vertex);
    }
  }

  //Public update method called by Box Sys update method. Updates data item attributes in private array through protected accessors.
  update() {
    const spectrum = fourier.analyze();
    const vertexData = this.Data.vertexSys;
    for (let i = 0; i < vertexData.length; i++) {
      const vertice = vertexData[i];
      const spectrumIndex = vertice.spectrumIndex;
      const boxHeight = map(
        spectrum[spectrumIndex],
        0,
        255,
        5,
        255 - this.#index * 50
      );

      const saturation = map(spectrum[spectrumIndex], 0, 255, 15, 100);
      const lightness = map(
        Math.pow(1.02, boxHeight),
        1.1,
        Math.pow(1.02, 255 - this.#index * 50),
        5,
        45
      );

      this._updateSys(i, "height", boxHeight);
      this._updateSys(i, "saturation", saturation);
      this._updateSys(i, "lightness", lightness);
      if (vertice.globalHue < (330 + this.#index * 82.5 + 82.5 / 2) % 360) {
        this._updateSys(i, "globalHue", vertice.globalHue + 1);
      } else {
        this._updateSys(i, "globalHue", (330 + this.#index * 82.5) % 360);
      }
    }
  }

  //Public render method called by BoxSys update method. Takes in the current graphics context the draw visualisation.
  render(graphicsContext) {
    const vertexData = this.Data.vertexSys;
    for (let i = 0; i < vertexData.length; i++) {
      graphicsContext.directionalLight(255, 255, 255, 1, -1, -1);
      graphicsContext.ambientLight(15);
      graphicsContext.colorMode(HSL, 359, 100, 50);
      graphicsContext.noStroke();
      graphicsContext.ambientMaterial(
        vertexData[i].globalHue,
        vertexData[i].saturation,
        vertexData[i].lightness
      );

      graphicsContext.translate(
        vertexData[i].x,
        vertexData[i].y,
        vertexData[i].height / 2
      );
      graphicsContext.box(10, 10, vertexData[i].height);
      graphicsContext.translate(
        -vertexData[i].x,
        -vertexData[i].y,
        -vertexData[i].height / 2
      );
    }
  }
}

//Particle System that is used in the ridgePlots and Ripples visualization. Extending the abstract class Ring, contains particle data in array inherited from parent class and manages/render particle data.
class ParticleSys extends Ring {
  #startX;
  #spectrumWidth;
  #startY;
  #endY;
  #speed;
  #beatTick;
  #startZ;
  #endZ;
  #spawnNo;
  #activatedCount;

  //Constructor properties of particle sys inherits Ring properties and additional properties of its own.
  constructor(
    ringRad,
    startingX,
    specWidth,
    startingY,
    endingY,
    spd,
    startZ,
    endZ,
    spawnNo
  ) {
    super(ringRad);
    this.#startX = startingX;
    this.#spectrumWidth = specWidth;
    this.#startY = startingY;
    this.#endY = endingY;
    this.#speed = spd;
    this.#beatTick = 0;
    this.#startZ = startZ;
    this.#endZ = endZ;
    this.spawnNo = spawnNo;
    this.#activatedCount = 0;
  }

  //Public getter returning Spawn number.
  get SpawnNo() {
    return this.#spawnNo;
  }

  //Public init method called by visualisation's init method. Initializes particle data in parent's private array using protected accessors.
  init() {
    for (let i = 0; i < 3000; i++) {
      const particleZ = random(this.#startZ, this.#endZ);
      const particleX = random(
        this.#startX,
        this.#startX + this.#spectrumWidth
      );
      const particleY = this.#startY;
      const particle = {
        originalZ: particleZ,
        originalY: particleY,
        x: particleX,
        y: particleY,
        z: particleZ,
        index: i,
        activated: false,
      };
      this._setVertexData(particle);
    }
  }

  //Public update method called by visualization's draw method, updates private array item's attribute using protected modifiers.
  update(contextGraphics, moveZ, beat) {
    const data = this.Data;
    const ringRad = data.ringRad;
    if (beat) {
      this.#generateParticle();
    }
    for (let i = 0; i < data.vertexSys.length; i++) {
      if (i >= this.#activatedCount) {
        break;
      }
      const vertex = data.vertexSys[i];
      if (vertex.y > this.#endY) {
        this._swap(i, this.#activatedCount - 1);
        this._updateSys(this.#activatedCount - 1, "activated", false);
        this.#activatedCount--;
      }
      if (vertex.activated) {
        this.#render(vertex, contextGraphics, ringRad, moveZ);
        if (beat && contextGraphics.name === "ridgeplot") {
          this._updateSys(i, "y", vertex.y + 3 * this.#speed);
          if (this.#beatTick < 255) {
            this.#beatTick += 20;
          }
        } else {
          this._updateSys(i, "y", vertex.y + this.#speed);
          if (this.#beatTick > 0) {
            this.#beatTick -= 20;
          }
        }
        if (moveZ) {
          this._updateSys(i, "z", vertex.z + 1);
        }
      }
    }
  }

  // Private method called by update method. Takes in current context graphics to draw visualisation.
  #render(vertex, contextGraphics, ringRad, moveZ) {
    contextGraphics.push();
    const spectrum = fourier.analyze();
    const spectralCentroid = fourier.getCentroid();
    let alphaVal = 255;
    if (!moveZ) {
      contextGraphics.rotateX(-PI / 3);
      alphaVal = map(vertex.y, this.#startY, this.#endY, 255, 0);
    }
    const rgbVal = map(spectralCentroid, 0, 8000, 0, 255);
    const rVal = this.#beatTick;
    contextGraphics.stroke(
      rgbVal + rVal,
      rgbVal - 80 - rVal,
      255 - rgbVal,
      alphaVal
    );
    contextGraphics.translate(vertex.x, vertex.y, vertex.z);
    contextGraphics.sphere(ringRad * 2);
    contextGraphics.translate(-vertex.x, -vertex.y, -vertex.z);
    contextGraphics.pop();
  }

  //Private method called by update method to activate non activated particles to be rendered.
  #generateParticle() {
    let i = this.spawnNo;
    const data = this.Data;
    while (i > 0) {
      const index = Math.floor(
        random(this.#activatedCount, data.vertexSys.length - 0.0001)
      );
      this._swap(index, this.#activatedCount);
      this._updateSys(this.#activatedCount, "activated", true);
      this.#activatedCount++;
      this._updateSys(
        this.#activatedCount,
        "y",
        data.vertexSys[index].originalY
      );
      this._updateSys(
        this.#activatedCount,
        "z",
        data.vertexSys[index].originalZ
      );
      i--;
    }
  }
}

//Line that is instantiated by the Wave System. Extended from the abstract class Ring, Contains data points of line and is updated by wave system.
class Line extends Ring {
  #startX;
  #startY;
  #spectrumWidth;

  //Constructor properties inherited from parent abstract class Ring with additional properties.
  constructor(startX, startY, spectrumWidth) {
    super();
    this.#startX = startX;
    this.#startY = startY;
    this.#spectrumWidth = spectrumWidth;
  }

  //Public init method called by Wave System's add method. Initializes point data and adds into parent's private array using protected accessors.
  init() {
    const spectrum = fourier.analyze();
    const scale = 8;
    let x, y, z;
    for (let i = 0; i < spectrum.length; i += 30) {
      if (i % 10 == 0) {
        x = map(
          i,
          0,
          1024,
          this.#startX,
          this.#spectrumWidth / 2 + this.#startX
        );
        y = 0;
        z = map(spectrum[i], 0, 255, 0, scale * 255);
        this._setVertexData({
          x: x,
          y: this.#startY + y,
          z: z,
        });
      }
    }
    for (let i = spectrum.length - 4; i > -30; i -= 30) {
      if (i % 10 == 0) {
        x = map(
          i,
          1024,
          0,
          this.#spectrumWidth / 2 + this.#startX,
          this.#startX + this.#spectrumWidth
        );
        y = 0;
        z = map(spectrum[i], 0, 255, 0, scale * 255);
        this._setVertexData({
          x: x,
          y: this.#startY + y,
          z: z,
        });
      }
    }
  }
}
