//Grid System used in the Ripples visualization. Primary functions of the system indicates that it does not need to inherit any properties/methods of other classes. It initializes with data points depicting a grid, and has it's z data values updated by referencing the oscillation and spectrum ring system.
class GridSys {
  #gridData;
  #maxCentroid;
  #gridDimension;
  #startPos;
  #gridSpace;
  #midX;
  #midY;

  //Constructor properties of GridSys class, does not inherit from any parent class.
  constructor(midX, midY, gridDimension, startPos, gridSpace) {
    this.#gridData = [];
    this.#maxCentroid = 5000;
    this.#gridDimension = gridDimension;
    this.#startPos = startPos;
    this.#gridSpace = gridSpace;
    this.#midX = midX;
    this.#midY = midY;
  }

  //Public getter returning private array
  get gridData() {
    return this.#gridData;
  }

  //Private method to update gridData items' attribute.
  #updateGridData(index, attribute, value) {
    this.#gridData[index][attribute] = value;
  }

  //Private method to update material data stored as an attribute in gridData items.
  #updateMaterialData(index, materialAttribute, value) {
    this.#gridData[index].material[materialAttribute] = value;
  }

  //Public method called by Ripples' init method. Initialises grid data information.
  init() {
    for (let i = 0; i < this.#gridDimension; i++) {
      for (let j = 0; j < this.#gridDimension; j++) {
        let theta;
        const x = this.#startPos + j * this.#gridSpace;
        const y = 2 * this.#startPos + i * this.#gridSpace;
        const mid = (this.#gridDimension + 1) / 2 - 0.5;
        const hypo = Math.sqrt(Math.pow(j - mid, 2) + Math.pow(i - mid, 2));
        const sine = (j - mid) / hypo;
        const cosine = (i - mid) / hypo;
        const alpha = Math.asin(Math.abs(sine));
        const beta = (alpha * 180) / PI;

        if (sine > 0 && cosine > 0) {
          theta = beta;
        } else if (sine > 0) {
          theta = 180 - beta;
        } else if (cosine > 0) {
          theta = 360 - beta;
        } else {
          theta = 180 + beta;
        }

        const sphere = {
          x: x,
          y: y,
          z: 0,
          t: map(theta, 0, 360, 0, 20),
          material: {
            h: 175,
            s: 100,
            l: 25,
          },
        };
        this.#gridData.push(sphere);
      }
    }
  }

  //Public render method called by Ripples' draw method. Draws the visualisation based on gridData's information.
  render(graphicsContext, sphereMode) {
    graphicsContext.push();
    graphicsContext.colorMode(HSL, 359, 100, 50);
    graphicsContext.translate(-width / 8, 0);
    graphicsContext.rotateX(PI / 3);
    graphicsContext.normalMaterial();
    if (sphereMode) {
      graphicsContext.directionalLight(10, 10, 10, 0, 0, -1);
      graphicsContext.ambientLight(40);
      for (let i = 0; i < this.#gridData.length; i++) {
        graphicsContext.specularMaterial(
          this.#gridData[i].material.h,
          this.#gridData[i].material.s,
          this.#gridData[i].material.l
        );
        graphicsContext.translate(
          this.#gridData[i].x,
          this.#gridData[i].y,
          this.#gridData[i].z
        );
        graphicsContext.sphere(5);
        graphicsContext.translate(
          -this.#gridData[i].x,
          -this.#gridData[i].y,
          -this.#gridData[i].z
        );
      }
    } else {
      graphicsContext.strokeWeight(2);
      graphicsContext.colorMode(HSL, 359, 100, 50);

      for (let i = 0; i < this.#gridData.length; i++) {
        const index = Math.floor(i / this.#gridDimension);
        const jIndex = i % this.#gridDimension;
        if (jIndex == 0) {
          graphicsContext.beginShape(TRIANGLE_STRIP);
        }
        if (
          index + 1 < this.#gridDimension &&
          jIndex + 1 < this.#gridDimension
        ) {
          const point1 = this.#gridData[index * this.#gridDimension + jIndex];
          const point2 =
            this.#gridData[
              index * this.#gridDimension + jIndex + this.#gridDimension + 1
            ];
          graphicsContext.stroke(0);
          graphicsContext.fill(
            (point1.material.h + point2.material.h) / 2,
            (point1.material.s + point2.material.s) / 2 + 20,
            (point1.material.l + point2.material.l) / 2 + 5
          );
          graphicsContext.vertex(point1.x, point1.y, point1.z);
          graphicsContext.vertex(point2.x, point2.y, point2.z);
        }

        if (jIndex == this.#gridDimension - 1) {
          graphicsContext.endShape();
        }
      }
    }
    graphicsContext.pop();
  }

  //Public update method called by Ripples' draw method. Updates grid data based on fourier centroid, spec ring and osc ring data.
  update(specRingSys, oscSys) {
    const spectralCentroid = fourier.getCentroid();

    if (spectralCentroid > this.#maxCentroid) {
      this.#maxCentroid = spectralCentroid;
    }
    const ringSysArray = specRingSys;
    const oscSysArray = oscSys;
    const centroidMap = map(spectralCentroid, 0, this.#maxCentroid, 0, 175);
    const floatingTick = (tick * PI) / 90;
    for (let k = 0; k < this.#gridData.length; k++) {
      this.#gridData[k].t += 0.5;
      const xLoc = map(
        k % (this.#gridDimension - 1),
        0,
        this.#gridDimension - 2,
        0,
        2 * PI
      );
      const floating =
        8 * sin(xLoc + 2 * floatingTick) + 40 * sin(floatingTick / 2);

      const gridPointRadSqr =
        Math.pow(this.#gridData[k].x - this.#midX, 2) +
        Math.pow(this.gridData[k].y - this.#midY, 2);
      const midEnergy = fourier.getEnergy("highMid", "treble");
      const gridPointRad = Math.sqrt(gridPointRadSqr);
      let midBump;
      if (gridPointRad < 65) {
        const range = map(gridPointRad, 0, 65, 0, PI);
        const bump = map(midEnergy, 0, 255, 0, 45);
        midBump = bump * cos(range / 2);
      } else {
        midBump = 0;
      }

      let material;
      if (this.#gridData[k].t % (this.#gridDimension + 1) > 20) {
        const h =
          215 - centroidMap - (this.#gridData[k].t % (this.#gridDimension + 1));
        material = {
          h: (map(midBump, 0, 45, h, -320) + 360) % 360,
          s: 50,
          l: 25,
        };
      } else {
        const h =
          175 - centroidMap + (this.#gridData[k].t % (this.#gridDimension + 1));
        material = {
          h: (map(midBump, 0, 45, h, -320) + 360) % 360,
          s: 50,
          l: 25,
        };
      }
      this.#updateGridData(k, "material", material);

      this.#updateGridData(k, "z", floating + midBump);

      if (specRingSys) {
        for (let i = 0; i < ringSysArray.length; i++) {
          const ringArray = ringSysArray[i].Data.vertexSys;
          if (Math.abs(gridPointRad - ringSysArray[i].Data.ringRad) < 4.5) {
            for (let j = 0; j < ringArray.length; j++) {
              const point = ringArray[j];
              if (
                point.x < this.#gridData[k].x + 3 &&
                point.x > this.#gridData[k].x - 3 &&
                point.y < this.#gridData[k].y + 3 &&
                point.y > this.#gridData[k].y - 3
              ) {
                const zVal = floating + point.z + midBump;
                this.#updateGridData(k, "z", zVal);
                const hue = map(
                  point.period,
                  0,
                  8,
                  this.#gridData[k].material.h,
                  720
                );
                const sat = map(point.period, 0, 8, 50, 100);
                this.#updateMaterialData(k, "h", hue);
                this.#updateMaterialData(k, "s", sat);
              }
            }
          }
        }
      }

      if (oscSys) {
        for (let i = 0; i < oscSysArray.length; i++) {
          const ringRadius = oscSysArray[i].vertices.Data.ringRad;
          if (Math.abs(ringRadius - gridPointRad) < 3) {
            const zVal = floating + midBump + oscSysArray[i].vertices.zValue;
            this.#updateGridData(k, "z", zVal);
            const light = oscSysArray[i].l;
            this.#updateMaterialData(k, "l", light);
          }
        }
      }
    }
  }
}
