module.exports = {
  replace: function (string, search, replace) {
    return string.split(search).join(replace);
  },
  cleanID: function (string) {
    return string.replace(/[^a-zA-Z0-9]/g, "");
  },
};
