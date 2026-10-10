export interface SpineTreatment {
  background: string;
  color: string;
  width: number;
  height: number;
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

export function getSpineTreatment(title: string, id: number): SpineTreatment {
  const hash = [...title].reduce((total, character, index) => {
    return total + character.charCodeAt(0) * (index + 1) + id * 17;
  }, 0);

  const palette = SPINE_PALETTES[Math.abs(hash) % SPINE_PALETTES.length];
  const width = 28 + (Math.abs(hash) % 18);
  const height = 156 + (Math.abs(hash * 7) % 35);

  return {
    ...palette,
    width,
    height,
  };
}
