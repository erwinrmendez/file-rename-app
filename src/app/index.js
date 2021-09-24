// Modules and variables
const win = nw.Window.get();
const fs = require("fs");
const mime = require("mime");
let types = {};
let filenamePattern = "";

// Devtools
// win.showDevTools();

// DOM ELEMENTS
// buttons
const browseBtn = document.getElementById("browse-btn");
const renameBtn = document.getElementById("rename-btn");
const cancelBtn = document.getElementById("cancel-btn");

// inputs
const pathInput = document.getElementById("pathInput");
const pathText = document.getElementById("pathText");
const typeInput = document.getElementById("type");
const prefixInput = document.getElementById("prefix");
const joinInput = document.getElementById("join");
const startAtInput = document.getElementById("startAt");
const paddingInput = document.getElementById("padding");
const example = document.getElementById("example");

// EVENT LISTENERS
// click on Browse event
browseBtn.addEventListener("click", () => {
  pathInput.addEventListener("change", (e) => {
    let path = e.target.value;

    if (path === "") {
      pathText.value = "";
    } else {
      pathText.value = path;
      setDisabled(false);

      // get files in current dir
      getFiles(path).then((files) => {
        // add file types to dropdown
        types = getFileTypes(files);

        Object.keys(types).map((type) => {
          const element = document.createElement("option");
          element.value = type;
          element.innerText = type;

          // add element to DOM
          typeInput.appendChild(element);
        });
      });
    }
  });

  pathInput.click();
});

// On change event for input elements
document.querySelectorAll(".patternInput").forEach((item) => {
  item.addEventListener("change", (e) => {
    updatePattern();

    // show example name pattern
    example.innerText = "E.g. " + filenamePattern;
  });
});

// click on Rename event
renameBtn.addEventListener("click", () => {});

// click on Cancel event
cancelBtn.addEventListener("click", () => {
  win.close(true);
});

// toggle disable property on inputs/selects
pathText.addEventListener("input", (e) => {
  let value = e.target.value;

  if (value === "") {
    setDisabled(true);
  } else {
    setDisabled(false);
  }
});

// FUNCTIONS
// disable/enable inputs
const setDisabled = (bool) => {
  typeInput.disabled = bool;
  prefixInput.disabled = bool;
  joinInput.disabled = bool;
  startAtInput.disabled = bool;
  paddingInput.disabled = bool;
};

// get files from path
const getFiles = (directoryPath) => {
  return fs.promises
    .readdir(directoryPath, { withFileTypes: true })
    .then((dirents) => {
      let files = [];

      // Exclude subdirectories
      dirents
        .filter((dirent) => dirent.isFile())
        .map((dirent) => {
          files.push({ name: dirent.name, type: mime.getType(dirent.name) });
        });

      return files;
    })
    .catch((err) => {
      alert("Unable to read files from directory: " + err);
    });
};

// get file types and occurrences
const getFileTypes = (files) => {
  const types = files.map((file) => file.type);

  return types.reduce(
    (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
    {}
  );
};

// update example pattern
const updatePattern = () => {
  pad = startAtInput.value.padStart(parseInt(paddingInput.value), "0");
  filenamePattern = prefixInput.value + joinInput.value + pad;
};
