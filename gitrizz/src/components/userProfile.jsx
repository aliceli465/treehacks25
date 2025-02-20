import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Shield, GitBranch, Users, Code, Heart, Sparkles } from "lucide-react";
import { Tooltip } from "react-tooltip";

const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const [profileData, setProfileData] = useState({
    scores: {
      commitmentStyle: 0,
      projectType: 0,
      collaborationStyle: 0,
      techStack: 0,
      codingStructure: 0,
      profileEffort: 0,
    },
    analysis: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        console.log("Loading GitHub data...");
        const loadResponse = await fetch(
          "http://127.0.0.1:5000/load_github_data",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usernames: ["aliceli465"] }),
          }
        );

        if (!loadResponse.ok) throw new Error("Failed to load GitHub data.");

        console.log("Fetching GitHub profile data...");
        const profileResponse = await fetch(
          "http://127.0.0.1:5000/get_github_data"
        );
        const profileJson = await profileResponse.json();
        console.log("GitHub Profile Data:", profileJson);

        console.log("Fetching GitHub vectors...");
        const vectorsResponse = await fetch(
          "http://127.0.0.1:5000/get_vectors"
        );
        const vectorsJson = await vectorsResponse.json();
        console.log("GitHub Vectors:", vectorsJson);

        console.log("Fetching GitHub roasts...");
        const roastResponse = await fetch(
          "http://127.0.0.1:5000/get_github_roasts"
        );
        const roastJson = await roastResponse.json();
        console.log("GitHub Roasts:", roastJson);

        // Update state with fetched data
        setProfileData({
          scores: {
            commitmentStyle: vectorsJson.commitmentStyle || 0,
            projectType: vectorsJson.projectType || 0,
            collaborationStyle: vectorsJson.collaborationStyle || 0,
            techStack: vectorsJson.techStack || 0,
            codingStructure: vectorsJson.codingStructure || 0,
            profileEffort: vectorsJson.profileEffort || 0,
          },
          analysis: roastJson.analysis || "No roast available.",
        });
      } catch (error) {
        console.error("Error during API calls:", error);
      }
    };
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
      fetchGitHubData();
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
      // Simulate random scores for now
      setProfileData({
        scores: {
          commitmentStyle: Math.floor(Math.random() * 100),
          projectType: Math.floor(Math.random() * 100),
          collaborationStyle: Math.floor(Math.random() * 100),
          techStack: Math.floor(Math.random() * 100),
          codingStructure: Math.floor(Math.random() * 100),
          profileEffort: Math.floor(Math.random() * 100),
        },
        analysis:
          "Your GitHub profile is basically the coding equivalent of a LinkedIn bio that just says “Software Engineer.” You commit just enough to not look inactive, but not enough to be impressive. Half your repos look like you started them on a caffeine high and then forgot they existed. And your commit messages? Bro, where’s the personality? “Fix typo” and “update index” aren’t exactly screaming innovation. At least throw in a “refactored this mess” or “finally figured this out after 3 hours.",
      });
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleGoBack = () => {
    navigate("/profiles");
  };

  const ScoreBar = ({ score, label, icon: Icon }) => (
    <div className="score-bar">
      <div className="score-header">
        <Icon />
        <span>{label}</span>
        <span className="score-value">{score}%</span>
      </div>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Your Profile</h1>
          <div className="header-buttons">
            <button onClick={handleGoBack} className="btn-secondary">
              Back to Swiping
            </button>
            <button onClick={handleLogOut} className="btn-secondary">
              Log Out
            </button>
          </div>
        </div>

        <div className="profile-content">
          <img src="/alice.jpg" alt="Profile" className="profile-image" />
          <div className="profile-main">
            <div className="profile-info">
              <h2>{userName}</h2>
              <div className="profile-analysis">
                <p>{profileData.analysis}</p>
              </div>
            </div>
          </div>

          <div className="scores-section">
            <h3>About you</h3>
            <div className="scores-grid">
              <div id="commitmentStyle">
                <ScoreBar
                  score={profileData.scores.commitmentStyle}
                  label="Commitment Style"
                  icon={Heart}
                />
              </div>

              <div id="projectType">
                <ScoreBar
                  score={profileData.scores.projectType}
                  label="Project Type"
                  icon={GitBranch}
                />
              </div>

              <div id="collaborationStyle">
                <ScoreBar
                  score={profileData.scores.collaborationStyle}
                  label="Collaboration Style"
                  icon={Users}
                  id="collaborationStyle"
                />
              </div>

              <div id="techStack">
                <ScoreBar
                  score={profileData.scores.techStack}
                  label="Tech Stack"
                  icon={Code}
                  id="techStack"
                />
              </div>

              <div id="codingStructure">
                <ScoreBar
                  score={profileData.scores.codingStructure}
                  label="Coding Structure"
                  icon={Shield}
                  id="codingStructure"
                />
              </div>

              <div id="profileEffort">
                <ScoreBar
                  score={profileData.scores.profileEffort}
                  label="Profile Effort"
                  icon={Sparkles}
                  id="profileEffort"
                />
              </div>

              <Tooltip
                anchorSelect="#commitmentStyle"
                place="top"
                className="tooltipp"
              >
                COMMIT MESSAGES = COMMITMENT MEASURE, SURELY
              </Tooltip>
              <Tooltip
                anchorSelect="#projectType"
                place="top"
                className="tooltipp"
              >
                You gotta do more than just calculator apps and to-do-lists ...
              </Tooltip>
              <Tooltip
                anchorSelect="#collaborationStyle"
                place="top"
                className="tooltipp"
              >
                Contributing is one thing, but how is the quality?
              </Tooltip>
              <Tooltip
                anchorSelect="#techStack"
                place="top"
                className="tooltipp"
              >
                Your language diversity!
              </Tooltip>
              <Tooltip
                anchorSelect="#codingStructure"
                place="top"
                className="tooltipp"
              >
                Scoured your public repos for this - if you publish it, it
                better be good
              </Tooltip>
              <Tooltip
                anchorSelect="#profileEffort"
                place="top"
                className="tooltipp"
              >
                An overall summation of your numerical achievements + textual
                rizz
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .profile-container {
            min-height: 100vh;
            padding: 2rem;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;          
          }

          button {
            font-family: 'JetBrains Mono', 'Fira Code', monospace;  
          }

          .profile-card {
            width: 100%;
            max-width: 900px;
            background: #0d1117;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            border: 1px solid #30363d;
          }

          .profile-header {
            background: #161b22;
            padding: 1.5rem;
            border-bottom: 1px solid #30363d;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .profile-header h1 {
            color: #e6edf3;
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .header-buttons {
            display: flex;
            gap: 1rem;
          }

          .btn-secondary {
            background: #21262d;
            color: #c9d1d9;
            border: 1px solid #30363d;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }

          .btn-secondary:hover {
            background: #30363d;
            border-color: #8b949e;
          }

          .profile-content {
            padding: 2rem;
          }

          .profile-main {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .profile-image {
            width: 200px;
            height: 200px;
            border-radius: 8px;
            border: 2px solid #30363d;
            object-fit: cover;
            margin-bottom: 20px;
          }

          .profile-info {
            flex: 1;
          }

          .profile-info h2 {
            color: #e6edf3;
            margin: 0 0 1rem 0;
            font-size: 1.75rem;
          }

          .profile-analysis {
            background: #161b22;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #30363d;
          }

          .profile-analysis p {
            color: #c9d1d9;
            margin: 0;
            line-height: 1.5;
          }

          .scores-section {
            margin-top: 2rem;
          }

          .scores-section h3 {
            color: #e6edf3;
            margin: 0 0 1.5rem 0;
            font-size: 1.25rem;
          }

          .scores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .score-bar {
            background: #161b22;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #30363d;
          }

          .score-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            color: #c9d1d9;
          }

          .score-header svg {
            width: 18px;
            height: 18px;
            color: #8b949e;
          }

          .score-value {
            margin-left: auto;
            font-weight: 600;
            color: #58a6ff;
          }

          .score-track {
            height: 6px;
            background: #21262d;
            border-radius: 3px;
            overflow: hidden;
          }

          .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #2ea043, #58a6ff);
            border-radius: 3px;
            transition: width 0.3s ease;
          }

          @media (max-width: 768px) {
            .profile-container {
              padding: 1rem;
            }

            .profile-main {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }

            .header-buttons {
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
};

export default UserProfile;
