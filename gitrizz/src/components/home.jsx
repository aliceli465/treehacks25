import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GitPullRequest,
  Code2,
  UserRoundPen,
  Github,
  Terminal,
  Code,
  Cpu,
} from "lucide-react";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

const Homepage = ({ setSwipe }) => {
  const auth = getAuth();
  const provider = new GithubAuthProvider();
  const [showContent, setShowContent] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setSwipe(true);
    } catch (error) {
      console.error("GitHub login failed:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => setShowContent(true), 3000);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d1117",
        color: "white",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showContent && (
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 20 }}
          style={{
            display: "flex",
            gap: "70px",
            marginTop: "30px",
            fontSize: "18px",
            fontWeight: "bold",
            fontFamily: "'Roboto Mono', monospace",
            background: "#161b22",
            padding: "12px 24px",
            borderRadius: "9999px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            letterSpacing: "1px",
            border: "1px solid #30363d", // GitHub border color
          }}
        >
          <a
            href="#mission"
            style={{
              color: "#58a6ff",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.color = "#1f6feb")}
            onMouseOut={(e) => (e.target.style.color = "#58a6ff")}
          >
            Our mission
          </a>
          <a
            href="#tech"
            style={{
              color: "#58a6ff",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.color = "#1f6feb")}
            onMouseOut={(e) => (e.target.style.color = "#58a6ff")}
          >
            Tech Stack
          </a>
          <a
            href="#contact"
            style={{
              color: "#58a6ff",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.color = "#1f6feb")}
            onMouseOut={(e) => (e.target.style.color = "#58a6ff")}
          >
            Contact
          </a>
        </motion.nav>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "40px",
          padding: "24px 48px",
          borderRadius: "16px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <GitPullRequest
          style={{ width: "100px", height: "100px", color: "#58a6ff" }}
        />
        <h1
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #58a6ff, #1f6feb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          gitRizz.ai
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          fontSize: "24px",
          marginTop: "20px",
          color: "#8b949e",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        the premier dating app for CS majors
      </motion.p>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: "100vh" }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: "-10%",
              fontSize: "24px",
              filter: "drop-shadow(0 0 10px rgba(88, 166, 255, 0.5))",
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Why gitRizz */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            marginTop: "60px",
            textAlign: "center",
            background: "#161b22",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #30363d",
            maxWidth: "600px",
            width: "90%",
            fontFamily: "'Roboto Mono', monospace",
          }}
        >
          <motion.h2
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              color: "#58a6ff",
              fontSize: "28px",
              marginBottom: "24px",
              fontWeight: "bold",
            }}
          >
            Why gitRizz?
          </motion.h2>
          <div
            style={{ color: "#8b949e", fontSize: "18px", lineHeight: "1.6" }}
          >
            <p style={{ marginBottom: "16px" }}>
              💻 <strong>Zero effort — your GitHub is your profile.</strong>
              <br />
              <span style={{ fontSize: "14px", color: "#8b949e" }}>
                No awkward bios, no forced prompts. Your commits speak for
                themselves.
              </span>
            </p>
            <p style={{ marginBottom: "16px" }}>
              🔢 <strong>Vector search finds your best numerical match.</strong>
              <br />
              <span style={{ fontSize: "14px", color: "#8b949e" }}>
                Because love is just another optimization problem.
              </span>
            </p>
            <p style={{ marginBottom: "16px" }}>
              🧠 <strong>We'll analyze your README and commit messages.</strong>
              <br />
              <span style={{ fontSize: "14px", color: "#8b949e" }}>
                We also use contextual search to determine your best personality
                fit
              </span>
            </p>

            <p>
              🤓 <strong>You’re surrounded by your own kind.</strong>
              <br />
              <span style={{ fontSize: "14px", color: "#8b949e" }}>
                Finally, a dating app where you can scroll r/csmajors together
              </span>
            </p>
          </div>

          {/* Enter Now Button */}
          <motion.a
            onClick={handleLogin}
            whileHover={{ scale: 1.1, backgroundColor: "#238636" }} // Hover effect
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              display: "inline-block",
              marginTop: "24px",
              padding: "12px 24px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#fff",
              background: "#2ea043",
              borderRadius: "8px",
              textDecoration: "none",
              fontFamily: "'Roboto Mono', monospace",
              border: "2px solid #2ea043",
              cursor: "pointer",
            }}
          >
            Login with Github 🚀
          </motion.a>
        </motion.div>
      )}

      {/* mission */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          whileHover={{ boxShadow: "0px 0px 20px rgba(88, 166, 255, 0.4)" }}
          style={{
            marginTop: "60px",
            textAlign: "center",
            background: "#161b22",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #30363d",
            maxWidth: "800px",
            width: "90%",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              gap: "12px",
            }}
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Github
                style={{ width: "32px", height: "32px", color: "#58a6ff" }}
              />
            </motion.div>
            <h2
              id="mission"
              style={{
                color: "#58a6ff",
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Our mission
            </h2>
          </motion.div>

          <div style={{ color: "#8b949e", lineHeight: "1.8" }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "20px",
                marginBottom: "24px",
                fontStyle: "italic",
                color: "#58a6ff",
              }}
            >
              We know your commit history is more impressive than your dating
              history.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                background: "#0d1117",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #30363d",
                marginBottom: "20px",
              }}
            >
              <p style={{ marginBottom: "24px" }}>
                Let's face it - we're living in a world where CS majors can
                explain binary trees better than their feelings. Where the only
                DMs we're sliding into are pull request discussions, and our
                most meaningful relationships are with our Discord bots.
              </p>

              <p style={{ marginBottom: "24px" }}>
                LinkedIn? More like glorified leetcode brag board. Reddit? Don't
                even get me started on r/csmajors.
              </p>

              <p>That's why we built gitRizz.ai.</p>

              <p>
                Let's turn your
                <motion.span
                  style={{ color: "#4ade80", fontWeight: "bold" }}
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  {" "}
                  git commit -m "forever alone"{" "}
                </motion.span>
                into
                <motion.span
                  style={{ color: "#f472b6", fontWeight: "bold" }}
                  animate={{
                    opacity: [1, 0.5, 1],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  {" "}
                  git commit -m "found the one"{" "}
                </motion.span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/*tech stak */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          whileHover={{ boxShadow: "0px 0px 20px rgba(88, 166, 255, 0.4)" }}
          style={{
            marginTop: "60px",
            textAlign: "center",
            background: "#161b22",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #30363d",
            maxWidth: "800px",
            width: "90%",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              gap: "12px",
            }}
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Cpu
                style={{ width: "32px", height: "32px", color: "#58a6ff" }}
              />
            </motion.div>
            <h2
              id="tech"
              style={{
                color: "#58a6ff",
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Tech Stack
            </h2>
          </motion.div>

          <div style={{ color: "#8b949e", lineHeight: "1.8" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                background: "#0d1117",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #30363d",
                marginBottom: "20px",
                textAlign: "center",
                color: "#8b949e",
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "12px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {[
                  { name: "React", emoji: "⚛️", color: "#61dafb" },
                  { name: "Flask", emoji: "🔥", color: "#d18c48" },
                  { name: "Python", emoji: "🐍", color: "#facc15" },
                  { name: "Elasticsearch", emoji: "🔎", color: "#4db6ac" },
                  { name: "Kibana", emoji: "📊", color: "#ff4081" },
                  { name: "OpenAI", emoji: "🤖", color: "#34b7f1" },
                  { name: "Lucide React", emoji: "🖼️", color: "#6e5dff" },
                  { name: "Node.js", emoji: "🔧", color: "#68a063" },
                  { name: "GitHub", emoji: "🐙", color: "white" },
                  { name: "BeautifulSoup", emoji: "🍲", color: "#9b8e72" },
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    style={{
                      background: "#161b22",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #30363d",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      color: tech.color,
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ fontSize: "24px", marginBottom: "4px" }}>
                      {tech.emoji}
                    </span>
                    <span style={{ fontSize: "16px" }}>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/*contact */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          whileHover={{ boxShadow: "0px 0px 20px rgba(88, 166, 255, 0.4)" }}
          style={{
            marginTop: "60px",
            textAlign: "center",
            background: "#161b22",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #30363d",
            maxWidth: "800px",
            width: "90%",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              gap: "12px",
            }}
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <UserRoundPen
                style={{ width: "32px", height: "32px", color: "#58a6ff" }}
              />
            </motion.div>
            <h2
              id="contact"
              style={{
                color: "#58a6ff",
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Contact
            </h2>
          </motion.div>

          <div style={{ color: "#8b949e", lineHeight: "1.8" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                background: "#0d1117",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #30363d",
                marginBottom: "20px",
              }}
            >
              <p>Please don't</p>
            </motion.div>
          </div>
        </motion.div>
      )}

      <footer
        style={{
          width: "100%",
          textAlign: "center",
          padding: "16px",
          marginTop: "40px",
          background: "#161b22",
          color: "#8b949e",
          fontSize: "14px",
          borderTop: "1px solid #30363d",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        Made for Treehacks 2025
      </footer>
    </div>
  );
};

export default Homepage;
