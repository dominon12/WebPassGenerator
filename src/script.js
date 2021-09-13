"use strict";

const passwordPropsContainer = document.getElementById(
  "passwordPropsContainer"
);
const errorContainer = document.getElementById("errorContainer");
const passwordInput = document.getElementById("passwordInput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

function checkboxCreator(props) {
  const checkboxElement = document.createElement("input");
  checkboxElement.id = props.id;
  checkboxElement.classList = "checkbox";
  checkboxElement.type = "checkbox";
  checkboxElement.checked = props.default;

  props.labelElement.addEventListener("click", (e) => {
    checkboxElement.checked = !checkboxElement.checked;
  });

  return checkboxElement;
}

function selectCreator(props) {
  const selectElement = document.createElement("select");
  selectElement.id = props.id;
  selectElement.classList = "select";

  Object.keys(props.values).map((rangeName) => {
    const optgroupElement = document.createElement("optgroup");
    optgroupElement.label = rangeName;

    props.values[rangeName].map((optionValue) => {
      const optionElement = document.createElement("option");
      if (props.default === optionValue) optionElement.selected = true;
      optionElement.value = optionValue;
      optionElement.innerHTML = optionValue;
      optgroupElement.appendChild(optionElement);
    });

    selectElement.appendChild(optgroupElement);
  });

  return selectElement;
}

function createPropContainer() {
  const propContainer = document.createElement("span");
  propContainer.classList = "password-prop";
  return propContainer;
}

function createPropLabel(prop) {
  const labelElement = document.createElement("p");
  labelElement.classList = "password-prop__label";
  labelElement.innerHTML = prop.label;
  prop.labelElement = labelElement;
  return labelElement;
}

function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function randomChoice(choices) {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

const PASSWORD_PROPS = [
  {
    id: "passwordLength",
    type: 1,
    label: "Length",
    values: {
      Weak: [...range(6, 15)],
      Strong: [...range(16, 128)],
      Unbelievable: [256, 512, 1024, 2048],
    },
    default: 16,
    create: selectCreator,
  },
  {
    id: "includeSymbols",
    type: 0,
    label: "Symbols",
    charCodes: [...range(33, 47), ...range(58, 64)],
    default: true,
    create: checkboxCreator,
  },
  {
    id: "includeNumbers",
    type: 0,
    label: "Numbers",
    charCodes: [...range(48, 57)],
    default: true,
    create: checkboxCreator,
  },
  {
    id: "includeLowercaseCharacters",
    type: 0,
    label: "Lowercase Characters",
    charCodes: [...range(97, 122)],
    default: true,
    create: checkboxCreator,
  },
  {
    id: "includeUppercaseCharacters",
    type: 0,
    label: "Uppercase Characters",
    charCodes: [...range(65, 90)],
    default: true,
    create: checkboxCreator,
  },
];

function extractPasswordPropsFromHTML() {
  let passwordLength = 0;
  let charCodes = [];

  PASSWORD_PROPS.map((prop) => {
    const elementFromHtml = document.getElementById(prop.id);

    switch (prop.type) {
      case 0: // checkbox
        if (elementFromHtml.checked) {
          charCodes = [...charCodes, ...prop.charCodes];
        }
        break;
      case 1: // select
        passwordLength = elementFromHtml.value;
        break;
    }
  });

  return {
    passwordLength,
    charCodes,
  };
}

function generatePassword() {
  errorContainer.innerHTML = "";

  const { passwordLength, charCodes } = extractPasswordPropsFromHTML();

  if (charCodes.length == 0 || !passwordLength) {
    errorContainer.innerHTML = "Please select at least 1 option.";
    return;
  }

  let generatedPassword = "";
  for (let i = 0; i < passwordLength; i++) {
    const selectedCharCode = randomChoice(charCodes);
    generatedPassword += String.fromCharCode(selectedCharCode);
  }

  return generatedPassword;
}

function copyPasswordToClipboard() {
  passwordInput.select();
  passwordInput.focus();
  document.execCommand("copy");
}

function handleGeneratePassword() {
  const generatedPassword = generatePassword();
  if (generatedPassword) passwordInput.value = generatedPassword;
}

function addEventListeners() {
  generateBtn.addEventListener("click", handleGeneratePassword);
  copyBtn.addEventListener("click", copyPasswordToClipboard);
}

function addPasswordPropsSelectors() {
  PASSWORD_PROPS.map((prop) => {
    // create elements
    const propContainer = createPropContainer();
    const labelElement = createPropLabel(prop);
    const createdElement = prop.create(prop);
    // append created elements to HTML
    propContainer.appendChild(createdElement);
    propContainer.appendChild(labelElement);
    passwordPropsContainer.appendChild(propContainer);
  });
}

function prepareUI() {
  addPasswordPropsSelectors();
  addEventListeners();
}

prepareUI();
