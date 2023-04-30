#!/bin/bash

# Usage: ./remove_commits.sh <date>
# Example: ./remove_commits.sh 2023-01-31

if [ $# -ne 1 ]; then
  echo "Usage: $0 <date:2022-04-24>"
  exit 1
fi

final_date=$1

# Check if there are any commits on the current branch
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "Error: No commits found on the current branch."
  exit 1
fi

# Get the commit hash and count the number of commits
commit_after_final_date=$(git log --before="$final_date" -1 --pretty=format:"%H")
number_of_commits=$(git rev-list --count "$commit_after_final_date"..HEAD)

if [ -z "$commit_after_final_date" ]; then
  echo "Error: No commits found after the specified date."
  exit 1
fi

# Perform interactive rebase to remove the old commits
git reset --hard "HEAD~$number_of_commits"

echo "Commits older than the specified date have been removed."
