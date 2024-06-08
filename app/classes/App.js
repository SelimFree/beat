import Track from "./Track.js";
import { validateHtmlElementId } from "../utils.js";
import { soundsCollection } from "../../data.js";

export default class App {
  /**
   * @type {HTMLElement|undefined}
   */
  app;

  /**
   * @type {string|undefined}
   */
  htmlAppTemplateString;

  /**
   * @type {string|undefined}
   */
  htmlModalTemplateString;

  /**
   * @type {string|undefined}
   */
  htmlSaveModalTemplateString;

  /**
   * @type {string|undefined}
   */
  htmlLoadModalTemplateString;

  /**
   * List of Track objecs
   * @type {Track[]}
   */
  trackList = [];

  constructor(options = {}) {
    let startValidate = Date.now();
    this.validateAsync(options).then(
      function () {
        const validateTime = Date.now() - startValidate;
        console.log(`Time to validate: ${validateTime}ms`);

        let startInit = Date.now();
        this.init();
        const initTime = Date.now() - startInit;
        console.log(`Time to init: ${initTime}ms`);

        let startRun = Date.now();
        this.run();
        const runTime = Date.now() - startRun;
        console.log(`Time to run: ${runTime}ms`);
      }.bind(this)
    );
  }

  async validateAsync(options) {
    this.app = validateHtmlElementId(options.app);
    if (this.app === null)
      throw new Error("Parameter 'app' must be a valid ID");

    if (options.htmlAppTemplate) {
      const response = await fetch(options.htmlAppTemplate);

      if (response.status !== 200) {
        throw new Error("Could not load HTML template");
      }

      const data = await response.text();
      this.htmlAppTemplateString = data;
    }

    if (options.htmlModalTemplate) {
      const response = await fetch(options.htmlModalTemplate);

      if (response.status !== 200) {
        throw new Error("Could not load HTML template");
      }

      const data = await response.text();
      this.htmlModalTemplateString = data;
    }

    if (options.htmlSaveModalTemplate) {
      const response = await fetch(options.htmlSaveModalTemplate);

      if (response.status !== 200) {
        throw new Error("Could not load HTML template");
      }

      const data = await response.text();
      this.htmlSaveModalTemplateString = data;
    }

    if (options.htmlLoadModalTemplate) {
      const response = await fetch(options.htmlLoadModalTemplate);

      if (response.status !== 200) {
        throw new Error("Could not load HTML template");
      }

      const data = await response.text();
      this.htmlLoadModalTemplateString = data;
    }
  }

  init() {
    console.log("Initializing application");

    //App main layout parsing
    if (this.htmlAppTemplateString) {
      const domParser = new DOMParser();
      const parsedDoc = domParser.parseFromString(
        this.htmlAppTemplateString,
        "text/html"
      );
      for (let child of parsedDoc.body.children) {
        document.adoptNode(child);
        this.app.appendChild(child);
      }
    }

    //App sound modal layout parsing
    if (this.htmlModalTemplateString) {
      const domParser = new DOMParser();
      const parsedDoc = domParser.parseFromString(
        this.htmlModalTemplateString,
        "text/html"
      );
      for (let child of parsedDoc.body.children) {
        document.adoptNode(child);
        this.app.appendChild(child);
      }
    }

    //App save modal layout parsing
    if (this.htmlSaveModalTemplateString) {
      const domParser = new DOMParser();
      const parsedDoc = domParser.parseFromString(
        this.htmlSaveModalTemplateString,
        "text/html"
      );
      for (let child of parsedDoc.body.children) {
        document.adoptNode(child);
        this.app.appendChild(child);
      }
    }

    //App load modal layout parsing
    if (this.htmlLoadModalTemplateString) {
      const domParser = new DOMParser();
      const parsedDoc = domParser.parseFromString(
        this.htmlLoadModalTemplateString,
        "text/html"
      );
      for (let child of parsedDoc.body.children) {
        document.adoptNode(child);
        this.app.appendChild(child);
      }
    }

    //Modals layout and listeners
    const dialog = document.querySelector("#sound-modal");
    const saveDialog = document.querySelector("#save-modal");
    const loadDialog = document.querySelector("#load-modal");
    const soundList = dialog.querySelector(".sounds");

    const closeBtn = document.querySelector("#closeModal");
    closeBtn.addEventListener(
      "click",
      function () {
        this.pause();
        dialog.dataset.caller = undefined;
        dialog.classList.toggle("show");
        dialog.close();
      }.bind(this)
    );

    const bpmInput = dialog.querySelector("#bpm");
    const bpmText = dialog.querySelector(".bpm-text");

    bpmInput.addEventListener(
      "input",
      function (e) {
        const currentTrack = this.trackList[parseInt(dialog.dataset.caller)];
        currentTrack.bpm = e.target.value;
        bpmText.textContent = e.target.value;
      }.bind(this)
    );

    const volumeInput = dialog.querySelector("#volume");
    const volumeText = dialog.querySelector(".volume-text");

    volumeInput.addEventListener(
      "input",
      function (e) {
        const currentTrack = this.trackList[parseInt(dialog.dataset.caller)];
        currentTrack.volume = e.target.value / 100;
        volumeText.textContent = e.target.value;
      }.bind(this)
    );

    const saveBeatmapBtn = document.querySelector("#saveBeatmap");
    saveBeatmapBtn.addEventListener(
      "click",
      function () {
        this.pause();
        this.save();
        saveDialog.classList.toggle("show");
        saveDialog.close();
      }.bind(this)
    );

    const closeSaveBtn = document.querySelector("#closeSaveModal");
    closeSaveBtn.addEventListener(
      "click",
      function () {
        saveDialog.classList.toggle("show");
        saveDialog.close();
      }.bind(this)
    );

    const closeLoadBtn = document.querySelector("#closeLoadModal");
    closeLoadBtn.addEventListener(
      "click",
      function () {
        loadDialog.classList.toggle("show");
        loadDialog.close();
      }.bind(this)
    );

    //Filling modal with sounds
    for (let category of Object.keys(soundsCollection)) {
      const categoryEl = document.createElement("div");
      categoryEl.className = "sound-category";

      const categoryName = document.createElement("h3");
      categoryName.textContent = soundsCollection[category].name;
      categoryEl.appendChild(categoryName);

      const soundsWrapper = document.createElement("div");
      soundsWrapper.className = "sound-list";
      categoryEl.appendChild(soundsWrapper);

      for (let sound of soundsCollection[category].children) {
        const soundEl = document.createElement("div");
        soundEl.className = "sound";
        soundEl.textContent = sound.name;

        soundEl.addEventListener(
          "click",
          function () {
            const currentTrack =
              this.trackList[parseInt(dialog.dataset.caller)];
            currentTrack.audio.src = sound.path;
            currentTrack.audioName = sound.name;
            currentTrack.htmlElement.querySelector("#soundName").textContent =
              sound.name;
            currentTrack.audio.play();
          }.bind(this)
        );

        soundsWrapper.appendChild(soundEl);
      }
      soundList.appendChild(categoryEl);
    }

    //App action button layout
    const appActions = document.querySelector(".actions");

    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.addEventListener(
      "click",
      function () {
        this.play();
      }.bind(this)
    );
    appActions.appendChild(playButton);

    const pauseButton = document.createElement("button");
    pauseButton.textContent = "Pause";
    pauseButton.addEventListener(
      "click",
      function () {
        this.pause();
      }.bind(this)
    );
    appActions.appendChild(pauseButton);

    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.addEventListener(
      "click",
      function () {
        this.clear();
      }.bind(this)
    );
    appActions.appendChild(clearButton);

    const muteButton = document.createElement("button");
    muteButton.textContent = "Mute";
    muteButton.addEventListener(
      "click",
      function () {
        this.mute();
      }.bind(this)
    );
    appActions.appendChild(muteButton);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener(
      "click",
      function () {
        saveDialog.classList.toggle("show");
        saveDialog.showModal();
      }.bind(this)
    );
    appActions.appendChild(saveBtn);

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.addEventListener(
      "click",
      function () {
        this.loadAll();
        loadDialog.classList.toggle("show");
        loadDialog.showModal();
      }.bind(this)
    );
    appActions.appendChild(loadBtn);

    //Creating tracks
    const sequencerWrapper = document.querySelector(".sequencer-wrapper");
    const trackCount = 8;
    for (let i = 0; i < trackCount; i++) {
      const track = new Track(i);
      this.trackList.push(track);
      sequencerWrapper.appendChild(track.htmlElement);
    }
  }

  /**
   * Runs the application
   */
  run() {
    console.log("Running the application");
    console.log(this);
  }

  play() {
    for (let track of this.trackList) {
      track.play();
    }
  }

  pause() {
    for (let track of this.trackList) {
      track.pause();
    }
  }

  clear() {
    for (let track of this.trackList) {
      track.clear();
    }
  }

  mute() {
    for (let track of this.trackList) {
      track.mute();
    }
  }

  save() {
    console.log(this.trackList);
    const beatMapName = document.querySelector("#beatMapName");

    if (!beatMapName.value.trim()) {
      return;
    }

    const beatMap = {
      name: `${beatMapName.value}-#(${Date.now()})`,
      tracks: [],
    };
    for (let track of this.trackList) {
      const trackData = {
        index: track.index,
        audio: track.audio.src,
        audioName: track.audioName,
        bpm: track.bpm,
        volume: track.volume,
        beats: [],
      };

      for (let beat of track.beatList) {
        const beatData = {
          disabled: beat.disabled,
        };
        trackData.beats.push(beatData);
      }
      beatMap.tracks.push(trackData);
    }

    const oldBeatmaps = JSON.parse(localStorage.getItem("beatmaps")) || [];

    localStorage.setItem("beatmaps", JSON.stringify([...oldBeatmaps, beatMap]));
    beatMapName.value = "";
  }

  loadAll() {
    const loadDialog = document.querySelector("#load-modal");
    const oldBeatmaps = JSON.parse(localStorage.getItem("beatmaps")) || [];
    const beatmaps = document.querySelector("#beatmaps");

    //Clearing old elements
    while (beatmaps.lastChild) {
      beatmaps.lastChild.remove();
    }

    for (let beatmap of oldBeatmaps) {
      const beatmapEl = document.createElement("div");
      beatmapEl.className = "beatmap";

      const beatmapName = document.createElement("h4");
      beatmapName.textContent = beatmap.name;
      beatmapEl.appendChild(beatmapName);

      const actionBtns = document.createElement("div");
      actionBtns.className = "beatmap-actions";

      const loadBtn = document.createElement("button");
      loadBtn.textContent = "Load";
      loadBtn.addEventListener(
        "click",
        function () {
          this.pause();
          this.load(beatmap);

          loadDialog.classList.toggle("show");
          loadDialog.close();
        }.bind(this)
      );
      actionBtns.appendChild(loadBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener(
        "click",
        function () {
          this.pause();
          this.delete(beatmap);

          loadDialog.classList.toggle("show");
          loadDialog.close();
        }.bind(this)
      );
      actionBtns.appendChild(deleteBtn);

      beatmapEl.appendChild(actionBtns);

      beatmaps.appendChild(beatmapEl);
    }
  }

  load(beatmap) {
    this.clear();
    for (let i = 0; i < this.trackList.length; i++) {
      this.trackList[i].audio.src = beatmap.tracks[i].audio;

      this.trackList[i].audioName = beatmap.tracks[i].audioName;
      this.trackList[i].htmlElement.querySelector("#soundName").textContent =
        beatmap.tracks[i].audioName || "Sound name";
      this.trackList[i].bpm = beatmap.tracks[i].bpm;
      this.trackList[i].volume = beatmap.tracks[i].volume;
      for (let j = 0; j < this.trackList[0].beatList.length; j++) {
        const isDisabled = beatmap.tracks[i].beats[j].disabled;
        this.trackList[i].beatList[j].disabled = isDisabled;
        if (!isDisabled) {
          this.trackList[i].beatList[j].htmlElement.classList.remove(
            "beat-disabled"
          );
        }
      }
    }
  }

  delete(beatmap) {
    const oldBeatmaps = JSON.parse(localStorage.getItem("beatmaps")) || [];
    localStorage.setItem(
      "beatmaps",
      JSON.stringify(oldBeatmaps.filter((el) => el.name !== beatmap.name))
    );
  }
}
