import { useState, useEffect } from "react";
import "./styles/Content.css";
import "./styles/ContactPage.css";

type ContentProps = {
  hash: string;
  onNavigate?: (sectionId: string) => void;
};

type ParticlesWindow = Window & {
  particlesJS?: (id: string, config: Record<string, unknown>) => void;
};

const ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

const isContactResponse = (value: unknown): value is { message?: string; success?: boolean } =>
  typeof value === "object" &&
  value !== null &&
  (!("message" in value) || typeof value.message === "string") &&
  (!("success" in value) || typeof value.success === "boolean");

const Content = ({ hash, onNavigate }: ContentProps) => {
  const [menuActive, setMenuActive] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "auto";
    // Scroll to the correct section based on hash
    const sectionId = hash.substring(1);
    if (sectionId && sectionId !== "home") {
      const section = document.getElementById(sectionId);
      if (section) {
        // Wait briefly for content to mount before scrolling
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  useEffect(() => {
    const particlesWindow = window as ParticlesWindow;

    // Initialize Particles in Footer
    if (particlesWindow.particlesJS) {
      particlesWindow.particlesJS("particles-js-footer", {
        "particles": {
          "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
          "color": { "value": "#ffffff" },
          "shape": { "type": "circle" },
          "opacity": { "value": 0.5, "random": false },
          "size": { "value": 3, "random": true },
          "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
          "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": { "enable": true, "mode": "repulse" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
          },
          "modes": {
            "repulse": { "distance": 200 }
          }
        },
        "retina_detect": true
      });
    }
  }, []);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMenuActive(false);
    if (sectionId === "home") {
      if (onNavigate) {
        onNavigate("home");
      }
      return;
    }
    window.location.hash = `#${sectionId}`;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setFormStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();
    const botcheck = String(formData.get("botcheck") ?? "").trim();

    try {
      if (website || botcheck) {
        throw new Error("Your request was flagged by our anti-spam check. Please try again.");
      }

      if (!name || !email || !message) {
        throw new Error("Please complete all required fields before sending your message.");
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      if (name.length > 100 || email.length > 254 || message.length > 5000) {
        throw new Error("Your message is too long. Please shorten your name, email, or message.");
      }

      const payload = new FormData();
      payload.append("access_key", ACCESS_KEY);
      payload.append("name", name);
      payload.append("email", email);
      payload.append("message", message);
      payload.append("subject", `Portfolio contact from ${name}`);
      payload.append("from_name", "Portfolio Website");
      payload.append("replyto", email);
      payload.append("botcheck", botcheck);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });

      let result: { message?: string; success?: boolean } | null = null;
      try {
        const payloadJson: unknown = await response.json();
        if (isContactResponse(payloadJson)) {
          result = payloadJson;
        }
      } catch {
        result = null;
      }

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message || `The message could not be sent right now (HTTP ${response.status}). Please try again later.`
        );
      }

      setFormStatus({ type: "success", message: "Thanks! Your message was sent successfully." });
      form.reset();
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send your message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="content-view">
      {/* Header section navbar */}
      <header className="header">
        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="logo">
          Sushil Kumar Yadav
        </a>
        <i
          className={`bx ${menuActive ? "bx-x" : "bx-menu"}`}
          id="menu-icon"
          onClick={() => setMenuActive(!menuActive)}
        ></i>
        <nav className={`navbar ${menuActive ? "active" : ""}`}>
          <a href="#home" onClick={(e) => scrollToSection(e, "home")}>
            Home
          </a>
          <a href="#about-me" onClick={(e) => scrollToSection(e, "about-me")}>
            About
          </a>
          <a href="#experience" onClick={(e) => scrollToSection(e, "experience")}>
            Experience
          </a>
          <a href="#projects" onClick={(e) => scrollToSection(e, "projects")}>
            Projects
          </a>
          <a href="#skills" onClick={(e) => scrollToSection(e, "skills")}>
            Skills
          </a>
          <a href="#certificates" onClick={(e) => scrollToSection(e, "certificates")}>
            Certificates
          </a>
          <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
            Contact
          </a>
          <a href="/Sushil_Kr_Yadav_CV.pdf" download="Sushil_Kr_Yadav_CV.pdf">
            Download CV
          </a>
        </nav>
        <div className={`nav-bg ${menuActive ? "active" : ""}`}></div>
      </header>

      <div className="content-sections-container">
        {/* About Me Section */}
        <section className="about-me" id="about-me">
          <div className="section-content-wrapper">
            <div style={{ textAlign: "center" }}>
              <h3 className="animate-charcter">ABOUT ME</h3>
            </div>
            <h3>Driven Software Developer & ML Engineer: Crafting Intelligent Solutions with Dedication</h3>
            <p style={{ opacity: 0.9, fontSize: "1.1rem", lineHeight: "1.8", margin: "20px auto 35px auto" }}>
              I am a B.Tech Computer Science student specializing in <strong>Artificial Intelligence, Machine Learning & IIoT</strong> at GLA University, Mathura (2023–2027), with hands-on experience in <strong>AI/ML, software development, and full-stack technologies</strong>. Proficient in <strong>Java, Python, SQL, DBMS, React, and Data Structures & Algorithms</strong>, with a strong foundation in problem-solving and object-oriented programming. Gained industry exposure through an internship at <strong>Hindalco Industries (BirlaSoft)</strong> and demonstrated consistent coding practice through a <strong>100+ day LeetCode streak</strong>. Experienced in building real-world applications that combine intelligent algorithms with scalable and user-focused software solutions.
            </p>

            {/* Quick Profile Highlight Cards */}
            <div className="about-highlights" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "30px" }}>
              <div className="glass" style={{ padding: "22px", borderRadius: "15px", textAlign: "left", border: "1px solid rgba(129, 140, 248, 0.25)" }}>
                <i className="fa-solid fa-graduation-cap fa-2xl" style={{ color: "#818cf8", marginBottom: "15px", display: "block" }}></i>
                <h4 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "6px" }}>Education</h4>
                <p style={{ fontSize: "0.92rem", opacity: 0.9, margin: 0, lineHeight: "1.5" }}>B.Tech (CSE - AIML & IIOT)<br /><span style={{ opacity: 0.75 }}>GLA University, Mathura</span></p>
              </div>
              <div className="glass" style={{ padding: "22px", borderRadius: "15px", textAlign: "left", border: "1px solid rgba(129, 140, 248, 0.25)" }}>
                <i className="fa-solid fa-brain fa-2xl" style={{ color: "#a855f7", marginBottom: "15px", display: "block" }}></i>
                <h4 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "6px" }}>AI / ML & LLMs</h4>
                <p style={{ fontSize: "0.92rem", opacity: 0.9, margin: 0, lineHeight: "1.5" }}>LLMs, RAG, TensorFlow, PyTorch & Deep Learning</p>
              </div>
              <div className="glass" style={{ padding: "22px", borderRadius: "15px", textAlign: "left", border: "1px solid rgba(129, 140, 248, 0.25)" }}>
                <i className="fa-solid fa-code fa-2xl" style={{ color: "#60a5fa", marginBottom: "15px", display: "block" }}></i>
                <h4 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "6px" }}>Core Engineering</h4>
                <p style={{ fontSize: "0.92rem", opacity: 0.9, margin: 0, lineHeight: "1.5" }}>Python, Java, DSA, OOP, DBMS & SQL</p>
              </div>
              <div className="glass" style={{ padding: "22px", borderRadius: "15px", textAlign: "left", border: "1px solid rgba(129, 140, 248, 0.25)" }}>
                <i className="fa-solid fa-fire fa-2xl" style={{ color: "#f59e0b", marginBottom: "15px", display: "block" }}></i>
                <h4 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "6px" }}>Achievements</h4>
                <p style={{ fontSize: "0.92rem", opacity: 0.9, margin: 0, lineHeight: "1.5" }}>Top 5 Finalist (ML with Full-Stack Application Development) & Hindalco ML Intern</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="experience" id="experience">
          <div className="section-content-wrapper">
            <div style={{ textAlign: "center" }}>
              <h3 className="animate-charcter">Experience</h3>
            </div>
            <div className="timeline">
              <div className="exp-container left-container">
                <img src="/content/codsoft logo.jpeg" alt="Hindalco" />
                <div className="text-box glass">
                  <h2>Hindalco Industries Limited (Birla Soft)</h2>
                  <small style={{ color: "#c084fc", fontWeight: 600 }}>Machine Learning Intern | May 2025 – Jun 2025</small>
                  <p>
                    • Developed a predictive House Price Prediction model using advanced regression techniques.<br />
                    • Conducted end-to-end data preprocessing, feature engineering, and model evaluation.<br />
                    • Significantly improved prediction accuracy through feature selection and hyperparameter tuning.
                  </p>
                  <span className="left-container-arrow"></span>
                </div>
              </div>
              <div className="exp-container right-container">
                <img src="/content/internpe logo.jpg" alt="Independent" />
                <div className="text-box glass">
                  <h2>AI & Full-Stack Projects</h2>
                  <small style={{ color: "#c084fc", fontWeight: 600 }}>Software & ML Engineer | 2024 – Present</small>
                  <p>
                    • Designing multimodal AI systems (LLaMA Vision, Groq Whisper, ElevenLabs) for healthcare and e-commerce.<br />
                    • Building interactive analytics platforms (WhatsApp Chat Analyzer, LeetCode Leaderboard Dashboard).<br />
                    • Developing deep learning recommendation models and REST API integrations.
                  </p>
                  <span className="right-container-arrow"></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="projects" id="projects">
          <div className="section-content-wrapper">
            <div style={{ textAlign: "center" }}>
              <h3 className="animate-charcter">My Projects</h3>
            </div>
            <div className="cards-container" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
              {/* Project 1: Healthcare AI */}
              <div className="card glass">
                <div className="card-picture">
                  <img src="/images/healthcare_ai.jpg" alt="Healthcare System AI" className="card-img" />
                </div>
                <p className="card-title">Healthcare System (AI-Based)</p>
                <p style={{ fontSize: "0.95rem", opacity: 0.85, textAlign: "left", marginBottom: "15px", lineHeight: "1.5" }}>
                  Multimodal AI healthcare assistant with voice & image understanding. Integrates Whisper (Groq), LLaMA Vision-4, and ElevenLabs for end-to-end AI interaction with Transformers & SpeechRecognition.
                </p>
                <div className="skill-icons">
                  <a href="https://github.com/sushilyadavcsaiml23-beep" target="_blank" rel="noreferrer" className="icon" title="View Source">
                    <i className="fa-brands fa-github fa-xl"></i>
                  </a>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>LLM & RAG</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Whisper Groq</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>LLaMA Vision</span>
                </div>
              </div>

              {/* Project 2: AI E-Commerce Product Verification */}
              <div className="card glass">
                <div className="card-picture">
                  <img src="/images/ecommerce_ai.jpg" alt="AI Product Verification" className="card-img" />
                </div>
                <p className="card-title">AI Product Condition Verification</p>
                <p style={{ fontSize: "0.95rem", opacity: 0.85, textAlign: "left", marginBottom: "15px", lineHeight: "1.5" }}>
                  AI-powered product condition verification system for safer e-commerce. Leverages Computer Vision and deep learning to inspect returned goods, detect defects, and eliminate fraudulent return claims.
                </p>
                <div className="skill-icons">
                  <a href="https://github.com/sushilyadavcsaiml23-beep" target="_blank" rel="noreferrer" className="icon" title="View Source">
                    <i className="fa-brands fa-github fa-xl"></i>
                  </a>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Computer Vision</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>TensorFlow</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>E-Commerce AI</span>
                </div>
              </div>

              {/* Project 3: LeetCode Leaderboard */}
              <div className="card glass">
                <div className="card-picture">
                  <img src="/images/leetcode_board.jpg" alt="LeetCode Leaderboard" className="card-img" />
                </div>
                <p className="card-title">LeetCode Leader Board & DSA Tracker</p>
                <p style={{ fontSize: "0.95rem", opacity: 0.85, textAlign: "left", marginBottom: "15px", lineHeight: "1.5" }}>
                  Interactive tracking dashboard highlighting solved DSA problem metrics, 100+ consecutive problem-solving streak milestones, topic distributions, and global rankings.
                </p>
                <div className="skill-icons">
                  <a href="https://github.com/sushilyadavcsaiml23-beep" target="_blank" rel="noreferrer" className="icon" title="View Source">
                    <i className="fa-brands fa-github fa-xl"></i>
                  </a>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>React</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>TypeScript</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>DSA Tracker</span>
                </div>
              </div>

              {/* Project 4: WhatsApp Chat Analysis */}
              <div className="card glass">
                <div className="card-picture">
                  <img src="/images/whatsapp_analysis.jpg" alt="WhatsApp Chat Analysis" className="card-img" />
                </div>
                <p className="card-title">WhatsApp Chat Analysis</p>
                <p style={{ fontSize: "0.95rem", opacity: 0.85, textAlign: "left", marginBottom: "15px", lineHeight: "1.5" }}>
                  Analyzed 10,000+ chat messages using Python and Streamlit. Generated interactive visual insights on user activity, peak message times, sentiment, emoji usage, and messaging trends.
                </p>
                <div className="skill-icons">
                  <a href="https://github.com/sushilyadavcsaiml23-beep" target="_blank" rel="noreferrer" className="icon" title="View Source">
                    <i className="fa-brands fa-github fa-xl"></i>
                  </a>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Python</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Streamlit</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Pandas</span>
                </div>
              </div>

              {/* Project 5: Fashion Recommendation System */}
              <div className="card glass">
                <div className="card-picture">
                  <img src="/images/plant_iot.png" alt="Fashion Recommendation System" className="card-img" />
                </div>
                <p className="card-title">Fashion Recommendation System</p>
                <p style={{ fontSize: "0.95rem", opacity: 0.85, textAlign: "left", marginBottom: "15px", lineHeight: "1.5" }}>
                  Implemented a deep learning-based recommendation model using TensorFlow, Keras, and Scikit-learn. Suggests visually similar fashion products through content-based filtering algorithms.
                </p>
                <div className="skill-icons">
                  <a href="https://github.com/sushilyadavcsaiml23-beep" target="_blank" rel="noreferrer" className="icon" title="View Source">
                    <i className="fa-brands fa-github fa-xl"></i>
                  </a>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>TensorFlow</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Keras</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Deep Learning</span>
                </div>
              </div>

              {/* Project 6: House Price Prediction */}
              <div className="card glass">
                <div className="card-picture">
                  <img src="/images/house_price.png" alt="House Price Prediction" className="card-img" />
                </div>
                <p className="card-title">House Price Prediction</p>
                <p style={{ fontSize: "0.95rem", opacity: 0.85, textAlign: "left", marginBottom: "15px", lineHeight: "1.5" }}>
                  Predictive Machine Learning regression model developed during Hindalco internship. Executed data preprocessing, feature engineering, and hyperparameter tuning to optimize pricing accuracy.
                </p>
                <div className="skill-icons">
                  <a href="https://github.com/sushilyadavcsaiml23-beep" target="_blank" rel="noreferrer" className="icon" title="View Source">
                    <i className="fa-brands fa-github fa-xl"></i>
                  </a>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Python</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Scikit-Learn</span>
                  <span style={{ fontSize: "0.82rem", background: "rgba(99, 102, 241, 0.15)", padding: "4px 10px", borderRadius: "12px", border: "1px solid rgba(129, 140, 248, 0.3)" }}>Regression</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills" id="skills">
          <div className="section-content-wrapper">
            <div style={{ textAlign: "center" }}>
              <h3 className="animate-charcter">Skills</h3>
            </div>
            <div className="skills-container">
              <div className="skill-divs" title="Python">
                <img src="/images/python.svg" alt="Python" />
                <div className="progress-bar">Python</div>
              </div>
              <div className="skill-divs" title="Java">
                <img src="/content/java img.png" alt="Java" />
                <div className="progress-bar">Java</div>
              </div>
              <div className="skill-divs" title="HTML5">
                <img src="/content/html.png" alt="HTML5" />
                <div className="progress-bar">HTML5</div>
              </div>
              <div className="skill-divs" title="CSS3">
                <img src="/content/css.png" alt="CSS3" />
                <div className="progress-bar">CSS3</div>
              </div>
              <div className="skill-divs" title="JavaScript">
                <img src="/content/js.png" alt="JavaScript" />
                <div className="progress-bar">JavaScript</div>
              </div>
              <div className="skill-divs" title="TypeScript">
                <img src="/images/typescript.webp" alt="TypeScript" />
                <div className="progress-bar">TypeScript</div>
              </div>
              <div className="skill-divs" title="React">
                <img src="/content/react.png" alt="React" />
                <div className="progress-bar">React</div>
              </div>
              <div className="skill-divs" title="Node.js">
                <img src="/content/node.png" alt="Node.js" />
                <div className="progress-bar">Node.js</div>
              </div>
              <div className="skill-divs" title="TensorFlow">
                <img src="/images/tensorflow.svg" alt="TensorFlow / ML" />
                <div className="progress-bar">TensorFlow</div>
              </div>
              <div className="skill-divs" title="MongoDB / SQL">
                <img src="/content/mongodb img.png" alt="SQL / DBMS" />
                <div className="progress-bar">SQL</div>
              </div>
              <div className="skill-divs" title="Tailwind CSS">
                <img src="/content/tailwind css.png" alt="Tailwind CSS" />
                <div className="progress-bar">Tailwind</div>
              </div>
              <div className="skill-divs" title="Git">
                <img src="/content/git img.png" alt="Git" />
                <div className="progress-bar">Git / GitHub</div>
              </div>
            </div>
          </div>
        </section>

        {/* Certificates & Achievements Section */}
        <section className="certificates" id="certificates">
          <div className="section-content-wrapper">
            <div style={{ textAlign: "center" }}>
              <h3 className="animate-charcter">Achievements & Certifications</h3>
            </div>
            <div className="cards-container" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
              {/* Cert 1: IEEE Cyber Security */}
              <div className="card glass">
                <a href="/content/IEEE_AI_Cyber_Security_Certificate.pdf" target="_blank" rel="noreferrer" className="card-picture">
                  <img src="/content/IEEE_AI_Cyber_Security_Certificate.png" alt="IEEE AI Smart Cyber Space Security Certificate" className="card-img" style={{ height: "220px", objectFit: "contain", background: "white", padding: "5px" }} />
                </a>
                <p className="card-title" style={{ fontSize: "1.05rem", margin: "12px 0 5px 0" }}>
                  AI Driven Future Smart Cyber Security
                </p>
                <p style={{ fontSize: "0.88rem", opacity: 0.8, margin: "0 0 10px 0", textAlign: "left" }}>
                  IEEE MTT-S & Scholars Colab Participation Certificate
                </p>
                <a href="/content/IEEE_AI_Cyber_Security_Certificate.pdf" download="IEEE_AI_Cyber_Security_Certificate.pdf" style={{ textDecoration: "none", color: "#818cf8", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Download Certificate <i className="fa-solid fa-download"></i>
                </a>
              </div>

              {/* Cert 2: Nasscom thingQbator Flutter */}
              <div className="card glass">
                <a href="/content/Nasscom_thingQbator_Flutter_Certificate.pdf" target="_blank" rel="noreferrer" className="card-picture">
                  <img src="/content/Nasscom_thingQbator_Flutter_Certificate.png" alt="Nasscom thingQbator Flutter Certificate" className="card-img" style={{ height: "220px", objectFit: "contain", background: "white", padding: "5px" }} />
                </a>
                <p className="card-title" style={{ fontSize: "1.05rem", margin: "12px 0 5px 0" }}>
                  Flutter Certificate of Excellence
                </p>
                <p style={{ fontSize: "0.88rem", opacity: 0.8, margin: "0 0 10px 0", textAlign: "left" }}>
                  thingQbator & Nasscom Foundation (Cisco CSR Partner)
                </p>
                <a href="/content/Nasscom_thingQbator_Flutter_Certificate.pdf" download="Nasscom_thingQbator_Flutter_Certificate.pdf" style={{ textDecoration: "none", color: "#818cf8", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Download Certificate <i className="fa-solid fa-download"></i>
                </a>
              </div>

              {/* Cert 3: Hindalco Internship Certificate */}
              <div className="card glass">
                <a href="/content/Hindalco_Internship_Certificate.jpg" target="_blank" rel="noreferrer" className="card-picture">
                  <img src="/content/Hindalco_Internship_Certificate.jpg" alt="Hindalco Machine Learning Internship Certificate" className="card-img" style={{ height: "220px", objectFit: "contain", background: "white", padding: "5px" }} />
                </a>
                <p className="card-title" style={{ fontSize: "1.05rem", margin: "12px 0 5px 0" }}>
                  Hindalco ML Internship Certificate
                </p>
                <p style={{ fontSize: "0.88rem", opacity: 0.8, margin: "0 0 10px 0", textAlign: "left" }}>
                  Hindalco Industries Limited (Aditya Birla Group)
                </p>
                <a href="/content/Hindalco_Internship_Certificate.jpg" download="Hindalco_Internship_Certificate.jpg" style={{ textDecoration: "none", color: "#818cf8", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Download Certificate <i className="fa-solid fa-download"></i>
                </a>
              </div>

              {/* Cert 4: Hackathon Top 5 */}
              <div className="card glass">
                <div className="card-picture" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "220px", background: "linear-gradient(135deg, rgba(129, 140, 248, 0.15), rgba(168, 85, 247, 0.2))", padding: "20px" }}>
                  <i className="fa-solid fa-trophy fa-3xl" style={{ color: "#ffd700", marginBottom: "15px" }}></i>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "700", textAlign: "center", margin: 0 }}>Top 5 Finalist</h4>
                  <p style={{ fontSize: "0.9rem", opacity: 0.85, textAlign: "center", marginTop: "8px" }}>Machine Learning with full-stack application development</p>
                </div>
                <p className="card-title" style={{ fontSize: "1.05rem", margin: "12px 0 5px 0" }}>
                  Machine Learning with Full-Stack Application Development
                </p>
                <p style={{ fontSize: "0.88rem", opacity: 0.8, margin: "0 0 10px 0", textAlign: "left" }}>
                  Secured Top 5 position for building an innovative, end-to-end intelligent Machine Learning with full-stack application development solution.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer & Contact Section */}
      <footer id="contact" className="contact-section">
        <div id="particles-js-footer"></div>
        <div className="section-content-wrapper contact-wrapper">
          <div className="contact-header">
            <h2 className="contact-main-title">Let's Connect</h2>
            <p className="contact-subtitle">
              Have a project in mind or just want to chat? I'd love to hear from you!
            </p>
          </div>

          <div className="contact-grid">
            {/* Left Column: Get in Touch Info */}
            <div className="contact-info-col">
              <h3 className="contact-col-title">Get in Touch</h3>

              <div className="contact-items-list">
                {/* Email Item */}
                <div className="contact-info-item">
                  <div className="contact-item-icon icon-email">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <div className="contact-item-text">
                    <span className="contact-item-label">Email</span>
                    <a href="mailto:sssyadav061@gmail.com" className="contact-item-val">
                      sssyadav061@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location Item */}
                <div className="contact-info-item">
                  <div className="contact-item-icon icon-location">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="contact-item-text">
                    <span className="contact-item-label">Location</span>
                    <span className="contact-item-val">Renukoot, UP, India</span>
                  </div>
                </div>

                {/* Available for Item */}
                <div className="contact-info-item">
                  <div className="contact-item-icon icon-available">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <div className="contact-item-text">
                    <span className="contact-item-label">Available for</span>
                    <span className="contact-item-val">Internship &amp; Full-time &amp; Freelance</span>
                  </div>
                </div>
              </div>

              {/* Social Icon Buttons */}
              <div className="contact-social-row">
                <a
                  href="https://github.com/sushilyadavcsaiml23-beep"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social-btn"
                  title="GitHub"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/sushil-yadav-61bb6a369"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social-btn"
                  title="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a
                  href="mailto:sssyadav061@gmail.com"
                  className="contact-social-btn"
                  title="Email"
                >
                  <i className="fa-regular fa-envelope"></i>
                </a>
              </div>
            </div>

            {/* Right Column: Send a Message Card */}
            <div className="contact-card-col">
              <div className="contact-form-card">
                <h3 className="card-form-title">Send a Message</h3>
                <p className="card-form-subtitle">
                  I'll get back to you as soon as possible!
                </p>

                <form onSubmit={sendEmail} className="connect-form">
                  <div className="contact-form-honeypot" aria-hidden="true">
                    <label htmlFor="website">Leave this field empty</label>
                    <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </div>
                  <input type="hidden" name="botcheck" />
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      maxLength={254}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      maxLength={5000}
                      placeholder="Tell me about your project or just say hi!"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={isSending}>
                    <i className="fa-solid fa-paper-plane"></i> {isSending ? "Sending..." : "Send Message"}
                  </button>
                  {formStatus && (
                    <p className={`contact-form-status ${formStatus.type}`} role="status" aria-live="polite">
                      {formStatus.message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          <p className="contact-copyright">Copyright © 2026 Sushil Kumar Yadav</p>
        </div>
      </footer>
    </div>
  );
};

export default Content;
