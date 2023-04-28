# Paint on GitHub contribution panel
This script creates historical commits to display custom text on your GitHub contribution graph.


## Usage 


- Clone this repository:

   `git clone git@github.com:luarmr/github-contributions-canvas.git`

- Install dependencies using yarn:

   `yarn install`

- Create a separate folder, not as a subfolder of this project.

- Initialize a new Git repository in the separate folder:

  `git init`

- Create a new repository on GitHub. If you use a private repository, make sure your contribution graph is set to display activity from private repositories.



- When setting years, use them incrementally.

- The script may return an error if the repository contains older commits. To resolve this issue, you can remove older commits using the 'remove_commits.sh' script.

- You can remove older commits using `remove_commits.sh`

- Follow the instructions provided at the end of the script.

```
git branch -M main
git remote add origin git@github.com:<user_name>/<project_name>.git
git push -u origin main
```

## --help

```
⚡ node <pick_a_path>/app.js --help

Usage: node app.js <text-to-render|dot2pic.com array> [options]

Options:
--help, -h                  Show this help message and exit
--min-commits, -mc <number> Minimum number of commits (default: 1)
--max-commits, -xc <number> Maximum number of commits (default: 40)
--year, -y <number>         Year (default: current year)
--space-between-letters, -s <number> Space between letters (default: 1, valid: 0-7)
--test, -t                  Test mode (default: false)
```

## Examples

Example, write a message on the year 2012: 
```
node <pick_a_path>/app.js  "Be Nice" --space-between-letters 2 --year 2012;
```

Example, write a message on your default profile
```
node <pick_a_path>/app.js  "Be Nice" --space-between-letters 2;
```

Example, to preview
```
node <pick_a_path>/app.js  "Be Nice" --space-between-letters 2 --text;
```

If you are a prolific coder, you may need to increase the 'Maximum number of commits' setting. Conversely, if you rarely commit, you can decrease it.


## Extra points
You may notice that the text can also an array from dot2pic.com
To use this untested functionality you can go to dot2pic.com and create a canvas of 53x7
It will only support black and white colors
Use the option "Convert to array"
Copy from `{` to `}`


```
node <pick_a_path>/app.js  "{0x01,0x01,0x01<this is a long string>0x01,0x01,0x01}" --space-between-letters 2;
```

I have no affiliation or even know the developer of dot2pic. I implement this part just because.




