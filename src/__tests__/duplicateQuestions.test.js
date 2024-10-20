const fs = require('fs');
const path = require('path');

// Path to the 'data' folder where the JSON files are located
const dataDirectory = path.resolve(__dirname, '..', '..', 'public', 'data');

// Function to extract all questions from the JSON file
function extractAllQuestions(jsonData) {
  const questions = [];

  jsonData.topics.forEach(topic => {
    topic.questions.forEach(question => {
      questions.push(question.question);  // Extract only the question text
    });
  });

  return questions;
}

// Read the `index.json` file
const indexFilePath = path.join(dataDirectory, 'index.json');
const indexFileContent = fs.readFileSync(indexFilePath);
const indexJson = JSON.parse(indexFileContent);

// Jest unit tests
describe('Check for duplicate questions across JSON files', () => {
  
  // Get all subfolders inside the 'data' folder
  const subfolders = fs.readdirSync(dataDirectory).filter(folder => {
    return fs.lstatSync(path.join(dataDirectory, folder)).isDirectory();
  });

  // Variable to store all questions globally
  const allQuestions = new Set();  // We use a Set to check for duplicates

  subfolders.forEach(subfolder => {
    const jsonFilePath = path.join(dataDirectory, subfolder, 'info.json');

    test(`should check for duplicate questions in subfolder ${subfolder}`, () => {
      const rawData = fs.readFileSync(jsonFilePath);
      const jsonData = JSON.parse(rawData);

      // Extract questions from the JSON file
      const questions = extractAllQuestions(jsonData);

      // Check for duplicates within the current JSON file
      const localQuestionsSet = new Set();
      questions.forEach(question => {
        expect(localQuestionsSet.has(question)).toBe(false);  // Fails if duplicates found locally
        localQuestionsSet.add(question);
      });

      // Check for duplicates globally across all JSON files
      questions.forEach(question => {
        expect(allQuestions.has(question)).toBe(false);  // Fails if question already exists globally
        allQuestions.add(question);  // Add the question to the global set
      });
    });
  });
});
