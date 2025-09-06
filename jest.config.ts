import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
 preset: 'react-native',
 setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
 transform: {
  '^.+\\.(js|ts|tsx)$': 'babel-jest',
 },
 transformIgnorePatterns: [
  'node_modules/(?!(jest-)?react-native|@react-native|@expo|expo(nent)?|react-navigation|@react-navigation/.*|react-redux|@reduxjs/toolkit)',
 ],
 moduleNameMapper: {
  ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
   prefix: '<rootDir>/',
  }),
  '^react-redux$': '<rootDir>/node_modules/react-redux/dist/cjs/index.js',
  '^@reduxjs/toolkit$':
   '<rootDir>/node_modules/@reduxjs/toolkit/dist/cjs/index.js',
 },
 moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
 collectCoverage: true,
 coverageDirectory: './coverage',
 coverageReporters: ['text', 'lcov', 'html'],
 testEnvironment: 'node',
};
