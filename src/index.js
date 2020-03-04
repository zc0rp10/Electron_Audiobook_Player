const mm = require("music-metadata");
const { ipcRenderer } = require("electron");
const Store = require("../modules/store.js");
const Library = require("../modules/library.js");

$ = document.getElementById.bind(document);
const libraryView = $("lib-content");

const store = new Store({
  configName: "test-user-library",
  defaults: {
    books: []
  }
});

const library = new Library();
library.render();
