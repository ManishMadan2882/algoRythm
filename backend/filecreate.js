var tmp = require('tmp');
var fs = require('fs');
const {exec} = require('child_process')

async function compileCode(code,language,input)
{
       const extensions = {
        java:".java",
        cpp:".cpp",
        c:".c",
        python:".py",
        javascript:".js"
       }
        tmp.file({prefix: 'project', postfix: extensions[language], keep: true}, function (err, path, fd, cleanupCallback) {
  
            if (err) throw err;
                 
       console.log("File: ", path);
       console.log("Filedescriptor: ", fd);
       fs.writeFile(path, code,()=>console.log('written'))
       const commands = {
        java:`javac ${path} && java Main`,
        cpp:`gcc ${path}.c && \a.out`,
        c:`gcc ${path}.c && \a.out`,
        python:`python ${path}`,
        javascript:`node ${path}`
       }
       const child = exec(commands[language], { stdio: 'pipe' }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        console.log(`Output: ${stdout}`);
      });
      
      
      // Write the input to the child process
      child.stdin.write(input);
      child.stdin.end(); // End the input stream
      
      // Handle output or errors if needed
      child.stdout.on('data', (data) => {
        console.log(`Received output: ${data}`);
      });
      
      child.stderr.on('data', (data) => {
        console.error(`Received error: ${data}`);
      });
});
}

/*  */
compileCode(`console.log('hello js !');`,'javascript','')



/* function compilerInfo(language){
    let compilerData = {
        javascript:{
           command: `node ${path}`,
           ex:".js"
        },
        java:{
            command:`javac ${path}.java && java Main`,
            ex:'.java'
        },
        cpp:{
            command:`gcc ${path}.c && \a.out`,
             ex:".cpp"
            },
        c:{
            command:`gcc ${path}.c && \a.out`,
             ex:".c"
            },
        python:{
            command:`python ${path}`,
            ex:'.py'
          }

        }
        return compilerData[language]
}
 */