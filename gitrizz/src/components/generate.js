const fs = require("fs");
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

const generateCommitData = () =>
  months.flatMap((month, monthIndex) =>
    Array.from({ length: 4 }, (_, weekIndex) => ({
      month,
      week: `Week ${weekIndex + 1}`,
      commits: Math.floor(Math.random() * 10) + 1,
    }))
  );

const usernames = [
  "devwizard",
  "codeNinja",
  "bugHunter",
  "repoMaster",
  "octoLover",
  "commitKing",
  "mergeQueen",
  "pullRequestor",
  "gitGenius",
  "branchBoss",
  "mainSquad",
  "forkedUp",
  "rebaseChampion",
  "devDynamo",
  "pushItRealGood",
  "featureFiend",
  "lintLord",
  "consoleLogger",
  "syntaxSorcerer",
  "cloudCoder",
  "AIarchitect",
  "debugDuke",
  "frontEndPhantom",
  "backendBraniac",
  "CSSConqueror",
  "JSJuggler",
  "testDriven",
  "DockerDemon",
  "APIAlchemist",
  "GraphQLGuru",
  "CodeSamurai",
  "LinuxLover",
  "ShellScripter",
  "NeovimNerd",
  "RegexRuler",
  "CyberSentinel",
  "InfraMaster",
  "TerminalTactician",
  "ScrumSavant",
  "DevOpsDruid",
  "AgileArchitect",
  "DataDigger",
  "SQLSorcerer",
  "NoSQLNomad",
  "BlockchainBard",
  "CryptoCrafter",
  "KernelKing",
  "MemoryManipulator",
  "HackerHermit",
  "ByteBard",
];

const generateProfile = (username) => ({
  imageURL: `https://robohash.org/${username}.png?size=200x200`,
  name: username.replace(/([A-Z])/g, " $1").trim(),
  username,
  bio: `Passionate coder specializing in ${
    ["frontend", "backend", "fullstack", "DevOps", "AI"][
      Math.floor(Math.random() * 5)
    ]
  } development.`,
  followers: Math.floor(Math.random() * 10000),
  following: Math.floor(Math.random() * 500),
  repositories: Array.from(
    { length: Math.floor(Math.random() * 5) + 1 },
    (_, i) => ({
      name: `Project-${i + 1}`,
      url: `https://github.com/${username}/Project-${i + 1}`,
      description: `A cool project about ${
        ["AI", "Web Dev", "Data Science", "Cybersecurity", "Automation"][
          Math.floor(Math.random() * 5)
        ]
      }.`,
    })
  ),
  commitData: generateCommitData(),
});

const sampleProfiles = usernames.map(generateProfile);

fs.writeFileSync("profiles.json", JSON.stringify(sampleProfiles, null, 2));

console.log("saved to profiles.json");
