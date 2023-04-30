# Customizable GitHub Contributions Graph
This project allows users to create custom text or display an image on their GitHub contributions graph by generating historical commits. With this tool, you can personalize your GitHub profile in a unique and creative way.

## Features
- Create custom text or display an image on your GitHub contributions graph
- Customize commit count range, year, and spacing between letters
- Dry-run option for testing before execution
- Easy-to-follow setup and installation

## Prerequisites
- Node.js
- Git (and github account)
- Yarn/npm (optional)


## Installation

- Clone this repository:

   `git clone git@github.com:luarmr/github-contributions-canvas.git`

- Navigate to the project directory:

- `cd custom-github-contributions-graph`

- Install dependencies using npm or yarn:
- 
   `yarn install` or `npm install`

## Usage
- Create a new folder outside of the project directory and initialize a Git repository:
```
mkdir my-graph
cd my-graph
git init
```
- Run the script with the desired options. (Several time if you want to affect diferent groahs per year)

- Follow the GitHub documentation to create a new repository and connect it to your local repository

```
git branch -M main
git remote add origin git@github.com:<user_name>/<project_name>.git
git push -u origin main
```


## Options

```
⚡ node <pick_a_path>/app.js --help

Usage: node app.js [options, text or image-path is required]

Options:
  --help, -h                   Show this help message and exit
  --text, -t <string>          The text that should be render (text or image-path is required)
  --image-path, -i <string>    Path to an image 7 pixel height 53 width (text or image-path
                               is required)
  --min-commits, --mc <number> Minimum number of commits (default: 1)
  --max-commits, --xc <number> Maximum number of commits (default: 30)
  --year, -y <number>          Year (default: current year)
  --space-between-letters, -s  <number> Space between letters (default: 1, valid: 0-7)
  --dry-run                    Test mode (default: false)
```

## Examples

Create custom text on the GitHub contributions graph for the year 2016:
```
node <pick_a_path>/app.js  -t "Be Nice" --space-between-letters 2 --year 2016;
```

Create custom text on your default GitHub contributions graph:
```
node <pick_a_path>/app.js  -t "Be Nice" --space-between-letters 2;
```

Preview the custom text without making actual commits:
```
node <pick_a_path>/app.js  -t "Be Nice" --space-between-letters 2 --dry-run;
```

Use an image to create a custom GitHub contributions graph:
```
node <pick_a_path>/app.js  -i "/path/to/image.png";
```

## Some results

### From Image

![Console execution of: node ../github-contributions-canvas/app.js -i ../github-contributions-canvas/assets/example.png -s2  --xc 4 -y 2011](https://github.com/luarmr/github-contributions-canvas/blob/main/assets/console_from_image.png?raw=true)

![Result of the execution with image](https://github.com/luarmr/github-contributions-canvas/blob/main/assets/github_from_image.png?raw=true)

### From text

![Console execution of: node ../github-contributions-canvas/app.js -t "be kind" -s1 -y 2013](https://github.com/luarmr/github-contributions-canvas/blob/main/assets/console_from_text_be_kind.png?raw=true)

![Result of the execution from text](https://github.com/luarmr/github-contributions-canvas/blob/main/assets/github_from_text_be_kind.png?raw=true)



## Remove commits (remove_commits.sh)

This script helps you remove commits after a specified date. This is useful when you've created commits in the wrong order, want to add content to your GitHub contributions graph for a previous year, or wish to modify your default graph without affecting overlapping dates.

`./remove_commits.sh 2023-01-31` 
