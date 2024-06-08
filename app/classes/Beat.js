import Track from "./Track.js";

export default class Beat {
  /**
   * HTML element of the Beat object
   * @type {HTMLElement|undefined}
   */
  htmlElement;

  /**
   * Track object reference
   * @type {Track|undefined}
   */
  track;

  /**
   * Show if beat is active or not
   * @type {boolean}
   */
  disabled = true;

  /**
   * @param {Track} track 
   */
  constructor(track) {
    this.track = track;
    const beat = document.createElement("div");

    //Assigning custom css class with special color of beat element based of track index
    beat.className = `beat beat-track-${track.index + 1} beat-disabled`;

    beat.addEventListener("click", function() {
      this.disabled = !this.disabled;
      this.htmlElement.classList.toggle("beat-disabled");
      console.log(this)
    }.bind(this))

    this.htmlElement = beat;
  }
}
