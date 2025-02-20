import React, { useState, useEffect } from "react";
import ProfileCard from "./profile";
import { Heart, X } from "lucide-react";
import FloatingWidgets from "./widgets";
import { useNavigate } from "react-router-dom";

const styles = {
  profileIcon: {
    position: "absolute",
    top: "10px",
    right: "20px",
    cursor: "pointer",
    marginBottom: "50px",
    display: "inline-block",
    margin: "10px",
    border: "none",
    background: `url('/alice.jpg') center/cover no-repeat`,
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    transition: "transform 0.2s ease-in-out",
  },
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    height: "500px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    height: "100%",
  },
  actionButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 100,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  dislikeButton: {
    left: "-80px",
    backgroundColor: "#ff4444",
    color: "white",
    marginTop: "80px",
  },
  likeButton: {
    right: "-80px",
    backgroundColor: "#44cc44",
    color: "white",
    marginTop: "80px",
  },
  cardWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    transition: "transform 0.5s ease, opacity 0.5s ease",
    backfaceVisibility: "hidden",
  },
};

const funnyCommitMessages = [
  "oh hell na",
  "what am i doing",
  "plz work",
  "commit out of pure desperation",
  "i have no idea why this works",
  "fixed one bug, added five more",
  "this commit is cursed",
  "yolo push",
  "let’s pretend this never happened",
  "refactored… again",
  "probably breaks everything",
  "added TODOs, feel productive now",
  "debugging nightmare begins",
  "hotfix for hotfix",
  "deleting code is scary",
  "might work on Their machine",
  "temporary fix (forever)",
  "not proud of this one",
  "pray before merging",
  "senior devs will judge me for this",
];

const funnyRoasts = [
  "Their repo is basically an abandoned graveyard of half-baked ideas.",
  "Their commit history looks like a cry for help.",
  "I've seen cleaner diffs in spaghetti code competitions.",
  "Their GitHub is 90% forks and 10% regret.",
  "Their contribution graph is an accurate representation of procrastination.",
  "They write more TODOs than actual code.",
  "Their most starred repo is an empty README.md. Impressive.",
  "Their bio says ‘Software Engineer,’ but Their code says ‘Under Construction.’",
  "They treat version control like a diary, and it shows.",
  "Their code quality is directly proportional to the number of ‘pls work’ commits.",
  "Their debugging strategy is just pushing to main and praying.",
  "They have more WIP branches than finished projects.",
  "Their repo names are as chaotic as Their life choices.",
  "Their commit messages tell a tragic story of struggle and despair.",
  "Their most used Git command is `git reset --hard`.",
  "Their README is just a single ‘¯\\_(ツ)_/¯’.",
  "Half Their repos are abandoned after the first commit.",
  "Their PR reviews are just people asking ‘why?.’",
  "Their GitHub activity drops to zero when the semester ends.",
  "Their entire repo is just debugging prints and dreams.",
];

const generateWidgetData = () => ({
  commitMessages: Array.from(
    { length: 3 },
    () =>
      funnyCommitMessages[
        Math.floor(Math.random() * funnyCommitMessages.length)
      ]
  ),
  linkedIn: "https://linkedin.com/in/example-user",
  contributions: Math.floor(Math.random() * 500),
  similarity: Math.random().toFixed(2),
  summary: funnyRoasts[Math.floor(Math.random() * funnyRoasts.length)],
});

const SwipeableProfileCards = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState(null);
  const [widgetVisible, setWidgetVisible] = useState(true);
  const [widgetData, setWidgetData] = useState(generateWidgetData());

  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  useEffect(() => {
    fetch("/profiles.json")
      .then((response) => response.json())
      .then((data) => setProfiles(data))
      .catch((error) => console.error("Error loading profiles:", error));
  }, []);

  const handleSwipe = (direction) => {
    if (currentIndex >= profiles.length) return;

    setWidgetVisible(false); // Hide widgets
    setAnimation(direction === "right" ? "slide-right" : "slide-left");

    if (direction === "right") createHearts();

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setAnimation(null);
      setWidgetData(generateWidgetData());

      setTimeout(() => setWidgetVisible(true), 500); // Slowly reappear widgets
    }, 500);
  };

  const createHearts = () => {
    Array.from({ length: 15 }).forEach(() => {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 15 + 15;
      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;
      heart.style.animationDelay = `${Math.random() * 0.5}s`;
      heart.style.animationDuration = `${Math.random() * 1 + 1}s`;

      document.getElementById("hearts-container").appendChild(heart);
      setTimeout(() => heart.remove(), 2000);
    });
  };

  const getCardStyle = (index) => {
    const baseStyle = { ...styles.cardWrapper };

    if (index < currentIndex) return null;
    if (index > currentIndex + 2) return null;

    if (index === currentIndex) {
      if (animation === "slide-left") {
        return {
          ...baseStyle,
          transform: "translateX(-120%) rotate(-20deg)",
          opacity: 0,
        };
      }
      if (animation === "slide-right") {
        return {
          ...baseStyle,
          transform: "translateX(120%) rotate(20deg)",
          opacity: 0,
        };
      }
      return {
        ...baseStyle,
        transform: "translateX(0) rotate(0)",
        opacity: 1,
        zIndex: 3,
      };
    }

    if (index === currentIndex + 1) {
      return {
        ...baseStyle,
        transform: "translateX(0) scale(0.95)",
        opacity: 0,
        zIndex: 2,
      };
    }

    return {
      ...baseStyle,
      transform: "translateX(0) scale(0.9)",
      opacity: 0,
      zIndex: 1,
    };
  };

  return (
    <>
      <button style={styles.profileIcon} onClick={handleProfileClick}></button>
      <div style={styles.container} className="animated-bg">
        <button
          onClick={() => handleSwipe("left")}
          style={{ ...styles.actionButton, ...styles.dislikeButton }}
        >
          <X size={32} />
        </button>

        <div style={styles.cardContainer}>
          <div
            id="hearts-container"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              overflow: "hidden",
              zIndex: 1000,
            }}
          />

          {profiles.map((profile, index) => {
            const cardStyle = getCardStyle(index);
            if (!cardStyle) return null;

            return (
              <>
                {index === currentIndex && (
                  <FloatingWidgets {...widgetData} visible={widgetVisible} />
                )}
                <div key={index} style={cardStyle}>
                  <ProfileCard {...profile} />
                </div>
              </>
            );
          })}
        </div>

        <button
          onClick={() => handleSwipe("right")}
          style={{ ...styles.actionButton, ...styles.likeButton }}
        >
          <Heart size={32} />
        </button>

        <style>
          {`
            .floating-heart {
              position: absolute;
              background: #ff4444;
              clip-path: path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
              animation: float-heart ease-out forwards;
            }
  
            @keyframes float-heart {
              0% { transform: scale(0) rotate(0deg); opacity: 0; }
              15% { transform: scale(1.2) rotate(-20deg); opacity: 0.9; }
              30% { transform: scale(1) rotate(10deg); opacity: 0.8; }
              100% { transform: scale(0.8) rotate(30deg) translate(100px, -100px); opacity: 0; }
            }
  
            button:hover {
              transform: translateY(-50%) scale(1.1);
              filter: brightness(1.1);
            }
          `}
        </style>
      </div>
    </>
  );
};

export default SwipeableProfileCards;
