var tmp = require('tmp');
var fs = require('fs');

const {exec} = require('child_process')

async function compile(req,res)
{
    const {code,language,input} =req.body
    let result = '';
       const extensions = {
        java:".java",
        cpp:".cpp",
        c:".c",
        cs:".cs",
        python:".py",
        javascript:".js"
       }

        tmp.file({prefix: 'project', postfix: extensions[language], keep: true},async  function (err, path, fd, cleanupCallback) {
  
            if (err) throw err;
                 
       console.log("File: ", path);
       console.log("Filedescriptor: ", fd);
       fs.writeFile(path, code, () => console.log('written file'))
      
       const commands = {
        java:`javac ${path} && java ${path}`,
        cpp:`g++ ${path} -o outputCPP && ./outputCPP`,
        c:`gcc ${path} -o outputC && ./outputC`,
        cs:`mcs ${path} && mono ${path.substring(0,path.length-3)}.exe`,
        python:`python ${path}`,
        javascript:`node ${path}`
       }
       const initialTime = Date.now();
       const child = exec(commands[language], { stdio: 'pipe' }, (error, stdout, stderr) => {
        if (error) {
         res.json({output : error.message,runtime : Date.now()-initialTime});
         return;
        }
        res.json({output : stdout,runtime:Date.now()-initialTime});
      });
      
      // Write the input to the child process
      child.stdin.write(input);
      // End the input stream
      child.stdin.end(); 
});
}

module.exports = {
    compile
}
