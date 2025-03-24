const uploadBox = document.getElementById("upload-box");
const fileInput = document.getElementById("file-input");
const editorMenu = document.getElementById("editor-menu");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightnessInput = document.getElementById("brightness");
const contrastInput = document.getElementById("contrast");
const rotateInput = document.getElementById("rotate");

const bwFilter = document.getElementById("bw-filter");
const sepiaFilter = document.getElementById("sepia-filter");
const invertFilter = document.getElementById("invert-filter");
const blurFilter = document.getElementById("blur-filter");
const saturateFilter = document.getElementById("saturate-filter");

const addText = document.getElementById("add-text");
const addLine = document.getElementById("add-line");
const addCircle = document.getElementById("add-circle");
const addRectangle = document.getElementById("add-rectangle");
const addTriangle = document.getElementById("add-triangle");
const addEllipse = document.getElementById("add-ellipse");

const textInput = document.getElementById("text-input");
const textColor = document.getElementById("text-color");
const textSize = document.getElementById("text-size");

let image = new Image();

uploadBox.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                editorMenu.classList.remove("hidden");
            };
        };
        reader.readAsDataURL(files[0]);
    }
});

bwFilter.addEventListener("click", () => applyFilter("grayscale(100%)"));
sepiaFilter.addEventListener("click", () => applyFilter("sepia(100%)"));
invertFilter.addEventListener("click", () => applyFilter("invert(100%)"));
blurFilter.addEventListener("click", () => applyFilter("blur(5px)"));
saturateFilter.addEventListener("click", () => applyFilter("saturate(200%)"));

function applyFilter(filter) {
    ctx.filter = filter;
    ctx.drawImage(image, 0, 0);
}

addText.addEventListener("click", () => {
    ctx.fillStyle = textColor.value;
    ctx.font = `${textSize.value}px Arial`;
    ctx.fillText(textInput.value, 50, 50);
});

addLine.addEventListener("click", () => {
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(200, 200);
    ctx.stroke();
});

addRectangle.addEventListener("click", () => ctx.fillRect(50, 50, 100, 50));
addTriangle.addEventListener("click", () => {
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(100, 150);
    ctx.lineTo(0, 150);
    ctx.closePath();
    ctx.fill();
});

addCircle.addEventListener("click", () => {
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI * 2);
    ctx.fill();
});

addEllipse.addEventListener("click", () => ctx.ellipse(100, 100, 60, 40, 0, 0, Math.PI * 2));
