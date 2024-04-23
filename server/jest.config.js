/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@/(.*$)': '<rootDir>/src/$1',
    '@configs/(.*$)': '<rootDir>/src/configs/$1',
    '@controllers/(.*$)': '<rootDir>/src/controllers/$1',
    '@helpers/(.*$)': '<rootDir>/src/helpers/$1',
    '@interfaces/(.*$)': '<rootDir>/src/interfaces/$1',
    '@libs/(.*$)': '<rootDir>/src/libs/$1',
    '@middlewares/(.*$)': '<rootDir>/src/middlewares/$1',
    '@validators/(.*$)': '<rootDir>/src/validators/$1',
    '@models/(.*$)': '<rootDir>/src/models/$1',
    '@routes/(.*$)': '<rootDir>/src/routes/$1',
    '@services/(.*$)': '<rootDir>/src/services/$1',
  },
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
};
