# BinGen

**BinGen** is a playful and minimalistic web tool to generate evolving binary images from a simple grid. Draw your own pattern, watch it transform step by step, and export the sequence as individual images or as an animated GIF!

## What is BinGen?

BinGen lets you create a small black-and-white image by toggling cells in a grid. With a single click, you can generate a sequence of images where each new grid is computed from the previous one using a simple rule:  
> The next state of each cell depends on the number of adjacent cells set to 1 (black) or 0 (white), and whether this number is even or odd.

This rule often leads to cyclic or repeating patterns, especially on square grids—making BinGen a fun tool for exploring simple automata and visual cycles.

## Features

- **Draw** your own binary image on a customizable grid.
- **Generate** a sequence of images based on a simple, deterministic rule.
- **Export** the sequence as a ZIP archive of images or as an animated GIF.
- **Instant preview**—no installation required.

## Try it online

You can use BinGen instantly on [GitHub Pages](https://16bravo.github.io/BinGeneration/).

## How to use

Just open `index.html` in your browser, or visit the link above.  
Click on grid cells to toggle them, then use the buttons to generate and download your image sequence.

## Technologies

- HTML, CSS, JavaScript (no frameworks)
- Runs entirely in your browser—perfect for static hosting (like GitHub Pages)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Author

Created by [16bravo](https://github.com/16bravo).  
Feel free to open an issue for questions or feedback.

---

**Tip:** Try different grid sizes and patterns—some will quickly repeat, others will surprise you!