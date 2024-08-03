import React from "react";
import Playground from "./pages/Playground";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <div className="min-h-screen bg-chinese-black relative overflow-hidden">
      <Navbar />
      <Playground />
      <div className="w-[75vw] h-[75vw] md:w-[422px] md:h-[422px] z-0 pointer-events-none absolute top-0 left-0 block mx-auto blur-2xl bg-fluorescent-blue rounded-full"></div>
    </div>
  );
};

export default App;
