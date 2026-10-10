export interface SpineTreatment {
  background: string;
  color: string;
  width: number;
  height: number;
  orientation: "upright" | "horizontal";
  tilt: string;
}

export interface SpineColors {
  background: string;
  color: string;
}

const SPINE_PALETTES: Array<Pick<SpineTreatment, "background" | "color">> = [
  { background: "#19332d", color: "#f2f1eb" },
  { background: "#2f4a43", color: "#f2f1eb" },
  { background: "#50635c", color: "#f2f1eb" },
  { background: "#d85e43", color: "#f2f1eb" },
  { background: "#c7d36b", color: "#19332d" },
  { background: "#e7e7dc", color: "#19332d" },
  { background: "#3d2a26", color: "#f2f1eb" },
  { background: "#788078", color: "#f2f1eb" },
];

export function getSpineTreatment(
  title: string,
  id: number,
  orientationOverride?: SpineTreatment["orientation"],
): SpineTreatment {
  const hash = [...title].reduce((total, character, index) => {
    return total + character.charCodeAt(0) * (index + 1) + id * 17;
  }, 0);

  const palette = SPINE_PALETTES[Math.abs(hash) % SPINE_PALETTES.length];
  const horizontal = orientationOverride
    ? orientationOverride === "horizontal"
    : Math.abs(hash * 13) % 7 === 0;
  const tiltMagnitude = 0.5 + (Math.abs(hash * 11) % 18) / 10;
  const tilt = Math.abs(hash * 5) % 2 === 0 ? tiltMagnitude : -tiltMagnitude;

  return {
    ...palette,
    width: horizontal ? 96 + (Math.abs(hash * 3) % 43) : 28 + (Math.abs(hash) % 18),
    height: horizontal ? 26 + (Math.abs(hash * 7) % 9) : 156 + (Math.abs(hash * 7) % 35),
    orientation: horizontal ? "horizontal" : "upright",
    tilt: `${tilt}deg`,
  };
}

export function getSpineColorsFromCover(image: HTMLImageElement): SpineColors | null {
  if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) return null;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;

    context.drawImage(image, 0, 0, 1, 1);
    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
    if (alpha < 16) return null;

    const toLinear = (value: number) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    };
    const luminance = 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);

    return {
      background: `rgb(${red} ${green} ${blue})`,
      color: luminance > 0.179 ? "#19332d" : "#f2f1eb",
    };
  } catch {
    // A remote image without canvas access keeps its deterministic palette color.
    return null;
  }
}
