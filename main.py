import os
import requests
import datetime
import numpy as np
from dotenv import load_dotenv
import openai
import base64
import re
from scipy.spatial.distance import cosine  # Import for cosine similarity

# Load environment variables from .env file
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# GitHub API request headers
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

# === 1. Fetch User Profile Data ===
def get_user_profile(username):
    url = f"https://api.github.com/users/{username}"
    return requests.get(url, headers=HEADERS).json()

# === 2. Fetch User Repositories ===
def get_repos(username):
    url = f"https://api.github.com/users/{username}/repos?per_page=100"
    repos = requests.get(url, headers=HEADERS).json()
    
    repo_details = []
    for repo in repos:
        repo_info = {
            "name": repo["name"],
            "url": repo["html_url"],
            "description": repo.get("description", ""),
            "fork": repo["fork"],
            "stars": repo["stargazers_count"],
            "watchers": repo["watchers_count"],
            "created_at": repo["created_at"],
            "updated_at": repo["updated_at"],
            "pushed_at": repo["pushed_at"],
            "languages_url": repo["languages_url"],
            "has_readme": check_readme_presence(username, repo["name"]),
            "readme_length": get_readme_length(username, repo["name"])
        }
        
        # Fetch languages used in the repo
        repo_info["languages"] = requests.get(repo["languages_url"], headers=HEADERS).json()
        
        repo_details.append(repo_info)
    
    return repo_details

# === 3. Fetch Commit History & Quality ===
def get_commit_history(username, repos):
    commit_history = {}
    commit_message_quality = []

    for repo in repos:
        if repo["fork"]:
            continue  # Ignore forks

        repo_name = repo["name"]
        url = f"https://api.github.com/repos/{username}/{repo_name}/commits?per_page=100"
        commits = requests.get(url, headers=HEADERS).json()

        commit_dates = []
        messages = []
        for commit in commits:
            if "commit" in commit:
                commit_dates.append(commit["commit"]["author"]["date"])
                messages.append(commit["commit"]["message"])

        commit_history[repo_name] = commit_dates
        commit_message_quality.extend(messages)

    return commit_history

# === 4. Fetch Collaboration Data (PRs, Issues, Discussions, Code Reviews) ===
def get_collaboration_data(username):
    prs_url = f"https://api.github.com/search/issues?q=author:{username}+type:pr"
    issues_url = f"https://api.github.com/search/issues?q=author:{username}+type:issue"
    commented_prs_url = f"https://api.github.com/search/issues?q=commenter:{username}+type:pr"
    reviewed_prs_url = f"https://api.github.com/search/issues?q=reviewed-by:{username}+type:pr"

    prs_count = requests.get(prs_url, headers=HEADERS).json().get("total_count", 0)
    issues_count = requests.get(issues_url, headers=HEADERS).json().get("total_count", 0)
    commented_prs_count = requests.get(commented_prs_url, headers=HEADERS).json().get("total_count", 0)
    reviewed_prs_count = requests.get(reviewed_prs_url, headers=HEADERS).json().get("total_count", 0)

    return {
        "pull_requests": prs_count,
        "issues": issues_count,
        "commented_prs": commented_prs_count,
        "reviewed_prs": reviewed_prs_count
    }

def download_profile_picture(username, save_dir="profile_pictures"):
    """
    Downloads the GitHub profile picture of a user and saves it to the given directory.
    
    Args:
        username (str): GitHub username.
        save_dir (str): Directory to save the profile picture.

    Returns:
        str: Path to the saved image.
    """
    os.makedirs(save_dir, exist_ok=True)  # Ensure the directory exists

    save_path = os.path.join(save_dir, f"{username}.jpg")
    url = f"https://api.github.com/users/{username}"
    
    response = requests.get(url, headers=HEADERS).json()
    if "avatar_url" in response:
        avatar_url = response["avatar_url"]
        img_data = requests.get(avatar_url).content
        
        with open(save_path, "wb") as file:
            file.write(img_data)

        return save_path  # Return the saved image path

    return None  # Return None if download fails


# === 5. Profile Picture Analysis ===
def interpret_profile_picture(username, save_dir="profile_pictures"):
    image_path = os.path.join(save_dir, f"{username}.jpg")

    if not os.path.exists(image_path):
        return "Profile picture not found."

    prompt = (
        "Given this Github profile picture, interpret what it is in 3 detailed sentences, "
        "as if to someone who is visually impaired but can see. At the end, include a line break, and then a zingy, witty, specific software engineering roast of the profile picture. Make it Gen-Z core. No emojis, though, just a single sentence."
    )

    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    with open(image_path, "rb") as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode("utf-8")  

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an assistant that describes images."},
            {"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
            ]}
        ]
    )

    return response.choices[0].message.content

# === 6. GitHub Profile Scoring ===
def score_github_profile(user_data):
    prompt = (
        "We are developing a dating app that matches users based on their GitHub profile data. "
        "Your task is to analyze and score a given GitHub profile based on the following metrics, "
        "assigning a score between 0.00 to 1.00 for each category.\n\n"

        "### **Scoring Criteria:**\n\n"

        "1️ **Commitment Style (0.00 - 1.00)**\n"
        "   - Does the user commit consistently over time, or do they commit in sporadic bursts?\n"
        "   - **Data to Consider:**\n"
        "     - Contribution graph (consistency vs. gaps in activity)\n"
        "     - Commit frequency over months\n"
        "     - Standard deviation of commit activity\n"
        "   - **Scoring:**\n"
        "     - 0.00 → Large bursts with long inactive periods\n"
        "     - 1.00 → Regular, steady commits over time\n\n"

        "2️ **Project Type (0.00 - 1.00)**\n"
        "   - Does the user mostly start their own projects, or do they contribute to others?\n"
        "   - **Data to Consider:**\n"
        "     - Ratio of own repositories vs. forked repositories\n"
        "     - Number of reviewed PRs, commented PRs, and issues opened on external repositories\n"
        "   - **Scoring:**\n"
        "     - 0.00 → Almost entirely their own projects\n"
        "     - 1.00 → Primarily contributes to existing projects\n\n"

        "3️ **Collaboration Style (0.00 - 1.00)**\n"
        "   - Does the user prefer working alone or collaborating with teams?\n"
        "   - **Data to Consider:**\n"
        "     - Number of pull requests submitted, reviewed, and commented on\n"
        "     - Issues opened and discussions participated in\n"
        "     - Commit message quality (descriptive messages = more team-oriented)\n"
        "     - Organization membership (part of an open-source group?)\n"
        "   - **Scoring:**\n"
        "     - 0.00 → Primarily solo work, little team engagement\n"
        "     - 1.00 → High PR engagement, issues, and discussions\n\n"

        "4️ **Tech Stack (0.00 - 1.00)**\n"
        "   - How diverse is the user’s tech stack?\n"
        "   - **Data to Consider:**\n"
        "     - Number of unique programming languages used across repositories\n"
        "   - **Scoring:**\n"
        "     - 0.00 → Focuses on only one or two languages\n"
        "     - 1.00 → Uses a wide variety of technologies\n\n"

        "5️ **Coding Structure (0.00 - 1.00)**\n"
        "   - Are their repositories well-documented and organized, or more freeform and experimental?\n"
        "   - **Data to Consider:**\n"
        "     - Presence and length of README files\n"
        "     - Consistency in repo structure (e.g., standardized folder layouts, docs, tests)\n"
        "     - Commit message quality (structured vs. random)\n"
        "   - **Scoring:**\n"
        "     - 0.00 → Poor or missing documentation, chaotic repo structure\n"
        "     - 1.00 → Clean, well-documented, and professional repo structure\n\n"

        "6️ **Profile Effort (0.00 - 1.00)**\n"
        "   - Has the user put thought and effort into making their GitHub profile visually appealing?\n"
        "   - **Data to Consider:**\n"
        "     - Profile picture & bio (customized vs. default)\n"
        "     - Profile README (exists, and does it showcase skills?)\n"
        "     - Use of badges, styling, or personal branding\n"
        "   - **Scoring:**\n"
        "     - 0.00 → No profile picture, empty bio, no profile README\n"
        "     - 1.00 → Well-thought-out aesthetics, branding, and customization\n\n"

        "### **Additional Notes:**\n"
        "1. Use all available GitHub API data (repos, commits, PRs, README content, etc.) to accurately assess each score.\n"
        "2. Prioritize collaboration indicators (e.g., PR reviews, discussions, forked repos) when evaluating teamwork and open-source contributions.\n"
        "3. Normalize the results across different scales (e.g., a user with 5 PRs in a small dataset might still score highly if their overall activity is balanced).\n"
        "4. If data is missing, use reasonable defaults (e.g., if no README is found, assume minimal documentation effort).\n"
        "5. Consider any other relevant GitHub data that could enhance the accuracy of each score.\n\n"

        "### **Output Format:**\n"
        "At the very end of the response, provide a vector of six floats in the format:\n"
        "[Commitment Style, Project Type, Collaboration Style, Tech Stack, Coding Structure, Profile Effort]\n\n"

        "### **Example Output:**\n"
        "[0.85, 0.40, 0.70, 0.85, 0.55, 0.85] \n"
        "NOTE: the list should be at the very end of the output to facilitate extraction with basic Python code."
    )

    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI trained to analyze GitHub profiles."},
            {"role": "user", "content": f"{prompt}\n\nGitHub Profile Data:\n{user_data}"}
        ]
    )

    return response.choices[0].message.content.strip()


# === 7. Check README Presence & Length ===
def check_readme_presence(username, repo_name):
    """Checks if a repository has a README file."""
    readme_url = f"https://api.github.com/repos/{username}/{repo_name}/readme"
    response = requests.get(readme_url, headers=HEADERS)
    return response.status_code == 200  # Returns True if README exists

def get_readme_length(username, repo_name):
    """Fetches the README file's content length."""
    readme_url = f"https://api.github.com/repos/{username}/{repo_name}/readme"
    response = requests.get(readme_url, headers=HEADERS)
    
    if response.status_code == 200:
        return len(response.json().get("content", ""))
    
    return 0  # If README doesn't exist, return length 0

def extract_github_scores(data):
    """
    Extracts a list of six floating-point scores (0.00 - 1.00) from the last vector in 'github_score'.
    
    Args:
        data (dict): Dictionary containing 'github_score' as a text output.

    Returns:
        list: A list of six floats representing the extracted scores.
    """

    github_score_text = data

    # Regex to find the last occurrence of a list of six floats in brackets [X.XX, X.XX, ..., X.XX]
    match = re.findall(r"\[\s*(\d\.\d{2}),\s*(\d\.\d{2}),\s*(\d\.\d{2}),\s*(\d\.\d{2}),\s*(\d\.\d{2}),\s*(\d\.\d{2})\s*\]", github_score_text)

    if not match:
        raise ValueError("Could not find the final score vector in the text.")

    # Extract the last match (final score vector) and convert it to floats
    scores = list(map(float, match[-1]))

    return scores


def compute_similarity(user_scores, target_username):
    """
    Computes cosine similarity between a target user and all other users.
    
    Args:
        user_scores (dict): Dictionary where the key is the username (str) 
                            and the value is a list of 6 floating-point scores.
        target_username (str): The username to compare against others.
    
    Returns:
        list: Sorted list of tuples (other_user, similarity_score) in decreasing order.
    """
    if target_username not in user_scores:
        raise ValueError(f"Username {target_username} not found in user data.")

    target_vector = np.array(user_scores[target_username])  # Convert target user's scores to NumPy array
    similarities = []

    for username, vector in user_scores.items():
        if username == target_username:
            continue  # Skip self-comparison
        
        other_vector = np.array(vector)  # Convert other user's scores to NumPy array
        similarity = 1 - cosine(target_vector, other_vector)  # Compute cosine similarity
        similarities.append((username, similarity))

    # Sort by highest similarity first
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities



# === MAIN FUNCTION ===
def collect_github_data(usernames):
    output = {}
    for username in usernames:
        print(f"Processing {username}...")
        user_profile = get_user_profile(username)
        repos = get_repos(username)
        commit_history = get_commit_history(username, repos)
        collaboration_data = get_collaboration_data(username)

        download_profile_picture(username)

        # Download and analyze profile picture + the roast
        profile_description = interpret_profile_picture(username)
        profile_roast = extract_last_sentence(profile_description)

        # Prepare user data for scoring
        user_data = {
            "username": username,
            "profile": user_profile,
            "repositories": repos,
            "commit_history": commit_history,
            "collaboration": collaboration_data,
            "profile_picture_description": profile_description
        }

        # Get GitHub profile score
        github_score = score_github_profile(user_data)

        output[username] = {
            "username": username,
            "profile_description": profile_description,
            "github_score": github_score,
            "profile_picture_roast": profile_roast
        }

        final_score = extract_github_scores(github_score)
        output[username]["final_score"] = final_score
    return output

def extract_last_sentence(text):
    """
    Extracts the last sentence from a given text.
    This is used to get the software engineering/GitHub-related roast.
    """
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())  # Split by sentence-ending punctuation
    if sentences:
        return sentences[-1]  # Return last sentence (the roast)
    return "No roast found."

def collect_github_data_only_vector(longOutput):
    output = {}
    for username in usernames:
        output[username] = longOutput[username]["final_score"]
    return output

def collect_github_roasts_only(longInput):
    """
    Extracts profile picture roasts for a list of users.
    
    Args:
        longInput (dict): longInput, obviously
    
    Returns:
        dict: Dictionary where the key is the username and the value is the profile picture roast.
    """
    output = {}

    for username in usernames:
        output[username] = longOutput[username]["profile_picture_roast"]  # Extract roast only

    return output


# Run data collection
if __name__ == "__main__":
    usernames = ["alorsahoo", "aliceli465"]  # Example users
    longOutput = collect_github_data(usernames)

    # EXAMPLE 1: gives 6 number long vector for all users
    vectorList = collect_github_data_only_vector(longOutput)
    print(vectorList)

    # EXAMPLE 2: cosine similarity
    # Step 2: Compute similarity for a target user
    target_user = "aliceli465"
    similarity_results = compute_similarity(vectorList, target_user)
    print(f"\nTop matches for {target_user}:")
    for username, score in similarity_results:
        print(f"{username}: {score:.4f}")
    
    #EXAMPLE 3: Get profile picture roasts for all users
    roastList = collect_github_roasts_only(usernames)
    print(roastList)
    
