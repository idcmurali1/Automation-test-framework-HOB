const fs = require('fs');

const filePath = './report/data/data.js';

let DATA;
let totalTests, passedTests, successRate;

// Load DATA from R2 Report...
try {
  if (fs.existsSync(filePath)) {
    const dataScript = fs.readFileSync(filePath, 'utf8');
    const jsonString = dataScript.replace(/^var DATA = /, '').replace(/;$/, '');
    try {
      DATA = JSON.parse(jsonString);
    } catch (error) {
      DATA = {};
    }
  } else {
    DATA = {};
  }

  // Check if DATA was able to be loaded...

  if (DATA && DATA.data.deviceList) {
    // If data able to be loaded...

    // Group the scenarios executed by 'testfilename'...
    const deviceList = DATA.data.deviceList;
    const groupedByFilename = {};
    deviceList.forEach((item) => {
      const filename = item.testfilename;
      if (!groupedByFilename[filename]) {
        groupedByFilename[filename] = [];
      }
      groupedByFilename[filename].push(item);
    });

    // Create consolidated results (no filenames repeated & test is passed only if all scenarios passed)...
    const consolidatedResults = Object.keys(groupedByFilename).map(
      (filename) => {
        const scenarios = groupedByFilename[filename];
        // Determine consolidated status...
        const status = scenarios.some(
          (scenario) =>
            scenario.status === 'failed' || scenario.status === 'skipped'
        )
          ? 'failed'
          : 'passed';
        return {
          testfilename: filename,
          status: status
        };
      }
    );

    // Calculate success rate...
    totalTests = consolidatedResults.length;
    passedTests = consolidatedResults.filter((test) => test.status === 'passed')
      .length;
    successRate = ((passedTests / totalTests) * 100).toFixed(2);
  } else {
    // If data not able to be loaded...
    console.log('<error>');
    process.exit(2);
  }

  console.log(`${successRate}% (${passedTests}/${totalTests})`);

  // Return success or error based on the success limit...
  if (successRate >= 85) {
    process.exit(0);
  } else {
    process.exit(1);
  }
} catch (error) {
  console.log('<error>');
  process.exit(2);
}
