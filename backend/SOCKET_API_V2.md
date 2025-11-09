# Socket.io API v2 - Real-time Code Compilation

## Overview
The v2 API uses WebSockets (Socket.io) for real-time code compilation and execution with interactive input/output handling.

## Connection
```javascript
const socket = io('http://localhost:5000');
```

## Events

### Client → Server

#### 1. `compile:start`
Initiates code compilation and execution.

**Payload:**
```javascript
{
  code: string,      // Source code to compile
  language: string   // Language: 'java', 'cpp', 'c', 'cs', 'python', 'javascript'
}
```

**Example:**
```javascript
socket.emit('compile:start', {
  code: 'print("Hello")',
  language: 'python'
});
```

#### 2. `compile:input`
Sends input to the running program (for each iteration).

**Payload:**
```javascript
{
  input: string  // User input for current iteration
}
```

**Example:**
```javascript
socket.emit('compile:input', { input: '5' });
```

#### 3. `compile:end`
Terminates the input stream (signals EOF to the program).

**Example:**
```javascript
socket.emit('compile:end');
```

---

### Server → Client

#### 1. `compile:ready`
Emitted when compilation is successful and execution has started.

**Payload:** None

#### 2. `compile:output`
Emitted when the program produces output.

**Payload:**
```javascript
{
  output: string  // Program output chunk
}
```

#### 3. `compile:error`
Emitted when an error occurs (compilation or runtime).

**Payload:**
```javascript
{
  error: string  // Error message
}
```

#### 4. `compile:complete`
Emitted when program execution completes.

**Payload:**
```javascript
{
  output: string,    // Complete program output
  runtime: number,   // Execution time in milliseconds
  exitCode: number   // Process exit code
}
```

---

## Usage Example

### Interactive Program (Multiple Inputs)
```javascript
const socket = io('http://localhost:5000');

// Start compilation
socket.emit('compile:start', {
  code: `
    n = int(input())
    for i in range(n):
        print(f"Number: {i}")
  `,
  language: 'python'
});

// Listen for ready signal
socket.on('compile:ready', () => {
  console.log('Program started, sending input...');
  socket.emit('compile:input', { input: '3' });
});

// Listen for output
socket.on('compile:output', (data) => {
  console.log('Output:', data.output);
});

// Listen for completion
socket.on('compile:complete', (data) => {
  console.log('Program finished');
  console.log('Total runtime:', data.runtime, 'ms');
});

// Listen for errors
socket.on('compile:error', (data) => {
  console.error('Error:', data.error);
});
```

### Simple Program (No Input)
```javascript
socket.emit('compile:start', {
  code: 'console.log("Hello World")',
  language: 'javascript'
});

socket.on('compile:output', (data) => {
  console.log(data.output);
});

socket.on('compile:complete', (data) => {
  console.log('Done in', data.runtime, 'ms');
});
```

---

## Supported Languages
- `java` - Java
- `cpp` - C++
- `c` - C
- `cs` - C#
- `python` - Python
- `javascript` - Node.js

---

## Notes
- Each socket connection handles one compilation session
- Input is sent line-by-line
- Call `compile:end` to signal EOF to the program
- Automatic cleanup on disconnect

