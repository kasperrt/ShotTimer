import { expect, test } from 'vitest';
import { hexToRgb, rgbToHsl } from './color';

test('hexToRgb', () => {
  expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
  expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
  expect(hexToRgb('#a2d9f')).toEqual([162, 217, 15]);
});

test('rgbToHsl', () => {
  expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
  expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 40]);
  expect(rgbToHsl(162, 217, 15)).toEqual([0, 87, 45]);
});
