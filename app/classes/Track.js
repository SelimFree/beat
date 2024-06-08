import Beat from "./Beat.js";

export default class Track {
  /**
   * @type {HTMLElement|undefined}
   */
  htmlElement;

  /**
   * Track index
   * @type {number}
   */
  index;

  /**
   * Audio element ref
   * @type {HTMLElement|undefined}
   */
  audio;

  /**
   * Current sound name 
   * @type {String|undefined}
   */
  audioName;

  /**
   * Interval id for using it later for deletion
   * @type {number}
   */
  mainLoop;

  /**
   * Beats per minute
   * @type {number}
   */
  bpm = 150;

  /**
   * Audio volume
   * @type {number}
   */
  volume = 1;

  /**
   * Step counter
   * @type {number}
   */
  step = 0;

  /**
   * List of Beat objects
   * @type {Beat[]}
   */
  beatList = [];

  /**
   * Track index is passed when app is initialized
   * @param {number} index 
   */
  constructor(index) {
    const blockCount = 8;
    const beatPerBlockCount = 4;
    const dialog = document.querySelector("#sound-modal");

    const bpmInput = dialog.querySelector("#bpm");
    const bpmText = dialog.querySelector(".bpm-text");

    const volumeInput = dialog.querySelector("#volume");
    const volumeText = dialog.querySelector(".volume-text");

    this.index = index;

    const trackWrapper = document.createElement("div");
    trackWrapper.className = "track-wrapper";

    //Track sound info layout
    const trackSound = document.createElement("div");
    trackSound.className = "track-sound";
    const soundName = document.createElement("h4");
    soundName.id = "soundName";
    soundName.textContent = "Sound name";
    const selectButton = document.createElement("button");
    selectButton.textContent = "Modify";
    selectButton.addEventListener(
      "click",
      function () {
        bpmInput.value = this.bpm;
        bpmText.textContent = this.bpm;

        volumeInput.value = this.volume * 100;
        volumeText.textContent = (this.volume * 100).toFixed(0);

        dialog.dataset.caller = this.index;
        dialog.classList.toggle("show");
        dialog.showModal();
      }.bind(this)
    );

    trackSound.appendChild(soundName);
    trackSound.appendChild(selectButton);

    //Track sequencer layout
    const track = document.createElement("div");
    track.className = "track";
    for (let j = 0; j < blockCount; j++) {
      const block = document.createElement("div");
      block.className = "block";

      for (let k = 0; k < beatPerBlockCount; k++) {
        const beatObject = new Beat(this);

        block.appendChild(beatObject.htmlElement);
        this.beatList.push(beatObject);
      }

      track.appendChild(block);
    }

    //Track settings layout
    const trackSettings = document.createElement("div");
    trackSettings.className = "track-settings";

    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.addEventListener(
      "click",
      function () {
        this.play();
      }.bind(this)
    );
    trackSettings.appendChild(playButton);

    const pauseButton = document.createElement("button");
    pauseButton.textContent = "Pause";
    pauseButton.addEventListener(
      "click",
      function () {
        this.pause();
      }.bind(this)
    );
    trackSettings.appendChild(pauseButton);

    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.addEventListener(
      "click",
      function () {
        this.clear();
      }.bind(this)
    );
    trackSettings.appendChild(clearButton);

    const muteButton = document.createElement("button");
    muteButton.textContent = "Mute";
    muteButton.addEventListener(
      "click",
      function () {
        this.mute();
      }.bind(this)
    );
    trackSettings.appendChild(muteButton);

    const audioEl = document.createElement("audio");
    audioEl.id = `audio-${this.index}`;
    this.audio = audioEl;

    trackWrapper.appendChild(trackSound);
    trackWrapper.appendChild(track);
    trackWrapper.appendChild(trackSettings);
    trackWrapper.appendChild(audioEl);

    this.htmlElement = trackWrapper;
  }

  play() {
    const interval = (60 / this.bpm) * 1000;
    this.audio.volume = this.volume;
    if (this.audio.src && !this.mainLoop) {
      this.mainLoop = setInterval(
        function () {
          this.repeat();
        }.bind(this),
        interval
      );
    }
  }

  pause() {
    clearInterval(this.mainLoop);
    this.mainLoop = undefined;
    const currentBeat = this.beatList[this.step % 32];
    currentBeat.htmlElement.classList.remove("beat-active");
    this.step = 0;
  }

  clear() {
    for (let beat of this.beatList) {
      beat.htmlElement.classList.add("beat-disabled");
      beat.htmlElement.classList.remove("beat-active");
      beat.disabled = true;
    }
  }

  mute() {
    this.audio.volume = this.audio.volume ? 0 : this.volume;
  }

  repeat() {
    const currentBeat = this.beatList[this.step % 32];
    const prevBeat =
      this.beatList[
        this.step % 32 ? (this.step % 32) - 1 : this.beatList.length - 1
      ];
    currentBeat.htmlElement.classList.add("beat-active");
    prevBeat.htmlElement.classList.remove("beat-active");
    console.log(this.step % 32);
    if (!currentBeat.htmlElement.classList.contains("beat-disabled")) {
      this.audio.currentTime = 0;
      this.audio.play();
    }
    this.step++;
  }
}
