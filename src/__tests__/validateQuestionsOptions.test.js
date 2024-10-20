const fs = require('fs');
const path = require('path');

// Path to the 'data' folder where the JSON files are located
const dataDirectory = path.resolve(__dirname, '..', '..', 'public', 'data');

// Function to validate that the number of options is correct
function validateQuestionOptions(question) {
  expect(Array.isArray(question.options)).toBe(true);  // Ensure options is an array
  expect(question.options.length).toBe(4);  // Ensure there are exactly 4 options
}

// Function to validate that the correct answer is one of the options
function validateAnswerInOptions(question) {
  expect(question.options).toContain(question.answer);  // Ensure the answer is in the options
}

// Function to extract all questions from the JSON file
function extractAllQuestions(jsonData) {
  const questions = [];

  jsonData.topics.forEach(topic => {
    topic.questions.forEach(question => {
      questions.push(question);  // Push the entire question object
    });
  });

  return questions;
}

// Read the `index.json` file
const indexFilePath = path.join(dataDirectory, 'index.json');
const indexFileContent = fs.readFileSync(indexFilePath);
const indexJson = JSON.parse(indexFileContent);

// Jest unit tests
describe('Validate questions options and answers', () => {
  
  // Get all subfolders inside the 'data' folder
  const subfolders = fs.readdirSync(dataDirectory).filter(folder => {
    return fs.lstatSync(path.join(dataDirectory, folder)).isDirectory();
  });

  subfolders.forEach(subfolder => {
    const jsonFilePath = path.join(dataDirectory, subfolder, 'info.json');

    test(`should validate questions in subfolder ${subfolder} for correct options and answers`, () => {
      const rawData = fs.readFileSync(jsonFilePath);
      const jsonData = JSON.parse(rawData);

      // Extract questions from the JSON file
      const questions = extractAllQuestions(jsonData);

      // Validate each question
      questions.forEach(question => {
        validateQuestionOptions(question);  // Ensure there are exactly 4 options
        validateAnswerInOptions(question);  // Ensure the correct answer is among the options
      });
    });
  });
});