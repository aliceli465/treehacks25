import React from "react";
import { FaGithub } from "react-icons/fa";
import { User, UserSearch, Paperclip } from "lucide-react";

const getColor = (commits) => {
  if (commits <= 2) return "#DFFFD6";
  if (commits <= 4) return "#B6EFA5";
  if (commits <= 6) return "#7CD673";
  if (commits <= 8) return "#49B03B";
  return "#2E7D22";
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const sampleCommitData = months.flatMap((month, monthIndex) =>
  Array.from({ length: 4 }, (_, weekIndex) => ({
    month,
    week: `Week ${weekIndex + 1}`,
    commits: Math.floor(Math.random() * 10),
  }))
);

const ProfileCard = ({
  imageURL,
  name,
  username,
  bio,
  followers,
  following,
  repositories,
  commitData = sampleCommitData,
}) => {
  return (
    <div className="profile-card">
      <div className="avatar">
        <img src={imageURL} alt="User Avatar" />
      </div>

      <h2 className="name">{name}</h2>
      <p className="username">@{username}</p>
      <p className="bio">{bio}</p>

      <div className="stats">
        <div className="stat">
          <User className="icon" />
          <p className="followers">{followers} Followers</p>
        </div>
        <div className="stat">
          <UserSearch className="icon" />
          <p className="following">{following} Following</p>
        </div>
      </div>

      <div className="repositories">
        <h3>Top Repositories</h3>
        <div className="repo-list">
          {repositories.slice(0, 4).map((repo, index) => (
            <div key={index} className="repo-card">
              <span className="tool-emoji">🛠️</span>
              <a href={repo.url} className="repo-name">
                {repo.name}
              </a>
              <p className="repo-description">{repo.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="commit-section">
        <h3>Total Contributions This Year</h3>
        <h2>{commitData.reduce((sum, data) => sum + data.commits, 0)}</h2>
        <div className="commit-grid">
          {months.map((month) => (
            <div key={month} className="commit-month">
              {commitData
                .filter((entry) => entry.month === month)
                .map((entry, index) => (
                  <div
                    key={index}
                    className="commit-box"
                    style={{ backgroundColor: getColor(entry.commits) }}
                    title={`${entry.month} - ${entry.week}: ${entry.commits} commits`}
                  ></div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
