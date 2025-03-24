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

bwFilter.addEventListener("click", () => applyFilter("bw"));
sepiaFilter.addEventListener("click", () => applyFilter("sepia"));
invertFilter.addEventListener("click", () => applyFilter("invert"));

function applyFilter(filter) {
    const data = {
        image: canvas.toDataURL("image/png"),
        filter: filter
    };
    
    fetch('/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.blob())
    .then(imageBlob => {
        const url = URL.createObjectURL(imageBlob);
        image.src = url;
        image.onload = () => ctx.drawImage(image, 0, 0);
    });
}

document.getElementById('save-image').addEventListener('click', () => {
    const data = {
        image: canvas.toDataURL("image/png")
    };
    
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => alert(data.message));
});
