import { useState, useEffect } from "react";
import Home from "./components/Home";
import Content from "./components/Content";
import "./App.css";

const App = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [view, setView] = useState<"home" | "content">(
    window.location.hash && window.location.hash !== "#home" ? "content" : "home"
  );

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash && hash !== "#home") {
        setView("content");
      } else {
        setView("home");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === "home") {
      window.location.hash = "#home";
      setView("home");
    } else {
      window.location.hash = `#${sectionId}`;
      setView("content");
    }
  };

  return (
    <main className="main-body">
      {view === "home" ? (
        <Home onNavigate={handleNavigate} />
      ) : (
        <Content hash={currentHash} onNavigate={handleNavigate} />
      )}
    </main>
  );
};

export default App;
