# Customizable GitHub Contributions Graph

This project allows users to create custom text or display an image on their GitHub contributions graph by generating historical commits. With this tool, you can personalize your GitHub profile in a unique and creative way.

## Features
- Create custom text or display an image on your GitHub contributions graph
- Customize commit count range, year, and spacing between letters
- Dry-run option for testing before execution
- Easy-to-follow setup and installation

## Prerequisites
- Node.js
- Git (and GitHub account)
- Yarn/npm (optional)

## Installation

- Clone this repository:

   `git clone git@github.com:luarmr/github-contributions-canvas-drawing.git`

- Navigate to the project directory:

   `cd github-contributions-canvas-drawing`

- Install dependencies using npm or yarn:

   `yarn install` or `npm install`

## Usage
- Create a new folder outside of the project directory and initialize a Git repository:
  ```sh
  mkdir my-graph
  cd my-graph
  git init
  ```
- Run the script with the desired options. (Several times if you want to affect different graphs per year)
- Follow the GitHub documentation to create a new repository and connect it to your local repository:
  ```sh
  git branch -M main
  git remote add origin git@github.com:<user_name>/<project_name>.git
  git push -u origin main
  ```

## Options
```sh
⚡ npx github-contributions-canvas-drawing --help

Usage: npx github-contributions-canvas-drawing [options, text or image-path is required]

Options:
  --help, -h                   Show this help message and exit
  --text, -t <string>          The text that should be rendered (text or image-path is required)
  --image-path, -i <string>    Path to an image (7 pixels height, 53 pixels width) (text or image-path is required)
  --min-commits, --mc <number> Minimum number of commits (default: 1)
  --max-commits, --xc <number> Maximum number of commits (default: 30)
  --year, -y <number>          Year (default: current year)
  --space-between-letters, -s  <number> Space between letters (default: 1, valid: 0-7)
  --user, -u <string>          GitHub username to check for existing contributions (in beta)
  --dry-run                    Test mode (default: false)
  --force, -f                  Force remove commits older than the initial date
```

## Examples

Create custom text on the GitHub contributions graph for the year 2016. This command doesn't account for any existing contributions you may have:
```sh
npx github-contributions-canvas-drawing -t "Be Nice" --space-between-letters 2 --year 2016;
```

Create custom text on the GitHub contributions graph for the year 2016, but this time the tool will account for any existing contributions you may have:
```sh
npx github-contributions-canvas-drawing -t "Be Nice" --space-between-letters 2 --year 2016 --user luarmr;
# Notice that the contrib graph is timezone aware. So this may produce unexpected results. 
```

Create custom text on your default GitHub contributions graph:
```sh
npx github-contributions-canvas-drawing -t "Be Nice" --space-between-letters 2;
```

Preview the custom text without making actual commits:
```sh
npx github-contributions-canvas-drawing -t "Be Nice" --space-between-letters 2 --dry-run;
```

Use an image to create a custom GitHub contributions graph:
```sh
npx github-contributions-canvas-drawing -i "/path/to/image.png";
```

## Some Results

### From Image
![Console execution of: npx github-contributions-canvas-drawing -i ../github-contributions-canvas-drawing/assets/example.png -s2  --xc 4 -y 2011](https://github.com/luarmr/github-contributions-canvas-drawing/blob/main/assets/console_from_image.png?raw=true)

![Result of the execution with image](https://github.com/luarmr/github-contributions-canvas-drawing/blob/main/assets/github_from_image.png?raw=true)

### From Text
![Console execution of: npx github-contributions-canvas-drawing -t "be kind" -s1 -y 2013](https://github.com/luarmr/github-contributions-canvas-drawing/blob/main/assets/console_from_text_be_kind.png?raw=true)

![Result of the execution from text](https://github.com/luarmr/github-contributions-canvas-drawing/blob/main/assets/github_from_text_be_kind.png?raw=true)

## Notes
- Ensure your repository is initialized with `git init` before running the script.
- Use the `--dry-run` option to preview the changes without making any commits.
- The `--user` option is in beta and may not account for all time zones correctly.

## License
ISC