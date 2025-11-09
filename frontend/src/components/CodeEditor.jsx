import copyIcon from "../assets/icons8-copy-24.png";
import { Editor } from "@monaco-editor/react";
import ClipLoader from "react-spinners/ClipLoader";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
const CodeEditor = () => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    setIsEditorReady(true);
  }

  function showValue() {
    if (!editorRef.current) return;
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

  const getDefaultCode = (lang) => {
    const templates = {
      c: `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
      cs: `using System;

class Program {
    static void Main() {
        // Your code here
    }
}`,
      python: `# Your code here`,
      java: `import java.util.*;

class Main {
    public static void main(String args[]) {
        // Your code here
    }
}`,
      javascript: `// Your code here`,
    };
    return templates[lang] || "// Your code here";
  };

  const setLocal = (key, value) => {
    localStorage.setItem(key, value);
  };

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection using Vite environment variables
    const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER || "http://localhost:5000";
    socketRef.current = io(SOCKET_SERVER);

    socketRef.current.on("compile:ready", () => {
      setTerminalOutput((prev) => prev + "\n[Program started]\n");
      setIsRunning(true);
    });

    socketRef.current.on("compile:output", (data) => {
      setTerminalOutput((prev) => prev + data.output);
    });

    socketRef.current.on("compile:error", (data) => {
      setTerminalOutput((prev) => prev + `\n[Error] ${data.error}\n`);
    });

    socketRef.current.on("compile:complete", (data) => {
      setTerminalOutput((prev) => prev + `\n[Program completed in ${data.runtime}ms]\n`);
      setIsRunning(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const compileCode = (code) => {
    setTerminalOutput("");
    setIsRunning(true);
    if (socketRef.current) {
      socketRef.current.emit("compile:start", {
        code: code,
        language: language,
      });
    }
  };
  const [theme, setTheme] = useState(
    localStorage.getItem("editorTheme") || "vs-dark"
  );
  const [editorCode, setEditorCode] = useState(
    localStorage.getItem("editorCode") || getDefaultCode("cpp")
  );
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "cpp"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);
  const [showLanguageWarning, setShowLanguageWarning] = useState(false);
  const terminalEndRef = useRef(null);

  const handleLanguageChange = (newLanguage) => {
    if (editorCode.trim() !== "") {
      setPendingLanguage(newLanguage);
      setShowLanguageWarning(true);
    } else {
      setLanguage(newLanguage);
      setLocal("language", newLanguage);
      setEditorCode(getDefaultCode(newLanguage));
    }
  };

  const keepMyCode = () => {
    // Change language but keep the existing code
    if (pendingLanguage) {
      setLanguage(pendingLanguage);
      setLocal("language", pendingLanguage);
      setPendingLanguage(null);
    }
    setShowLanguageWarning(false);
  };

  const discardAndLoadTemplate = () => {
    // Change language and reset to default template
    if (pendingLanguage) {
      setEditorCode(getDefaultCode(pendingLanguage));
      setLanguage(pendingLanguage);
      setLocal("language", pendingLanguage);
      setPendingLanguage(null);
    }
    setShowLanguageWarning(false);
  };

  const cancelLanguageChange = () => {
    setPendingLanguage(null);
    setShowLanguageWarning(false);
  };

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalOutput]);

  const handleTerminalInput = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (socketRef.current && terminalInput.trim()) {
        socketRef.current.emit("compile:input", { input: terminalInput });
        setTerminalOutput((prev) => prev + terminalInput + "\n");
        setTerminalInput("");
      }
    }
  };

  const handleTerminalEnd = () => {
    if (socketRef.current) {
      socketRef.current.emit("compile:end");
    }
  };

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
            onChange={(e) => handleLanguageChange(e.target.value)}
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
          value={editorCode}
          onChange={(value) => {
            setEditorCode(value || "");
            setLocal("editorCode", value || "");
          }}
          options={{
            fontSize: Number(fontSize),
            minimap: { enabled: true },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
          onMount={handleEditorDidMount}
          className="h-[50vh] lg:h-[calc(90vh-60px)] z-30"
          language={language}
        />
      </div>
      <div className="flex flex-col relative w-full lg:w-1/3 p-2 h-[50vh] lg:h-[90vh] lg:border-l border-gray-600">
        <div className="w-[75vw] h-[75vw] md:w-[422px] md:h-[422px] z-0 pointer-events-none absolute top-0 left-0 block mx-auto blur-3xl bg-[#BE3AFC1A] rounded-full"></div>

        <div className="w-[75vw] h-[75vw] md:w-[422px] md:h-[422px] z-0 pointer-events-none absolute bottom-0 right-0 block mx-auto blur-3xl bg-blueberry rounded-full"></div>
        <div id="terminal" className="w-full h-full z-30 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-white">
              TERMINAL
            </label>
            <div className="flex gap-2">
              <button
                onClick={showValue}
                disabled={!isEditorReady || isRunning}
                className={`px-3 py-1 rounded-md transition-opacity duration-150 text-sm ${
                  isEditorReady && !isRunning
                    ? "text-stone-200 bg-teal-900 hover:opacity-60 cursor-pointer"
                    : "text-gray-500 bg-gray-700 cursor-not-allowed opacity-50"
                }`}
              >
                {isRunning ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleTerminalEnd}
                disabled={!isRunning}
                className={`px-3 py-1 rounded-md transition-opacity duration-150 text-sm ${
                  isRunning
                    ? "text-stone-200 bg-red-900 hover:opacity-60 cursor-pointer"
                    : "text-gray-500 bg-gray-700 cursor-not-allowed opacity-50"
                }`}
              >
                Stop
              </button>
              <button
                title="Copy Output"
                onClick={() => {
                  if (terminalOutput) {
                    navigator.clipboard.writeText(terminalOutput);
                  }
                }}
                disabled={!terminalOutput}
                className={`p-2 rounded-lg ${
                  terminalOutput
                    ? "hover:bg-gray-700 cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <img src={copyIcon} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto editscroll bg-dark-charcoal rounded-lg border border-gray-600 p-2.5 mb-2">
            <pre className="text-sm text-white font-mono whitespace-pre-wrap break-words">
              {terminalOutput}
              {isRunning && (
                <div className="flex items-center gap-2 mt-2">
                  <ClipLoader
                    color={"white"}
                    loading={true}
                    size={20}
                    aria-label="Loading Spinner"
                  />
                  <span>Running...</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </pre>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalInput}
              placeholder="Enter input (Press Enter to send)"
              disabled={!isRunning}
              className={`flex-1 px-3 py-2 rounded-lg text-sm bg-dark-charcoal border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${
                !isRunning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>
      </div>
      {showLanguageWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-600">
            <h2 className="text-lg font-semibold text-white mb-2">Switch Language?</h2>
            <p className="text-gray-300 mb-6">
              You have unsaved code. What would you like to do?
            </p>
            <div className="space-y-3">
              <button
                onClick={keepMyCode}
                className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
              >
                Keep My Code
              </button>
              <button
                onClick={discardAndLoadTemplate}
                className="w-full px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors text-sm"
              >
                Discard & Load Template
              </button>
              <button
                onClick={cancelLanguageChange}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
