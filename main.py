# import os
# import requests
# import datetime
# import numpy as np
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# # Get the GitHub token from environment variables
# TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

# # GitHub API request headers
# HEADERS = {"Authorization": f"token {TOKEN}"} if TOKEN else {}

# # === 1. Fetch User Profile Data ===
# def get_user_profile(username):
#     url = f"https://api.github.com/users/{username}"
#     response = requests.get(url, headers=HEADERS).json()
#     return response  # Returns the full JSON response from GitHub

# # === 2. Fetch User Repositories ===
# def get_repos(username):
#     url = f"https://api.github.com/users/{username}/repos?per_page=100"
#     repos = requests.get(url, headers=HEADERS).json()
    
#     # Fetch additional repo details
#     repo_details = []
#     for repo in repos:
#         repo_info = {
#             "name": repo["name"],
#             "url": repo["html_url"],
#             "description": repo.get("description", ""),
#             "fork": repo["fork"],
#             "stars": repo["stargazers_count"],
#             "watchers": repo["watchers_count"],
#             "created_at": repo["created_at"],
#             "updated_at": repo["updated_at"],
#             "pushed_at": repo["pushed_at"],
#             "languages_url": repo["languages_url"],
#             "has_readme": check_readme_presence(username, repo["name"])
#         }

#         # Fetch languages used in the repo
#         languages = requests.get(repo["languages_url"], headers=HEADERS).json()
#         repo_info["languages"] = languages

#         repo_details.append(repo_info)
    
#     return repo_details

# # === 3. Fetch Commit History for Each Repo ===
# def get_commit_history(username, repos):
#     commit_history = {}

#     for repo in repos:
#         if repo["fork"]:  # Ignore forks for commit history
#             continue

#         repo_name = repo["name"]
#         url = f"https://api.github.com/repos/{username}/{repo_name}/commits?per_page=100"
#         commits = requests.get(url, headers=HEADERS).json()

#         commit_dates = []
#         for commit in commits:
#             if "commit" in commit:
#                 date_str = commit["commit"]["author"]["date"]
#                 commit_dates.append(date_str)

#         commit_history[repo_name] = commit_dates
    
#     return commit_history

# # === 4. Fetch Collaboration Data (PRs, Issues, Discussions) ===
# def get_collaboration_data(username):
#     prs_url = f"https://api.github.com/search/issues?q=author:{username}+type:pr"
#     issues_url = f"https://api.github.com/search/issues?q=author:{username}+type:issue"
#     events_url = f"https://api.github.com/users/{username}/events"

#     prs_count = requests.get(prs_url, headers=HEADERS).json().get("total_count", 0)
#     issues_count = requests.get(issues_url, headers=HEADERS).json().get("total_count", 0)
#     discussions = requests.get(events_url, headers=HEADERS).json()

#     return {
#         "pull_requests": prs_count,
#         "issues": issues_count,
#         "discussions": len(discussions),
#         "raw_events": discussions  # Raw event data for later analysis
#     }

# # === 5. Check README Presence in Repositories ===
# def check_readme_presence(username, repo_name):
#     readme_url = f"https://api.github.com/repos/{username}/{repo_name}/readme"
#     response = requests.get(readme_url, headers=HEADERS)
#     return response.status_code == 200

# # === MAIN FUNCTION ===
# def collect_github_data(username):
#     user_profile = get_user_profile(username)
#     repos = get_repos(username)
#     commit_history = get_commit_history(username, repos)
#     collaboration_data = get_collaboration_data(username)

#     return {
#         "username": username,
#         "profile": user_profile,  # Full GitHub profile info
#         "repositories": repos,  # List of all repos with details
#         "commit_history": commit_history,  # Commit timestamps per repo
#         "collaboration": collaboration_data  # PRs, Issues, Discussions
#     }

# # Run data collection
# if __name__ == "__main__":
#     github_data = collect_github_data("aliceli465")
#     print(github_data)  # Print structured data

import os
import requests
import datetime
import numpy as np
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the GitHub token from environment variables
TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

# GitHub API request headers
HEADERS = {"Authorization": f"token {TOKEN}"} if TOKEN else {}

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

    # Score commit messages: short/low-quality messages get lower scores
    message_quality_score = np.mean([score_commit_message(msg) for msg in commit_message_quality]) if commit_message_quality else 0.5

    return commit_history, message_quality_score

# === 4. Fetch Collaboration Data (PRs, Issues, Discussions, Code Reviews) ===
def get_collaboration_data(username):
    prs_url = f"https://api.github.com/search/issues?q=author:{username}+type:pr"
    issues_url = f"https://api.github.com/search/issues?q=author:{username}+type:issue"
    commented_prs_url = f"https://api.github.com/search/issues?q=commenter:{username}+type:pr"
    reviewed_prs_url = f"https://api.github.com/search/issues?q=reviewed-by:{username}+type:pr"
    forked_repos_url = f"https://api.github.com/users/{username}/starred"
    orgs_url = f"https://api.github.com/users/{username}/orgs"

    prs_count = requests.get(prs_url, headers=HEADERS).json().get("total_count", 0)
    issues_count = requests.get(issues_url, headers=HEADERS).json().get("total_count", 0)
    commented_prs_count = requests.get(commented_prs_url, headers=HEADERS).json().get("total_count", 0)
    reviewed_prs_count = requests.get(reviewed_prs_url, headers=HEADERS).json().get("total_count", 0)
    forked_repos_count = len(requests.get(forked_repos_url, headers=HEADERS).json())
    orgs_count = len(requests.get(orgs_url, headers=HEADERS).json())

    return {
        "pull_requests": prs_count,
        "issues": issues_count,
        "commented_prs": commented_prs_count,
        "reviewed_prs": reviewed_prs_count,
        "forked_repos": forked_repos_count,
        "joined_orgs": orgs_count
    }

# === 5. Contribution Graph Analysis ===
def get_contribution_graph(username):
    query = f"""
    query {{
      user(login: "{username}") {{
        contributionsCollection {{
          contributionCalendar {{
            weeks {{
              contributionDays {{
                contributionCount
                date
              }}
            }}
          }}
        }}
      }}
    }}
    """
    url = "https://api.github.com/graphql"
    response = requests.post(url, json={"query": query}, headers=HEADERS).json()

    contributions = []
    try:
        for week in response["data"]["user"]["contributionsCollection"]["contributionCalendar"]["weeks"]:
            for day in week["contributionDays"]:
                contributions.append(day["contributionCount"])

        std_dev = np.std(contributions)
        return 1 - (std_dev / max(contributions) if max(contributions) > 0 else 1)
    except KeyError:
        return 0.5  # Default if no data available

# === 6. Check README Presence & Length ===
def check_readme_presence(username, repo_name):
    readme_url = f"https://api.github.com/repos/{username}/{repo_name}/readme"
    response = requests.get(readme_url, headers=HEADERS)
    return response.status_code == 200

def get_readme_length(username, repo_name):
    readme_url = f"https://api.github.com/repos/{username}/{repo_name}/readme"
    response = requests.get(readme_url, headers=HEADERS)
    if response.status_code == 200:
        return len(response.json().get("content", ""))
    return 0

# === 7. Score Commit Messages ===
def score_commit_message(message):
    """
    Scores commit messages from 0 (bad) to 1 (detailed).
    """
    if len(message) < 10:
        return 0.2  # Very short commit messages
    elif len(message) < 30:
        return 0.5  # Medium messages
    elif any(keyword in message.lower() for keyword in ["fix", "update", "bug"]):
        return 0.6  # Common but slightly useful messages
    else:
        return 1.0  # Detailed messages

# === 8. Fetch Stack Overflow Presence ===
def get_stack_overflow_presence(username):
    url = f"https://api.stackexchange.com/2.3/users?inname={username}&site=stackoverflow"
    response = requests.get(url).json()

    if response.get("items"):
        top_user = response["items"][0]
        return {
            "reputation": top_user.get("reputation", 0),
            "answer_count": top_user.get("answer_count", 0),
        }
    return {"reputation": 0, "answer_count": 0}

# === MAIN FUNCTION ===
def collect_github_data(username):
    user_profile = get_user_profile(username)
    repos = get_repos(username)
    commit_history, commit_quality = get_commit_history(username, repos)
    collaboration_data = get_collaboration_data(username)
    contribution_score = get_contribution_graph(username)
    stack_overflow_data = get_stack_overflow_presence(username)

    return {
        "username": username,
        "profile": user_profile,
        "repositories": repos,
        "commit_history": commit_history,
        "commit_quality": commit_quality,
        "collaboration": collaboration_data,
        "contribution_score": contribution_score,
        "stack_overflow": stack_overflow_data
    }

# Run data collection
if __name__ == "__main__":
    github_data = collect_github_data("aliceli465")
    print(github_data)  # Print structured data
