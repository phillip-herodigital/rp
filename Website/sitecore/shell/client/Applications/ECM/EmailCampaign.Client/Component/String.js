String.prototype.replaceAll = function (find, replace) {
  var value = this;
  while (value.indexOf(find) > -1) {
    value = value.replace(find, replace);
  }
  return value;
};