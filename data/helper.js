let { ObjectId } = require("mongodb");

function checkAndGetID(string, parameter = "ID") {
  checkProperString(string, parameter);
  try {
    const id = ObjectId(string);
    return id;
  } catch (e) {
    throw "Error: Not a valid ObjectId";
  }
}
const checkProperString = (string, parameter) => {
  if (string == null || typeof string == undefined)
    throw `Error: Please pass a ${parameter}`;
  if (typeof string != "string") {
    throw `Error: ${parameter} Not a string`;
  }
  string = string.trim();
  if (string.length == 0) {
    throw `Error: ${parameter} Empty string`;
  }
};

const isValidURL = string => {
  if (string.startsWith("http://www.") || string.startsWith("https://www.")) {
    if (/.([./])com$/.test(string)) {
      if (string.length < 20)
        throw "Error:  At least 5 characters in-between the http://www. and .com required ";
    }
  } else {
    throw "Error: Not valid Website";
  }
};

const checkProperArray = (array, parameter) => {
  if (!array) throw `Error: List of ${parameter} not supplied`;
  if (!Array.isArray(array))
    throw `Error: ${parameter} is not an array.It is "${typeof array}". Please pass an array instead`;
  if (array.length == 0) throw `${parameter} cant be empty List`;
};

const checkProperArrayAllowEmpty = (array, parameter) => {
  if (!array) throw `Error: List of ${parameter} not supplied`;
  if (!Array.isArray(array))
    throw `Error: ${parameter} is not an array.It is "${typeof array}". Please pass an array instead`;
};

const checkProperObject = (object, checklength) => {
  if (!object) throw "Error: Please pass the object";
  if (!(object.constructor === Object)) {
    throw "Error: Parameter passed should be an object";
  }
  if (checklength && Object.keys(object).length === 0)
    throw "Error: Pass atleast 1 value in the object";
};

const checkProperNumber = (num, parameter) => {
  if (num == null || typeof num == undefined)
    throw `Error: No ${parameter} Passed. Please pass a number`;
  if (typeof num !== "number")
    throw `Error: Please pass a number for ${parameter}`;
  if (isNaN(num)) throw `Error: ${parameter} is not a number`;
};

const checkProperDate = dor => {
  let checkdate = new Date(dor);
  let dorArray = dor.split("/");
  let month = parseInt(dorArray[0], 10);
  let date = parseInt(dorArray[1], 10);
  let year = checkdate.getFullYear();
  if (month <= 0) throw "Error: Month cant be negetive";
  if (month > 12) throw "Error: Month > 12";

  if (!/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dor)) {
    throw "Error: Date of Review should be in this format: MM/DD/YYYY";
  }
  if (year < 1000 || year > 3000) {
    throw "Error: Enter Valid year in Date of Review ";
  }
  var monthDaysArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    monthDaysArray[1] = 29;
  }
  if (date < 0 || date > monthDaysArray[month - 1]) {
    throw "Date of Review should be in this format: MM/DD/YYYY";
  }
};

module.exports = {
  checkAndGetID,
  checkProperString,
  isValidURL,
  checkProperArray,
  checkProperArrayAllowEmpty,
  checkProperObject,
  checkProperNumber,
  checkProperDate,
};
