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
        python:".py",
        javascript:".js"
       }
        tmp.file({prefix: 'project', postfix: extensions[language], keep: true},async  function (err, path, fd, cleanupCallback) {
  
            if (err) throw err;
                 
       console.log("File: ", path);
       console.log("Filedescriptor: ", fd);
       await fs.writeFile(path, code,()=>console.log('written'))
       const commands = {
        java:`javac ${path} && java Main`,
        cpp:`gcc ${path} && \a.out`,
        c:`gcc ${path} && \a.out`,
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
