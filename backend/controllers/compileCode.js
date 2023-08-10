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

        tmp.file({prefix: 'project', postfix: extensions[language], tmpdir:'./'},async  function (err, path, fd, cleanupCallback) {
  
            if (err) throw err;
         
       console.log("File: ", path);
       console.log("Filedescriptor: ", fd);
        if(language === 'java')
        {
            fs.rename(path,__dirname+'/Main.java',()=>console.log('renamed')) 
            fs.writeFile('Main.java', code, () => console.log('written file'))
        }
        else
          fs.writeFile(path, code, () => console.log('written file'))
       console.log(__dirname);
       const commands = {
        java:`javac Main.java  && java Main`,
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
      if(language === 'java')
      fs.rm('Main.class',()=>console.log('deleted class java'));

      child.stdin.end(); 
      
      cleanupCallback();
});
}

module.exports = {
    compile
}
