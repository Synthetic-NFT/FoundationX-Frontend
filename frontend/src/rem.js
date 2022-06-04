function setRem () {
  let fontSize = 16;
  if (document.documentElement.clientWidth >= 1920) {
    fontSize = 24;
  } else if (document.documentElement.clientWidth > 1420) {
    fontSize = 16;
  } else if (document.documentElement.clientWidth > 1080) {
    fontSize = 16;
  } else {
    fontSize = 16;
  }
  document.documentElement.style.fontSize = `${fontSize}px`;
}
setRem()
window.onresize = function () {
  setRem()
}