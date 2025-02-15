import React from "react";
import { Terminal, Code2, Users, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

const AboutSection = () => {
  const features = [
    {
      icon: (
        <Terminal style={{ width: "32px", height: "32px", color: "#4ade80" }} />
      ),
      title: "Algorithm-Driven Matches",
      description:
        "Our proprietary matching algorithm analyzes GitHub activity, coding style, and preferred tech stacks to find your perfect pair programming partner.",
    },
    {
      icon: (
        <Code2 style={{ width: "32px", height: "32px", color: "#60a5fa" }} />
      ),
      title: "Repository Compatibility",
      description:
        "Connect based on mutual interests in programming languages, frameworks, and open source contributions.",
    },
    {
      icon: (
        <Users style={{ width: "32px", height: "32px", color: "#c084fc" }} />
      ),
      title: "Developer-First Community",
      description:
        "Join a community of passionate developers looking for meaningful connections through code.",
    },
    {
      icon: (
        <GitBranch
          style={{ width: "32px", height: "32px", color: "#f472b6" }}
        />
      ),
      title: "Merge Request Success Stories",
      description:
        "Countless successful relationships have started with a pull request. Your next commit could be to a shared future.",
    },
  ];

  const sectionStyle = {
    minHeight: "100vh",
    backgroundColor: "#0d1117",
    color: "white",
    padding: "80px 24px",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "64px",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "24px",
    color: "#58a6ff",
  };

  const subtitleStyle = {
    fontSize: "20px",
    color: "#8b949e",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: window.innerWidth > 768 ? "repeat(2, 1fr)" : "1fr",
    gap: "32px",
    marginTop: "48px",
  };

  const cardStyle = {
    backgroundColor: "#161b22",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #30363d",
    transition: "all 0.3s ease",
  };

  const iconContainerStyle = {
    backgroundColor: "#0d1117",
    padding: "12px",
    borderRadius: "8px",
    display: "inline-block",
    marginRight: "16px",
  };

  const cardContentStyle = {
    display: "flex",
    alignItems: "flex-start",
  };

  const cardTextStyle = {
    flex: 1,
  };

  const cardTitleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#58a6ff",
  };

  const cardDescriptionStyle = {
    color: "#8b949e",
    lineHeight: "1.5",
  };

  const statsStyle = {
    textAlign: "center",
    marginTop: "64px",
  };

  const statsBoxStyle = {
    display: "inline-block",
    backgroundColor: "#161b22",
    padding: "12px 24px",
    borderRadius: "9999px",
    border: "1px solid #30363d",
  };

  const statsTextStyle = {
    fontSize: "18px",
    color: "#8b949e",
  };

  const highlightStyle = {
    color: "#4ade80",
  };

  return (
    <section id="about" style={sectionStyle}>
      <div style={containerStyle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={headerStyle}
        >
          <h2 style={titleStyle}>About gitRizz.ai</h2>
          <p style={subtitleStyle}>
            Where meaningful connections begin with code. We're revolutionizing
            tech dating by matching developers based on their GitHub activity,
            coding preferences, and technical interests.
          </p>
        </motion.div>

        <div style={gridStyle}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              style={cardStyle}
            >
              <div style={cardContentStyle}>
                <div style={iconContainerStyle}>{feature.icon}</div>
                <div style={cardTextStyle}>
                  <h3 style={cardTitleStyle}>{feature.title}</h3>
                  <p style={cardDescriptionStyle}>{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={statsStyle}
        >
          <div style={statsBoxStyle}>
            <p style={statsTextStyle}>
              <span style={highlightStyle}>10,000+</span> developers have found
              their perfect pair programming partner
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
