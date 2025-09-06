import { formatTemperature } from '@/app/utils/Tempareture';

describe('formatTemperature', () => {
 it('formats positive temperatures correctly', () => {
  expect(formatTemperature(20)).toBe('20°C');
  expect(formatTemperature(25.7)).toBe('26°C');
  expect(formatTemperature(0)).toBe('0°C');
 });

 it('formats negative temperatures correctly', () => {
  expect(formatTemperature(-5)).toBe('-5°C');
  expect(formatTemperature(-10.3)).toBe('-10°C');
  expect(formatTemperature(-25.8)).toBe('-26°C');
 });

 it('rounds decimal temperatures correctly', () => {
  expect(formatTemperature(20.4)).toBe('20°C');
  expect(formatTemperature(20.5)).toBe('21°C');
  expect(formatTemperature(20.6)).toBe('21°C');
  expect(formatTemperature(-20.4)).toBe('-20°C');
  expect(formatTemperature(-20.5)).toBe('-20°C');
 });

 it('handles edge cases', () => {
  expect(formatTemperature(0)).toBe('0°C');
  expect(formatTemperature(-0)).toBe('0°C');
  expect(formatTemperature(100)).toBe('100°C');
  expect(formatTemperature(-100)).toBe('-100°C');
 });

 it('handles very small decimal values', () => {
  expect(formatTemperature(0.1)).toBe('0°C');
  expect(formatTemperature(0.4)).toBe('0°C');
  expect(formatTemperature(0.5)).toBe('1°C');
  expect(formatTemperature(0.9)).toBe('1°C');
 });

 it('handles very large decimal values', () => {
  expect(formatTemperature(99.1)).toBe('99°C');
  expect(formatTemperature(99.4)).toBe('99°C');
  expect(formatTemperature(99.5)).toBe('100°C');
  expect(formatTemperature(99.9)).toBe('100°C');
 });
});
