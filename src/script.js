"use strict";

const passwordPropsContainer = document.getElementById(
  "passwordPropsContainer"
);
const errorContainer = document.getElementById("errorContainer");
const passwordInput = document.getElementById("passwordInput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

class AbstractInputElement {
  constructor(id, type, label, defaultValue) {
    this.id = id;
    this.type = type;
    this.label = label;
    this.defaultValue = defaultValue;
  }

  create() {
    throw new Error('Method "create" has not been implemented');
  }
}

class SelectElement extends AbstractInputElement {
  constructor({ id, type, label, defaultValue, values }) {
    super(id, type, label, defaultValue);
    this.values = values;
  }

  create() {
    const selectElement = document.createElement("select");
    selectElement.id = this.id;
    selectElement.classList = "select";

    Object.keys(this.values).forEach((rangeName) => {
      const optgroupElement = document.createElement("optgroup");
      optgroupElement.label = rangeName;

      this.values[rangeName].forEach((optionValue) => {
        const optionElement = document.createElement("option");
        if (this.defaultValue === optionValue) optionElement.selected = true;
        optionElement.value = optionValue;
        optionElement.innerHTML = optionValue;
        optgroupElement.append(optionElement);
      });

      selectElement.append(optgroupElement);
    });

    return selectElement;
  }
}

class CheckboxElement extends AbstractInputElement {
  constructor({ id, type, label, defaultValue, charCodes }) {
    super(id, type, label, defaultValue);
    this.charCodes = charCodes;
  }

  create() {
    const checkboxElement = document.createElement("input");
    checkboxElement.id = this.id;
    checkboxElement.classList = "checkbox";
    checkboxElement.type = "checkbox";
    checkboxElement.checked = this.defaultValue;

    this.labelElement.addEventListener("click", (e) => {
      checkboxElement.checked = !checkboxElement.checked;
    });

    return checkboxElement;
  }
}

const PASSWORD_PROPS = [
  new SelectElement({
    id: "passwordLength",
    type: 1,
    label: "Length",
    values: {
      Weak: [...range(6, 15)],
      Strong: [...range(16, 128)],
      Unbelievable: [256, 512, 1024, 2048],
    },
    defaultValue: 16,
  }),
  new CheckboxElement({
    id: "includeSymbols",
    type: 0,
    label: "Symbols",
    charCodes: [...range(33, 47), ...range(58, 64)],
    defaultValue: true,
  }),
  new CheckboxElement({
    id: "includeNumbers",
    type: 0,
    label: "Numbers",
    charCodes: [...range(48, 57)],
    defaultValue: true,
  }),
  new CheckboxElement({
    id: "includeLowercaseCharacters",
    type: 0,
    label: "Lowercase Characters",
    charCodes: [...range(97, 122)],
    defaultValue: true,
  }),
  new CheckboxElement({
    id: "includeUppercaseCharacters",
    type: 0,
    label: "Uppercase Characters",
    charCodes: [...range(65, 90)],
    defaultValue: true,
  }),
  new CheckboxElement({
    id: "includeEmoji",
    type: 0,
    label: "Emoji 😃",
    charCodes: [
      8986,
      8987,
      ...range(9193, 9203),
      9208,
      9209,
      9210,
      9410,
      9748,
      9749,
      9757,
      ...range(9800, 9811),
      9823,
      9855,
      9875,
      9889,
      9898,
      9899,
      9917,
      9918,
      9924,
      9925,
      9934,
      9935,
      9937,
      9939,
      9940,
      9961,
      9962,
      ...range(9968, 9973),
      ...range(9975, 9978),
      9981,
      9986,
      9989,
      ...range(9992, 9997),
      9999,
      10002,
      10004,
      10006,
      10013,
      10017,
      10024,
      10035,
      10036,
      10052,
      10055,
      10060,
      10062,
      ...range(10067, 10069),
      10071,
      10083,
      10084,
      ...range(10133, 10135),
      10145,
      10160,
      10175,
      10548,
      10549,
      ...range(11013, 11015),
      11035,
      11036,
      11088,
      11093,
      12336,
      12349,
      12951,
      12953,
      126980,
      127183,
      127344,
      127345,
      127358,
      127359,
      127374,
      ...range(127377, 127386),
      127489,
      127490,
      127514,
      127535,
      ...range(127538, 127546),
      127568,
      127569,
      ...range(127744, 127777),
      ...range(127780, 127891),
      127894,
      127895,
      ...range(127897, 127899),
      ...range(127902, 127984),
      ...range(127987, 127989),
      ...range(127991, 127994),
      ...range(128000, 128253),
      ...range(128255, 128317),
      ...range(128329, 128334),
      ...range(128336, 128359),
      128367,
      128368,
      ...range(128371, 128378),
      128391,
      ...range(128394, 128397),
      128400,
      128405,
      128406,
      128420,
      128421,
      128424,
      128433,
      128434,
      128444,
      ...range(128450, 128452),
      ...range(128465, 128467),
      ...range(128476, 128478),
      128481,
      128483,
      128488,
      128495,
      128499,
      ...range(128506, 128591),
      ...range(128640, 128709),
      ...range(128715, 128722),
      ...range(128725, 128727),
      ...range(128736, 128741),
      128745,
      128747,
      128748,
      128752,
      ...range(128755, 128764),
      ...range(128992, 129003),
      ...range(129292, 129338),
      ...range(129340, 129349),
      ...range(129351, 129400),
      ...range(129402, 129483),
      ...range(129485, 129510),
    ],
    defaultValue: false,
  }),
];

function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
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

function randomChoice(choices) {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function extractPasswordPropsFromHTML() {
  let passwordLength = 0;
  let charCodes = [];

  PASSWORD_PROPS.forEach((prop) => {
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
    generatedPassword += String.fromCodePoint(selectedCharCode);
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
  PASSWORD_PROPS.forEach((prop) => {
    // create elements
    const propContainer = createPropContainer();
    const labelElement = createPropLabel(prop);
    const createdElement = prop.create();
    // append created elements to HTML
    propContainer.append(labelElement);
    propContainer.append(createdElement);
    passwordPropsContainer.append(propContainer);
  });
}

function prepareUI() {
  addPasswordPropsSelectors();
  addEventListeners();
}

prepareUI();
