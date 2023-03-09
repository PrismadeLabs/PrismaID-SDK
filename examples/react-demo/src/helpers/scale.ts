export function getScaleFactor(ppi: number, dpr: number) {
  // scaleFactor = DEVICE_DPI / DEVICE_DPR / (326 / 2)
  // divide by 2, because @2 images are used
  var scaleFactor = ppi / dpr / (326 / 2) / 2;
  return scaleFactor;
}
