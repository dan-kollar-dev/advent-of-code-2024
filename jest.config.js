// jest.config.js
module.exports = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Set the test environment to Node.js
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore these paths
  moduleFileExtensions: ["ts", "js", "json", "node"], // File extensions to be considered
  transform: {
    "^.+\\.ts$": "ts-jest", // Transform TypeScript files using ts-jest
  },
};
