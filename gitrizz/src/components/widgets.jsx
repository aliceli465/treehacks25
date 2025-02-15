import React, { useEffect, useState } from "react";
import { LinkedinIcon, Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
const FloatingWidgets = ({
  commitMessages,
  linkedIn,
  contributions,
  similarity,
  summary,
}) => {
  const [visible, setVisible] = useState(false);
  const [showSimilarityInfo, setShowSimilarityInfo] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <div class="floating-widgets visible">
      <div className="widget top-left">
        🔍 Notable commits:
        {commitMessages.map((msg, i) => (
          <div key={i} className="commit-message">
            → {msg}
          </div>
        ))}
      </div>

      <div className="widget top-right">
        <div className="ai-summary">{summary}</div>
      </div>

      <div className="widget bottom-left my-anchor-element">
        <div className="similarity-score">
          💡 Similarity Score: {similarity}%
          <Info size={16} className="info-icon" />
        </div>
        <Tooltip
          anchorSelect=".my-anchor-element"
          place="top"
          className="tooltipp"
        >
          Scored based on vector scores of commitment, project style,
          collaboration style, tech stack, coding structure, profile effort
        </Tooltip>
      </div>

      <div className="widget bottom-right">
        <a
          href={linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-link"
        >
          <LinkedinIcon size={20} />
          View Profile
        </a>
      </div>
    </div>
  );
};

export default FloatingWidgets;
