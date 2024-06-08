document.addEventListener("DOMContentLoaded", function () {
  const modulePath = `./app/classes/App.js`;
  import(modulePath).then(function (module) {
    app = new module.default({
      app: "wrapper",
      htmlAppTemplate: `./app/components/App.html`,
      htmlModalTemplate: `./app/components/SoundModal.html`,
      htmlSaveModalTemplate: `./app/components/SaveModal.html`,
      htmlLoadModalTemplate: `./app/components/LoadModal.html`,
    });
  });
});
