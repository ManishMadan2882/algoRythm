import copyIcon from "../assets/icons8-copy-24.png";
import { Editor } from "@monaco-editor/react";
import ClipLoader from "react-spinners/ClipLoader";
import { useState, useRef } from "react";
const CodeEditor = () => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  function showValue() {
    compileCode(editorRef.current.getValue());
  }
  const compilerThemes = [
    { value: "vs-dark", label: "Dark" },
    { value: "vs-light", label: "Light" },
    { value: "hc-black", label: "Contrast" },
  ];
  const languages = [
    { value: "c", label: "C", default: "c" },
    { value: "cpp", label: "C++", default: "cpp" },
    { value: "cs", label: "C#", default: "cs" },
    { value: "python", label: "Python", default: "py" },
    { value: "java", label: "Java", default: "java" },
    { value: "javascript", label: "Javascript", default: "js" },
  ];
  const textSizeOptions = [10, 12, 16, 20, 24, 28, 32, 36, 40, 44];
  const setLocal = (key, value) => {
    localStorage.setItem(key, value);
  };
  const compileCode = (code) => {
    setOutputLoading(true);
    setOutput("");
    console.log({ code: code, language: language, input: input });
    //https://api-compile.onrender.com/api/v1/compile
    fetch("https://api-compile.onrender.com/api/v1/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code, language: language, input: input }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOutput(data);

        setOutputLoading(false);
      })
      .catch((error) => console.error(error));
  };
  const [theme, setTheme] = useState(
    localStorage.getItem("editorTheme") || "vs-dark"
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "cpp"
  );
  const [outputLoading, setOutputLoading] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row bg-chinese-black justify-normal">
      <div className="w-full lg:w-2/3 lg:h-[90vh]">
        <div className="flex justify-start gap-4 my-4 px-4 lg:px-0">
          <select
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              setLocal("editorTheme", e.target.value);
            }}
            className="px-4 py-3 text-base border outline-none rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            {compilerThemes.map((elem, key) => {
              return (
                <option key={key} value={elem.value}>
                  {elem.label}
                </option>
              );
            })}
          </select>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setLocal("language", e.target.value);
            }}
            className="px-4 py-3 text-base border outline-none rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            {languages.map((elem, key) => {
              return (
                <option key={key} value={elem.value} className="text-xs">
                  {elem.label}
                </option>
              );
            })}
          </select>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="px-4 py-3 text-base border outline-none rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            {textSizeOptions.map((elem, key) => {
              return (
                <option key={key} value={elem} className="text-xs">
                  {elem}
                </option>
              );
            })}
          </select>
        </div>
        <Editor
          theme={theme}
          defaultValue={
            language === "python"
              ? "## Write Code here"
              : "/* Write Code here */"
          }
          options={{
            fontSize: Number(fontSize),
          }}
          onMount={handleEditorDidMount}
          className="h-[50vh] lg:h-[calc(90vh-60px)] z-30"
          language={language}
        />
      </div>
      <div className="flex flex-col relative w-full lg:w-1/3 p-2 h-[50vh] lg:h-[90vh] lg:border-l border-gray-600">
        <div className="w-[75vw] h-[75vw] md:w-[422px] md:h-[422px] z-0 pointer-events-none absolute top-0 left-0 block mx-auto blur-3xl bg-[#BE3AFC1A] rounded-full"></div>

        <div className="w-[75vw] h-[75vw] md:w-[422px] md:h-[422px] z-0 pointer-events-none absolute bottom-0 right-0 block mx-auto blur-3xl bg-blueberry rounded-full"></div>
        <div className="w-full h-1/2 z-30 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-white">
              INPUT
            </label>
            <button
              onClick={showValue}
              className="text-stone-200 bg-teal-900 px-3 py-1 rounded-md hover:opacity-60 transition-opacity duration-150 cursor-pointer text-sm"
            >Run</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className=" resize-none flex-1 w-full p-2.5 text-sm  rounded-lg  bg-dark-charcoal border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Testcase 0"
          />
        </div>
        <div id="terminal" className="w-full h-1/2 z-30 flex flex-col mt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-white">
              OUTPUT {output && ` [${output.runtime} ms]`}
            </label>
            <button
              title="Copy Output"
              onClick={() => navigator.clipboard.writeText(output.output)}
              className="hover:bg-gray-700 p-2 rounded-lg"
            >
              <img src={copyIcon} />
            </button>
          </div>
          <pre
            className=" overflow-scroll editscroll p-2.5 flex-1 w-full text-sm  rounded-lg border  bg-dark-charcoal border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Testcase 0"
          >
            {output.output}
            <div className="flex justify-center mt-6">
              <ClipLoader
                color={"white"}
                loading={outputLoading}
                className=""
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
