module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^lucide-react$': require.resolve('lucide-react'),
    '^(\\..*)\\.jsx?$': '$1',
    '^(\\..*)\\.tsx?$': '$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        module: 'commonjs',
        esModuleInterop: true,
        types: ['jest', '@testing-library/jest-dom']
      }
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react)/)'
  ]
};
