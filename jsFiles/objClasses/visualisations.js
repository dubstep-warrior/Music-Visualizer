//Visualization class instantiated by the main sketch file. Used as a storage for instantiated visualizations. add method is called by main sketch file to add instantiated visualizations into its constructor array. selectVisual method is called by controlsAndInput file to display the selected instantiated visualization stored in its constructor array.
class Visualisations {
  #visuals;
  #selectedVisual;
  //Constructor properties of Visualisation class.
  constructor() {
    this.#visuals = [];
    this.#selectedVisual = null;
  }

  //Public getter to return selected visual called by main sketch file.
  get selectedVisual() {
    return this.#selectedVisual;
  }

  //Public getter to return visuals array called by control and input file.
  get visuals() {
    return this.#visuals;
  }

  //Public add method called by main sketch file to add and store instantiated visual class objects into #visuals array.
  add(vis) {
    this.#visuals.push(vis);
    //if selectedVisual is null set the new visual as the
    //current visualiation
    if (this.#selectedVisual == null) {
      this.selectVisual(vis.name);
    }
  }

  //Public selectvisual method called by control and inputs file to change selected visual property.
  selectVisual(visName) {
    for (let i = 0; i < this.#visuals.length; i++) {
      if (visName == this.#visuals[i].name) {
        this.#selectedVisual = this.#visuals[i];
      }
    }
  }
}
