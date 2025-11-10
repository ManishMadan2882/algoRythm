import Playground from "./pages/Playground";
import {DocsGPTWidget} from "docsgpt-react";
import Navbar from "./components/Navbar";
const apiKey = import.meta.env.VITE_DOCSGPT_KEY;

const App = () => {
  return (
    <div className="min-h-screen bg-chinese-black relative overflow-hidden">
      <Navbar />
      
      <Playground />
      <DocsGPTWidget
        apiKey={apiKey}
        model="gpt-4"
        size={'medium'}
        showPoweredBy={false}
        showCopyButton={false}
        showFeedbackButton={false}
        showShareButton={false}
        showDownloadButton={false}
        showClearButton={false}
        showHistoryButton={false}
        showSettingsButton={false}
        showHelpButton={false}  
        description="Feel free to ask questions related to the code"
        heroTitle="algoRythm"
        heroDescription="Ask me anything related to the code"
      />
      <div className="w-[75vw] h-[75vw] md:w-[422px] md:h-[422px] z-0 pointer-events-none absolute top-0 left-0 block mx-auto blur-2xl bg-fluorescent-blue rounded-full"></div>
    </div>
  );
};

export default App;
