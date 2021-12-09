module.exports = {
  replace: function (string, search, replace) {
    return string.split(search).join(replace);
  },
  cleanID: function (string) {
    return string.replace(/[^a-zA-Z0-9]/g, "");
  },
  trimString: function (passedString, startstring, endstring) {
    var theString = passedString.substring(startstring, endstring);
    return theString;
  },
  isGEZero: function (passedString) {
    return parseInt(passedString) >= 0;
  },
};
