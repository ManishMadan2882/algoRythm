var tmp = require('tmp');
var fs = require('fs');
const { spawn } = require('child_process');

const extensions = {
  java: ".java",
  cpp: ".cpp",
  c: ".c",
  cs: ".cs",
  python: ".py",
  javascript: ".js"
};

const commands = {
  java: { cmd: 'java', args: ['Main'] },
  cpp: { cmd: './outputCPP', args: [] },
  c: { cmd: './outputC', args: [] },
  cs: { cmd: 'mono', args: ['output.exe'] },
  python: { cmd: 'python', args: [] },
  javascript: { cmd: 'node', args: [] }
};

function handleCompileSocket(socket) {
  socket.on('compile:start', async (data) => {
    const { code, language } = data;

    if (!code || !language) {
      socket.emit('compile:error', { error: 'Code and language are required' });
      socket.emit('compile:complete', { output: '', runtime: 0, exitCode: 1 });
      return;
    }

    if (!extensions[language]) {
      socket.emit('compile:error', { error: 'Unsupported language' });
      socket.emit('compile:complete', { output: '', runtime: 0, exitCode: 1 });
      return;
    }

    try {
      tmp.file({ prefix: 'project', postfix: extensions[language] }, async (err, path, fd, cleanupCallback) => {
        if (err) {
          socket.emit('compile:error', { error: err.message });
          socket.emit('compile:complete', { output: '', runtime: 0, exitCode: 1 });
          return;
        }

        try {
          // Write code to file
          if (language === 'java') {
            fs.writeFileSync('Main.java', code);
            // Compile Java
            const compileProcess = spawn('javac', ['Main.java']);
            compileProcess.on('close', (code) => {
              if (code !== 0) {
                socket.emit('compile:error', { error: 'Compilation failed' });
                socket.emit('compile:complete', { output: '', runtime: 0, exitCode: code });
                cleanupCallback();
                return;
              }
              startExecution(socket, language, path, cleanupCallback);
            });
          } else {
            fs.writeFileSync(path, code);
            compileAndExecute(socket, language, path, cleanupCallback);
          }
        } catch (error) {
          socket.emit('compile:error', { error: error.message });
          socket.emit('compile:complete', { output: '', runtime: 0, exitCode: 1 });
          cleanupCallback();
        }
      });
    } catch (error) {
      socket.emit('compile:error', { error: error.message });
      socket.emit('compile:complete', { output: '', runtime: 0, exitCode: 1 });
    }
  });

  socket.on('compile:input', (data) => {
    const { input } = data;
    if (socket.childProcess && socket.childProcess.stdin) {
      socket.childProcess.stdin.write(input + '\n');
    }
  });

  socket.on('compile:end', () => {
    if (socket.childProcess && socket.childProcess.stdin) {
      socket.childProcess.stdin.end();
    }
  });

  socket.on('disconnect', () => {
    if (socket.childProcess) {
      socket.childProcess.kill();
    }
  });
}

function compileAndExecute(socket, language, path, cleanupCallback) {
  const cmd = commands[language];
  const args = language === 'cpp' || language === 'c'
    ? [path, '-o', language === 'cpp' ? 'outputCPP' : 'outputC']
    : [path];

  const compileCmd = language === 'cpp' ? 'g++' : language === 'c' ? 'gcc' : language === 'cs' ? 'mcs' : cmd.cmd;

  const compileProcess = spawn(compileCmd, args);

  compileProcess.on('close', (code) => {
    if (code !== 0) {
      socket.emit('compile:error', { error: 'Compilation failed' });
      socket.emit('compile:complete', { output: '', runtime: 0, exitCode: code });
      cleanupCallback();
      return;
    }
    startExecution(socket, language, path, cleanupCallback);
  });
}

function startExecution(socket, language, path, cleanupCallback) {
  const cmd = commands[language];
  const args = language === 'cpp' || language === 'c' 
    ? []
    : language === 'cs'
    ? ['output.exe']
    : language === 'java'
    ? ['Main']
    : [path];

  const execCmd = language === 'cpp' ? './outputCPP' : language === 'c' ? './outputC' : language === 'cs' ? 'mono' : language === 'java' ? 'java' : cmd.cmd;

  const initialTime = Date.now();
  const childProcess = spawn(execCmd, args);
  
  socket.childProcess = childProcess;
  socket.emit('compile:ready');

  let output = '';

  childProcess.stdout.on('data', (data) => {
    output += data.toString();
    socket.emit('compile:output', { output: data.toString() });
  });

  childProcess.stderr.on('data', (data) => {
    socket.emit('compile:error', { error: data.toString() });
  });

  childProcess.on('close', (code) => {
    const runtime = Date.now() - initialTime;
    socket.emit('compile:complete', { output, runtime, exitCode: code });
    
    // Cleanup
    if (language === 'java') {
      fs.rm('Main.class', () => {});
    }
    cleanupCallback();
  });
}

module.exports = {
  handleCompileSocket
};

