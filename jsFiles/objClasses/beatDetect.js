//Beat Detector Class that is instantiated by the Ridge Plot and Ripples visualization. Runs fourier.analyze data through it's algorithm and returns a boolean indicating if there is a beat detected.
class BeatDetector {
  #sampleBuffer;
  //Constructor properties of Beat Detector class.
  constructor() {
    this.name = "beatDetect";
    this.#sampleBuffer = [];
  }

  //Main Beat Detection method called to return true if beat is detected.
  beatDetect() {
    const spectrum = fourier.analyze();
    let beatDetected = false;
    let sum = 0;
    for (let i = 0; i < spectrum.length; i++) {
      sum += spectrum[i] * spectrum[i];
    }

    if (this.#sampleBuffer.length > 59) {
      let sampleAverage;
      let sampleSum = 0;
      let varianceSum = 0;
      for (let i = 0; i < this.#sampleBuffer.length; i++) {
        sampleSum += this.#sampleBuffer[i];
      }

      sampleAverage = sampleSum / this.#sampleBuffer.length;

      for (let i = 0; i < this.#sampleBuffer.length; i++) {
        varianceSum = Math.abs(sampleAverage - sum);
      }

      const variance = varianceSum / this.#sampleBuffer.length;
      const c = -0.000015 * variance + 1.5;

      if (sum > sampleAverage * c) {
        beatDetected = true;
      }

      this.#sampleBuffer.splice(0, 1);
      this.#sampleBuffer.push(sum);
    } else {
      if (tick % 5 == 0) {
        this.#sampleBuffer.push(sum);
      }
    }

    return beatDetected;
  }
}
