// Modules
const fs = require("fs");
const mime = require("mime");
const win = nw.Window.get();

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

// info elements
const example = document.getElementById("example");
const message = document.getElementById("message");

// EVENT LISTENERS
// click on Browse event
browseBtn.addEventListener("click", () => {
  openExplorer();
});

pathText.addEventListener("click", () => {
  openExplorer();
});

// On change event for suffix-input elements
document.querySelectorAll(".suffixInput").forEach((item) => {
  item.addEventListener("change", () => {
    updatePattern();
  });
});

// On input event for prefix element
prefixInput.addEventListener("input", (e) => {
  // replace special characters on input
  let str = e.target.value;
  prefixInput.value = str.replace(/[#%&{}\/\\<>^*?$!'":.,+@|]+$/, "").trim();

  updatePattern();
});

// click on Rename event
renameBtn.addEventListener("click", () => {
  // check inputs
  if (pathText.value === "") {
    message.innerText = "Path cannot be empty.";
    pathText.focus();
    return;
  } else if (typeInput.value === "") {
    message.innerText = "Please select a file type.";
    typeInput.focus();
    return;
  } else if (prefixInput.value === "") {
    message.innerText = "Prefix cannot be empty.";
    prefixInput.focus();
    return;
  } else {
    message.innerText = "";
    example.innerText = "";
  }

  let ext = mime.getExtension(typeInput.value);
  let seq = Number(startAtInput.value);
  let path = pathText.value;
  let numberOfFiles = 0;
  let counter = 0;

  fs.promises
    .readdir(path, { withFileTypes: true })
    .then((dirents) => {
      return dirents.filter(
        (dirent) =>
          dirent.isFile() && mime.getType(dirent.name) === typeInput.value
      );
    })
    .then((dirents) => {
      numberOfFiles = dirents.length;

      dirents.forEach((dirent) => {
        const oldPath = `${path}\\${dirent.name}`;
        const newFilename = `${getNewName(seq.toString())}.${ext}`;
        const newPath = `${path}\\${newFilename}`;

        fs.renameSync(oldPath, newPath);
        seq += 1;
        counter += 1;
      });
    })
    .then(() => {
      alert(
        `Renaming process completed successfully! Total files renamed: ${counter}.`
      );

      // reset inputs
      pathText.value = "";
      typeInput.value = "";
      prefixInput.value = "";
      setDisabled(true);
    })
    .catch((err) => {
      let ts = Date(Date.now()).toLocaleString();
      let message = `${ts}: ${err}\r\n`;

      // log error to file
      logError(message, path);

      // show alert
      let alertMessage = `There has been an error while renaming the files. Go to '${path}\\log\\error-log.txt' for more information.\n\n`;
      alertMessage += `${counter} out of ${numberOfFiles} files have been renamed.`;
      alert(alertMessage);
    });
});

// click on Cancel event
cancelBtn.addEventListener("click", () => {
  win.close(true);
});

// toggle disable property on inputs/selects
pathText.addEventListener("change", (e) => {
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

// open folder explorer
const openExplorer = () => {
  pathInput.addEventListener("change", (e) => {
    let path = e.target.value;

    if (path === "") {
      pathText.value = "";
    } else {
      pathText.value = path;
      setDisabled(false);

      // get files in current dir
      getFiles(path).then((files) => {
        const types = Object.keys(getFileTypes(files));

        if (types.length === 0) {
          message.innerText =
            "There are no files in selected folder. Please check.";
          return;
        } else {
          message.innerText = "";
        }

        // remove all previous options (if any)
        let options = Array.from(typeInput.children);
        options.forEach((option) => option.remove());

        // add file types to dropdown
        types.map((type) => {
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
  const filenamePattern = getNewName(startAtInput.value);

  // show example name pattern in view
  example.innerText = "E.g. " + filenamePattern;
};

// get new name
const getNewName = (sequenceNumber) => {
  return (
    prefixInput.value +
    joinInput.value +
    sequenceNumber.padStart(parseInt(paddingInput.value), "0")
  );
};

// log error to file
const logError = (message, folderPath) => {
  const filename = "error-log.txt";
  const filePath = `${folderPath}\\log\\${filename}`;

  if (fs.existsSync(filePath)) {
    // append new line to file
    fs.appendFile(filePath, message, (err) => {
      if (err) throw err;
    });
  } else {
    // create folder
    fs.mkdir(folderPath + "\\log", { recursive: true }, (err) => {
      if (err) throw err;
    });

    // create file and append line
    fs.writeFile(filePath, message, (err) => {
      if (err) throw err;
    });
  }
};
