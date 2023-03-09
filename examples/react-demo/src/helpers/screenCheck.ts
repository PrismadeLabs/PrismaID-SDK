export function screenHeightIsBigEnough(scaleFactor: number) {
  const screenHeight = window.innerHeight;

  // TODO adjust height if using anything other than standard card size
  // 1098 = height of cardImage
  const minNeededScreenHeight = 1098 * scaleFactor;

  if (screenHeight > minNeededScreenHeight) {
    return true;
  } else {
    return false;
  }
}
