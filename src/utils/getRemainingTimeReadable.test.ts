import { expect, test } from 'vitest';
import { getRemainingTimeReadable } from './getRemainingTimeReadable';

test('getRemainingTimeReadable: 1 minute', () => {
  expect(getRemainingTimeReadable(60 * 1000)).toEqual({ minutes: '01', seconds: '00', milliseconds: '000' });
});

test('getRemainingTimeReadable: 1 minute, 30 seconds, 11 milliseconds', () => {
  expect(getRemainingTimeReadable(60 * 1000 + 30 * 1000 + 11)).toEqual({
    minutes: '01',
    seconds: '30',
    milliseconds: '011',
  });
});
