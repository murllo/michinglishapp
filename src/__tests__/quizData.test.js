const fs = require('fs');
const path = require('path');

// Function to validate the structure of the JSON
function validateJsonStructure(jsonData) {
  expect(jsonData).toHaveProperty('user');
  expect(jsonData.user).toHaveProperty('username');
  expect(jsonData.user).toHaveProperty('profileImage');
  expect(jsonData.user).toHaveProperty('socialLink');

  expect(jsonData).toHaveProperty('topics');
  expect(Array.isArray(jsonData.topics)).toBe(true);

  jsonData.topics.forEach(topic => {
    expect(topic).toHaveProperty('topic');
    expect(topic).toHaveProperty('questions');
    expect(Array.isArray(topic.questions)).toBe(true);

    topic.questions.forEach(question => {
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(Array.isArray(question.options)).toBe(true);
      expect(question).toHaveProperty('answer');
    });
  });
}

// Path to the 'data' folder where the JSON files are located
const dataDirectory = path.resolve(__dirname, '..', '..', 'public', 'data');

// Function to validate that the folder names follow the pattern
// The pattern is: 7 digits, a hyphen, and 4 digits (e.g., 1234567-1234)
function validateFolderNamePattern(folderName) {
  const regexPattern = /^\d{7}-\d{4}$/;  // Regular expression to match the required folder pattern
  return regexPattern.test(folderName);  // Returns true if the folder name matches the pattern
}

// Read the `index.json` file
const indexFilePath = path.join(dataDirectory, 'index.json');
const indexFileContent = fs.readFileSync(indexFilePath);
const indexJson = JSON.parse(indexFileContent);

// Unit tests using Jest
describe('Folder and JSON structure validation', () => {
  
  // Get all subfolders inside the 'data' folder
  const subfolders = fs.readdirSync(dataDirectory).filter(folder => {
    return fs.lstatSync(path.join(dataDirectory, folder)).isDirectory();
  });

  // 1. Ensure all folders listed in `index.json` exist in the file system
  test('All folders listed in index.json should exist in the filesystem', () => {
    indexJson.folders.forEach(folder => {
      const folderPath = path.join(dataDirectory, folder);
      expect(fs.existsSync(folderPath)).toBe(true);
    });
  });

  // 2. Ensure all folders in the filesystem are listed in `index.json`
  test('All folders in the filesystem should be listed in index.json', () => {
    subfolders.forEach(folder => {
      expect(indexJson.folders).toContain(folder);
    });
  });

  // 3. Validate that each folder contains a valid `info.json` file and that it follows the correct structure
  subfolders.forEach(subfolder => {
    const jsonFilePath = path.join(dataDirectory, subfolder, 'info.json');

    test(`should find a valid info.json in subfolder ${subfolder}`, () => {
      expect(fs.existsSync(jsonFilePath)).toBe(true);
    });

    test(`should validate JSON structure in subfolder ${subfolder}`, () => {
      const rawData = fs.readFileSync(jsonFilePath);
      const jsonData = JSON.parse(rawData);
      validateJsonStructure(jsonData);  // Validate the structure of the JSON
    });
  });

  // 4. Validate that folder names follow the pattern `#######-####` (7 digits, hyphen, 4 digits)
  test('All folder names should follow the pattern #######-####', () => {
    subfolders.forEach(folder => {
      const isValid = validateFolderNamePattern(folder);
      expect(isValid).toBe(true);  // The test will fail if any folder does not match the pattern
    });
  });

});
