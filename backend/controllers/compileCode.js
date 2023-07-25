var tmp = require('tmp');
var fs = require('fs');
const {exec} = require('child_process')

async function compile(req,res)
{
    const {code,language,input} =req.body
    console.log({code,input,language});
    let result = '';
       const extensions = {
        java:".java",
        cpp:".cpp",
        c:".c",
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
        python:`python ${path}`,
        javascript:`node ${path}`
       }
       const child = exec(commands[language], { stdio: 'pipe' }, (error, stdout, stderr) => {
        if (error) {
         res.json({output : error.message});
         return;
        }
        res.json({output : stdout});
      });
      
      // Write the input to the child process
      child.stdin.write(input);
      child.stdin.end(); // End the input stream
      
 
      
});
}

module.exports = {
    compile
}
