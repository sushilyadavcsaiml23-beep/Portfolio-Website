import { useEffect, useRef, useState } from "react";
import "./styles/Home.css";

type HomeProps = {
  onNavigate?: (sectionId: string) => void;
};

type ParticlesWindow = Window & {
  particlesJS?: (id: string, config: Record<string, unknown>) => void;
};

const FULL_TITLE = "Sushil's Portfolio";

const Home = ({ onNavigate }: HomeProps) => {
  const [menuActive, setMenuActive] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const indexRef = useRef(0);

  // Typewriter effect
  useEffect(() => {
    indexRef.current = 0;
    setDisplayedTitle("");
    const interval = setInterval(() => {
      setDisplayedTitle(FULL_TITLE.slice(0, indexRef.current + 1));
      indexRef.current += 1;
      if (indexRef.current >= FULL_TITLE.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, []);

  // Particles
  useEffect(() => {
    const particlesWindow = window as ParticlesWindow;

    if (particlesWindow.particlesJS) {
      particlesWindow.particlesJS("particles-js-home", {
        particles: {
          number: { value: 65, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.35, random: false },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.25, width: 1 },
          move: { enable: true, speed: 3.5, direction: "none", random: false, straight: false, out_mode: "out" },
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
          modes: { repulse: { distance: 160 } },
        },
        retina_detect: true,
      });
    }
  }, []);

  const toggleMenu = () => setMenuActive((v) => !v);

  const redirectToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMenuActive(false);
    if (onNavigate) onNavigate(sectionId);
  };

  return (
    <div id="home" className="landing-view">
      {/* Navbar */}
      <header className="header">
        <a href="#home" onClick={(e) => redirectToSection(e, "home")} className="logo">
          Sushil Kumar Yadav
        </a>
        <i className={`bx ${menuActive ? "bx-x" : "bx-menu"}`} id="menu-icon" onClick={toggleMenu}></i>
        <nav className={`navbar ${menuActive ? "active" : ""}`}>
          <a href="#home" onClick={(e) => redirectToSection(e, "home")}>Home</a>
          <a href="#about-me" onClick={(e) => redirectToSection(e, "about-me")}>About</a>
          <a href="#experience" onClick={(e) => redirectToSection(e, "experience")}>Experience</a>
          <a href="#projects" onClick={(e) => redirectToSection(e, "projects")}>Projects</a>
          <a href="#skills" onClick={(e) => redirectToSection(e, "skills")}>Skills</a>
          <a href="#certificates" onClick={(e) => redirectToSection(e, "certificates")}>Certificates</a>
          <a href="#contact" onClick={(e) => redirectToSection(e, "contact")}>Contact</a>
          <a href="/Sushil_Kr_Yadav_CV.pdf" download="Sushil_Kr_Yadav_CV.pdf">Download CV</a>
        </nav>
        <div className={`nav-bg ${menuActive ? "active" : ""}`}></div>
      </header>

      {/* Particles */}
      <div id="particles-js-home"></div>

      {/* Hero Content */}
      <div id="content">
        <div className="center-container">
          {/* Typewriter Title */}
          <h1 className="hero-title-gradient">{displayedTitle}</h1>

          {/* Description */}
          <p className="hero-description">
            B.Tech CS student specializing in AI/ML. Experienced in building full-stack ML
            applications using Python, FastAPI, modern JS workflows. Strong grasp of ML
            fundamentals, CNNs, optimization algorithms, and deployment-ready engineering practices.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-buttons">
            <a
              href="#projects"
              className="hero-btn-primary"
              onClick={(e) => redirectToSection(e, "projects")}
            >
              <i className="fa-solid fa-rocket"></i> View Projects
            </a>
            <a
              href="#contact"
              className="hero-btn-secondary"
              onClick={(e) => redirectToSection(e, "contact")}
            >
              <i className="fa-solid fa-paper-plane"></i> Contact Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
