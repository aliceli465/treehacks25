import React from "react";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const handleGitHubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("GitHub Login Successful:", user);
      // Redirect or update UI as needed
    } catch (error) {
      console.error("GitHub Login Failed:", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome to gitRizz.ai</h2>
      <button style={styles.button} onClick={handleGitHubLogin}>
        Login with GitHub
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#0d1117", // GitHub dark theme
    color: "#fff",
  },
  title: {
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#1f6feb",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Login;
