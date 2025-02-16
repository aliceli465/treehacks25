from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from main import (
    collect_github_data, 
    compute_similarity, 
    collect_github_data_only_vector, 
    collect_github_roasts_only
)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# === 🔥 Store GitHub Data Globally to Minimize OpenAI API Calls ===
stored_github_data = {}

@app.route('/')
def home():
    return jsonify({"message": "GitHub Dating API is running!"})

# === 1. Route to Collect GitHub Data (Run Only Once) ===
@app.route('/load-github-data', methods=['POST'])
def load_github_data():
    """
    Takes a list of GitHub usernames, collects their GitHub profile data ONCE, 
    and stores it in memory to avoid redundant OpenAI API calls.

    Expected JSON:
    {
        "usernames": ["username1", "username2", ...]
    }
    """
    global stored_github_data
    try:
        data = request.json
        usernames = data.get('usernames', [])

        if not usernames:
            return jsonify({"error": "No usernames provided"}), 400

        # Store the data once
        stored_github_data = collect_github_data(usernames)

        return jsonify({"message": "GitHub data loaded successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === 2. Route to Get Stored GitHub Data ===
@app.route('/github-data', methods=['GET'])
def get_github_data():
    """
    Returns the stored GitHub data (previously collected).
    """
    if not stored_github_data:
        return jsonify({"error": "No data available. Load data first using /load-github-data"}), 400

    return jsonify(stored_github_data)

# === 3. Route to Get Only Vectors ===
@app.route('/github-vectors', methods=['GET'])
def get_github_vectors():
    """
    Extracts only the GitHub score vectors (6 floats per user) from stored data.
    """
    if not stored_github_data:
        return jsonify({"error": "No data available. Load data first using /load-github-data"}), 400

    vector_output = collect_github_data_only_vector(stored_github_data)
    return jsonify(vector_output)

# === 4. Route to Compute Cosine Similarity ===
@app.route('/github-similarity', methods=['POST'])
def get_github_similarity():
    """
    Computes cosine similarity between a target user and all other users.

    Expected JSON:
    {
        "target_user": "username1"
    }
    """
    if not stored_github_data:
        return jsonify({"error": "No data available. Load data first using /load-github-data"}), 400

    try:
        data = request.json
        target_user = data.get('target_user', '')

        if not target_user:
            return jsonify({"error": "No target user provided"}), 400

        vector_output = collect_github_data_only_vector(stored_github_data)

        if target_user not in vector_output:
            return jsonify({"error": f"Target user {target_user} not found in data"}), 400

        similarity_results = compute_similarity(vector_output, target_user)
        return jsonify(similarity_results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === 5. Route to Fetch Profile Picture Roasts ===
@app.route('/github-roasts', methods=['GET'])
def get_github_roasts():
    """
    Extracts witty profile picture roasts for stored users.
    """
    if not stored_github_data:
        return jsonify({"error": "No data available. Load data first using /load-github-data"}), 400

    roasts_output = collect_github_roasts_only(stored_github_data)
    return jsonify(roasts_output)

# === 6. Route to Reset Stored Data ===
@app.route('/reset-data', methods=['POST'])
def reset_data():
    """
    Clears the stored GitHub data so new data can be fetched.
    """
    global stored_github_data
    stored_github_data = {}
    return jsonify({"message": "Stored GitHub data has been reset."})

if __name__ == "__main__":
    app.run(debug=True)
