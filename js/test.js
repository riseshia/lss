window.test = function () {
  if (!FilterUtil.is_valid([1])) {
    alert("is_valid should be true,[1]");
  }

  if (!FilterUtil.is_valid([2, 2])) {
    alert("is_valid should be true, [2,2]");
  }

  if (FilterUtil.is_valid([1, 3])) {
    alert("is_valid should be false [1,3]");
  }

  if (FilterUtil.is_valid([1, "3", 1])) {
    alert("is_valid should be false [1,'3',1]");
  }

  return true;
};
