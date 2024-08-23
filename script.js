document.addEventListener("DOMContentLoaded", function () {
    const gridSize = 10;
    const imageCount = 62;
    const drawingArea = document.getElementById("drawing-area");
    const imageArea = document.getElementById("image-area");
    const downloadBtn = document.getElementById("download-btn");
    const downloadAnimationBtn = document.getElementById("download-animation-btn");

    // Initialisation de la grille de dessin
    let grid = createGrid(gridSize);
    grid.forEach(row => {
        row.forEach(cell => {
            drawingArea.appendChild(cell.element);
        });
    });

    document.getElementById("generate-btn").addEventListener("click", () => {
        generateImages(grid, imageCount);
    });

    downloadBtn.addEventListener("click", downloadImagesAsZip);
    downloadAnimationBtn.addEventListener("click", downloadAnimation);

    function createGrid(size) {
        let grid = [];
        for (let y = 0; y < size; y++) {
            let row = [];
            for (let x = 0; x < size; x++) {
                let cell = {
                    x: x,
                    y: y,
                    state: 0,
                    element: document.createElement("div")
                };
                cell.element.classList.add("cell");
                cell.element.addEventListener("click", () => {
                    cell.state = cell.state === 0 ? 1 : 0;
                    updateCell(cell);
                });
                row.push(cell);
            }
            grid.push(row);
        }
        return grid;
    }

    function updateCell(cell) {
        cell.element.classList.toggle("active", cell.state === 1);
    }

    function generateImages(initialGrid, count) {
        imageArea.innerHTML = "";
        let currentGrid = initialGrid.map(row => row.map(cell => cell.state));
        for (let i = 0; i < count; i++) {
            currentGrid = generateNextImage(currentGrid);
            displayImage(currentGrid);
        }
    }

    function generateNextImage(grid) {
        const size = grid.length;
        let newGrid = Array.from({ length: size }, () => Array(size).fill(0));
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const sum = getAdjacentSum(grid, x, y);
                newGrid[y][x] = sum % 2 === 0 ? 0 : 1;
            }
        }
        return newGrid;
    }

    function getAdjacentSum(grid, x, y) {
        const deltas = [-1, 0, 1];
        let sum = 0;
        deltas.forEach(dy => {
            deltas.forEach(dx => {
                if (dx !== 0 || dy !== 0) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid.length) {
                        sum += grid[newY][newX];
                    }
                }
            });
        });
        return sum;
    }

    function displayImage(grid) {
        const canvas = document.createElement("canvas");
        canvas.width = grid.length * 10;
        canvas.height = grid.length * 10;
        
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                ctx.fillStyle = cell === 1 ? "black" : "white";
                ctx.fillRect(x * 10, y * 10, 10, 10);
            });
        });
        imageArea.appendChild(canvas);
    }    

    async function downloadImagesAsZip() {
        const images = imageArea.querySelectorAll("canvas");
        const zip = new JSZip();

        images.forEach((canvas, index) => {
            const dataURL = canvas.toDataURL("image/png");
            const imgData = dataURL.split(',')[1];
            zip.file(`image_${index + 1}.png`, imgData, { base64: true });
        });

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "images.zip");
    }

    function downloadAnimation() {
        const images = Array.from(imageArea.querySelectorAll("canvas"));
        const frames = [];
        
        // Capture chaque canvas en image avec html2canvas
        Promise.all(images.map(canvas => {
            return html2canvas(canvas, { scale: 1 }).then(capturedCanvas => {
                return capturedCanvas.toDataURL("image/png");
            });
        })).then(imageDataURLs => {
            // Générer le GIF avec gifshot
            gifshot.createGIF({
                images: imageDataURLs,
                gifWidth: gridSize * 10,
                gifHeight: gridSize * 10,
                interval: 0.2,
                numFrames: imageDataURLs.length,
                frameDuration: 2,
                sampleInterval: 10,
                numWorkers: 2
            }, function(obj) {
                if (!obj.error) {
                    const image = obj.image;
                    const blob = dataURLToBlob(image);
                    saveAs(blob, 'animation.gif');
                } else {
                    console.error("Erreur lors de la création du GIF", obj.error);
                }
            });
        });
    }
    
    // Convertir un Data URL en Blob
    function dataURLToBlob(dataURL) {
        const parts = dataURL.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
    
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
    
        return new Blob([u8arr], { type: mime });
    }
    
});
