document.getElementById("draw-solid").addEventListener("click", function () {
    const geometryMenu = document.getElementById("geometry-menu");
    geometryMenu.classList.toggle("hidden"); // Alterna a visibilidade do menu
});

const shapes = [];
let selectedShape = null;
let isDragging = false;

document.getElementById("create-image-button").addEventListener("click", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const width = 800;
    const height = 600;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    currentFilepath = null;
    document.querySelector(".image-editor-creator").classList.remove("hidden");
});

document.getElementById("draw-square").addEventListener("click", function () {
    const square = { type: "square", x: 100, y: 100, width: 100, height: 100, color: "blue" };
    shapes.push(square);
    drawShapes();
});

document.getElementById("draw-circle").addEventListener("click", function () {
    const circle = { type: "circle", x: 200, y: 200, radius: 50, color: "red" };
    shapes.push(circle);
    drawShapes();
});

document.getElementById("draw-triangle").addEventListener("click", function () {
    const triangle = { type: "triangle", x: 150, y: 50, size: 100, color: "green" };
    shapes.push(triangle);
    drawShapes();
});

document.getElementById("canvas").addEventListener("mousedown", function (event) {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedShape = shapes.find((shape) => {
        if (shape.type === "square") {
            return mouseX >= shape.x && mouseX <= shape.x + shape.width && mouseY >= shape.y && mouseY <= shape.y + shape.height;
        } else if (shape.type === "circle") {
            const dx = mouseX - shape.x;
            const dy = mouseY - shape.y;
            return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
        } else if (shape.type === "triangle") {
            return mouseX >= shape.x - shape.size / 2 && mouseX <= shape.x + shape.size / 2 && mouseY >= shape.y && mouseY <= shape.y + shape.size;
        }
    });

    if (selectedShape) {
        isDragging = true;
    }
});

document.getElementById("canvas").addEventListener("mousemove", function (event) {
    if (!isDragging || !selectedShape) return;

    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedShape.x = mouseX;
    selectedShape.y = mouseY;

    drawShapes();
});

document.getElementById("canvas").addEventListener("mouseup", function () {
    isDragging = false;
    selectedShape = null;
});

function drawShapes() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Redesenhar o fundo branco
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redesenhar todas as formas
    shapes.forEach((shape) => {
        ctx.fillStyle = shape.color;
        if (shape.type === "square") {
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.fill();
        } else if (shape.type === "triangle") {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size);
            ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Adicionar texto ao canvas
document.getElementById("add-text-button").addEventListener("click", function () {
    const textContent = document.getElementById("text-content").value;
    const textColor = document.getElementById("text-color").value;

    if (textContent.trim() === "") {
        alert("Por favor, insira algum texto.");
        return;
    }

    const text = {
        type: "text",
        x: 150, // Posição inicial
        y: 150, // Posição inicial
        content: textContent,
        color: textColor,
        font: "20px Arial", // Fonte padrão
    };

    shapes.push(text);
    drawShapes();
});

// Atualizar a função drawShapes para suportar texto
function drawShapes() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Redesenhar o fundo branco
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redesenhar todas as formas e textos
    shapes.forEach((shape) => {
        ctx.fillStyle = shape.color;

        if (shape.type === "square") {
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.fill();
        } else if (shape.type === "triangle") {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size);
            ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size);
            ctx.closePath();
            ctx.fill();
        } else if (shape.type === "text") {
            ctx.font = shape.font;
            ctx.fillStyle = shape.color;
            ctx.fillText(shape.content, shape.x, shape.y);
        }
    });
}

// Atualizar eventos para suportar movimentação de texto
document.getElementById("canvas").addEventListener("mousedown", function (event) {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedShape = shapes.find((shape) => {
        if (shape.type === "square") {
            return mouseX >= shape.x && mouseX <= shape.x + shape.width && mouseY >= shape.y && mouseY <= shape.y + shape.height;
        } else if (shape.type === "circle") {
            const dx = mouseX - shape.x;
            const dy = mouseY - shape.y;
            return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
        } else if (shape.type === "triangle") {
            return mouseX >= shape.x - shape.size / 2 && mouseX <= shape.x + shape.size / 2 && mouseY >= shape.y && mouseY <= shape.y + shape.size;
        } else if (shape.type === "text") {
            const textWidth = canvas.getContext("2d").measureText(shape.content).width;
            const textHeight = parseInt(shape.font, 10); // Altura aproximada do texto
            return mouseX >= shape.x && mouseX <= shape.x + textWidth && mouseY >= shape.y - textHeight && mouseY <= shape.y;
        }
    });

    if (selectedShape) {
        isDragging = true;
    }
});

document.getElementById("canvas").addEventListener("mousemove", function (event) {
    if (!isDragging || !selectedShape) return;

    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedShape.x = mouseX;
    selectedShape.y = mouseY;

    drawShapes();
});

document.getElementById("canvas").addEventListener("mouseup", function () {
    isDragging = false;
    selectedShape = null;
});

// Adicionar texto ao canvas
document.getElementById("add-text-button").addEventListener("click", function () {
    const textContent = document.getElementById("text-content").value;
    const textColor = document.getElementById("text-color").value;

    if (textContent.trim() === "") {
        alert("Por favor, insira algum texto.");
        return;
    }

    const text = {
        type: "text",
        x: 150, // Posição inicial
        y: 150, // Posição inicial
        content: textContent,
        color: textColor,
        font: "20px Arial", // Fonte padrão
    };

    shapes.push(text);
    drawShapes();
});

// Atualizar a função drawShapes para suportar texto
function drawShapes() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Redesenhar o fundo branco
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redesenhar todas as formas e textos
    shapes.forEach((shape) => {
        ctx.fillStyle = shape.color;

        if (shape.type === "square") {
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.fill();
        } else if (shape.type === "triangle") {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size);
            ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size);
            ctx.closePath();
            ctx.fill();
        } else if (shape.type === "text") {
            ctx.font = shape.font;
            ctx.fillStyle = shape.color;
            ctx.fillText(shape.content, shape.x, shape.y);
        }
    });
}

// Atualizar eventos para suportar movimentação de texto
document.getElementById("canvas").addEventListener("mousedown", function (event) {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedShape = shapes.find((shape) => {
        if (shape.type === "square") {
            return mouseX >= shape.x && mouseX <= shape.x + shape.width && mouseY >= shape.y && mouseY <= shape.y + shape.height;
        } else if (shape.type === "circle") {
            const dx = mouseX - shape.x;
            const dy = mouseY - shape.y;
            return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
        } else if (shape.type === "triangle") {
            return mouseX >= shape.x - shape.size / 2 && mouseX <= shape.x + shape.size / 2 && mouseY >= shape.y && mouseY <= shape.y + shape.size;
        } else if (shape.type === "text") {
            const textWidth = canvas.getContext("2d").measureText(shape.content).width;
            const textHeight = parseInt(shape.font, 10); // Altura aproximada do texto
            return mouseX >= shape.x && mouseX <= shape.x + textWidth && mouseY >= shape.y - textHeight && mouseY <= shape.y;
        }
    });

    if (selectedShape) {
        isDragging = true;
    }
});

document.getElementById("canvas").addEventListener("mousemove", function (event) {
    if (!isDragging || !selectedShape) return;

    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedShape.x = mouseX;
    selectedShape.y = mouseY;

    drawShapes();
});

document.getElementById("canvas").addEventListener("mouseup", function () {
    isDragging = false;
    selectedShape = null;
});
document.getElementById("download-image").addEventListener("click", function () {
    const canvas = document.getElementById("canvas");
    const image = canvas.toDataURL("image/png"); // Converte o canvas para uma URL de dados no formato PNG

    // Cria um link temporário para download
    const link = document.createElement("a");
    link.href = image;
    link.download = "canvas-image.png"; // Nome do arquivo salvo
    link.click(); // Simula o clique no link para iniciar o download
});