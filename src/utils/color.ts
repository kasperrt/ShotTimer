export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  return `hsl(${hsl[0]}, ${hsl[1]}%,${hsl[2]}%)`;
}

export function hexToRgb(color: string): [number, number, number] {
  const rgb = [];
  for (let i = 0; i < 6; i += 2) {
    rgb.push(Number.parseInt(color.substring(i + 1, i + 3), 16));
  }

  return [rgb[0], rgb[1], rgb[2]];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0;
  let s: number;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  if (l > 0.5) l = 0.4;

  return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}
