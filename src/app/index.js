// Get current window
var win = nw.Window.get();

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

// variables
// let exampleName = "";
// let examplePadding = "1";

// EVENT LISTENERS
// click on Browse event
browseBtn.addEventListener("click", () => {
  pathInput.addEventListener("change", (e) => {
    let value = e.target.value;

    if (value === "") {
      pathText.value = "";
    } else {
      pathText.value = value;
      setDisabled(false);
    }
  });

  pathInput.click();
});

// click on Rename event

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

startAtInput.addEventListener("change", (e) => {
  let value = e.target.value;

  paddingInput.value = value.length;
  paddingInput.min = value.length;
  //   examplePadding = value.padStart(parseInt(paddingInput.value), "0");
  //   console.log(examplePadding);
});

paddingInput.addEventListener("change", (e) => {
  let value = e.target.value;
  //   examplePadding = startAtInput.value.padStart(parseInt(value), "0");
  //   console.log(examplePadding);
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
