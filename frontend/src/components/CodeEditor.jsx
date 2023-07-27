import React from 'react'
import copyIcon from '../assets/icons8-copy-24.png'
import { Editor } from '@monaco-editor/react';
import ClipLoader from "react-spinners/ClipLoader";
import { useState,useRef } from 'react';
const CodeEditor = () => {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
      editorRef.current = editor;
    }
  
    function showValue() {
      compileCode(editorRef.current.getValue());
    }
    const compilerThemes = [
    {value:"vs-dark",label:"Dark"},
    {value:"vs-light",label:"Light"},
    {value:"hc-black",label:"Contrast"},
    ];
    const languages = [
        { value: "c", label: "C",default:"c" },
        { value: "cpp", label: "C++",default:"cpp" },
        { value: "cs", label: "C#",default:"cs" },
        { value: "python", label: "Python",default:"py" },
        { value: "java", label: "Java",default:"java" },
        { value: "javascript", label: "Javascript",default:"js" }
    ];
    const textSizeOptions = [10,12,16,20,24,28,32,36,40,44];
    const compileCode = (code)=>{
        setOutputLoading(true);
        setOutput('');
        console.log({code:code,language:language,input:input});
        //https://api-compile.onrender.com/api/v1/compile
        fetch('http://localhost:5000/api/v1/compile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({code:code,language:language,input:input})
          })
            .then(response => response.json())
            .then(data =>{ 
                console.log(data)
                setOutput(data)
                
                setOutputLoading(false);
            })
            .catch(error => console.error(error));
    }
    const  [theme,setTheme] = useState('vs-dark')
    const  [input,setInput] = useState('')
    const  [output,setOutput] = useState('')
    const  [fontSize,setFontSize] = useState(16) 
    const  [language,setLanguage] = useState('java')
    const  [outputLoading, setOutputLoading] = useState(false);
    return (
        <div className='flex flex-wrap justify-normal bg-gray-800 h-full'>
          <div className='w-full  md:w-2/3'>
          <div >
            <select value={theme}  onChange={(e)=>setTheme(e.target.value)}
             className='bg-sky-900 text-orange-100 m-2 p-2'
            >
               {compilerThemes.map((elem,key)=>{
                  return(<option value={elem.value}>{elem.label}</option>)
               })}
            </select>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)}
             className='bg-sky-900 text-orange-100 m-2 p-2'
            >
            {
                languages.map((elem,key)=>{
                    return (<option value={elem.value} className='text-xs'>
                       {elem.label}
                    </option>)
                })
            }
            </select>
            <select value={fontSize} onChange={(e)=>setFontSize(e.target.value)}
             className='bg-sky-900 text-orange-100 m-2 px-5 py-2'
            >
            {
                textSizeOptions.map((elem,key)=>{
                    return (<option value={elem} className='text-xs'>
                       {elem}
                    </option>)
                })
            }
            </select>
         </div>
          <Editor
            theme={theme}
          
            defaultValue={language === 'python' ?"## Write Code here" : "/* Write Code here */"}
            
            options={{
                fontSize:Number(fontSize),
            }}
            onMount={handleEditorDidMount}
            height="610px"
            language={language}
          /> 
          </div>
          <div className='w-full  md:w-1/3 p-2'>
            <div className='w-full ' >
                <label className="mb-2 text-sm font-medium inline text-white">INPUT</label>
                <button onClick={showValue} className=' bg-cyan-950  border-white border-[0.25px] hover:bg-gray-600 text-teal-200 rounded-md p-1 m-2'>
                    RUN
                </button>
                <textarea value={input} rows="14" onChange={(e)=>setInput(e.target.value)} className=" resize-none block w-full p-2.5 text-sm    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Testcase 0"/>
            </div>
            <div className='w-full mt-2'>
                <label className="inline mb-2 text-sm font-medium text-white ">OUTPUT {output && ` [${output.runtime} ms]`}</label>
                <button title="Copy Output" onClick={()=>navigator.clipboard.writeText(output.output)} className=' float-right hover:bg-gray-700 p-2 rounded-lg'>
                   <img src={copyIcon}/>
                </button>
                <pre className=" overflow-scroll editscroll p-2.5 w-full text-sm  rounded-lg border  bg-gray-700 border-gray-600 h-72 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Testcase 0">
                   {output.output}
                  <div className='flex justify-center mt-6'>
                  <ClipLoader
                    color={"white"}
                    loading={outputLoading}
                    className=''
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    />
                  </div>
                </pre>
            </div>
          </div>
        </div>
      );
}

export default CodeEditor