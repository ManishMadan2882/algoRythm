const { exec } = require('child_process');

const command = 'python test.py'; // Replace with the command you want to execute

// Create a child process and provide input
const child = exec(command, { stdio: 'pipe' }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.log(`Output: ${stdout}`);
});

const input = '4'; // Replace with the input you want to provide

// Write the input to the child process
child.stdin.write('4');
child.stdin.end(); // End the input stream

// Handle output or errors if needed
child.stdout.on('data', (data) => {
  console.log(`Received output: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`Received error: ${data}`);
});
