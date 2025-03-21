const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const toolbar = document.querySelector('.toolbar');

let isDrawing = false;
let currentTool = 'pen';
let currentColor = '#000000';
let lineWidth = 5;
let startX, startY;
let isDrawingShape = false;
let currentShape = '';
let backgroundImage = null;
let backgroundPattern = null;
let showBackgroundOnExport = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Função para desenhar
function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}

// Função para desenhar formas
function drawShape(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;

    switch (currentShape) {
        case 'reta':
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            break;
        case 'retângulo':
            ctx.rect(x1, y1, x2 - x1, y2 - y1);
            break;
        case 'círculo':
            const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            ctx.arc(x1, y1, radius, 0, Math.PI * 2);
            break;
        case 'triângulo':
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1 * 2 - x2, y2);
            ctx.closePath();
            break;
        case 'pentágono':
            drawPolygon(x1, y1, 5, Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            break;
        case 'hexágono':
            drawPolygon(x1, y1, 6, Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
            break;
    }
    ctx.stroke();
}

function drawPolygon(x, y, sides, radius) {
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    for (let i = 1; i <= sides; i++) {
        ctx.lineTo(x + radius * Math.cos(i * 2 * Math.PI / sides), y + radius * Math.sin(i * 2 * Math.PI / sides));
    }
    ctx.closePath();
}

// Função para exportar desenho
function exportToImage(format) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    if (showBackgroundOnExport) {
        if (backgroundImage) {
            tempCtx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else if (backgroundPattern) {
            tempCtx.fillStyle = backgroundPattern;
            tempCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `lousa.${format}`;
    link.href = tempCanvas.toDataURL(`image/${format}`);
    link.click();
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
    doc.save('lousa.pdf');
}

// Função para definir fundo
function setBackgroundPattern(pattern) {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    patternCanvas.width = 20;
    patternCanvas.height = 20;

    patternCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

    switch (pattern) {
        case 'pautado':
            patternCtx.strokeStyle = '#000000';
            patternCtx.beginPath();
            patternCtx.moveTo(0, 10);
            patternCtx.lineTo(20, 10);
            patternCtx.stroke();
            break;
        case 'quadriculado':
            patternCtx.strokeStyle = '#000000';
            patternCtx.beginPath();
            for (let i = 0; i <= 20; i += 5) {
                patternCtx.moveTo(i, 0);
                patternCtx.lineTo(i, 20);
                patternCtx.moveTo(0, i);
                patternCtx.lineTo(20, i);
            }
            patternCtx.stroke();
            break;
        case 'pontilhado':
            patternCtx.fillStyle = '#000000';
            for (let i = 0; i < 20; i += 5) {
                for (let j = 0; j < 20; j += 5) {
                    patternCtx.fillRect(i, j, 2, 2);
                }
            }
            break;
    }

    backgroundPattern = ctx.createPattern(patternCanvas, 'repeat');
    ctx.fillStyle = backgroundPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setBackgroundImage(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        backgroundImage = img;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

document.getElementById('pen').addEventListener('click', () => {
    currentTool = 'pen';
    currentColor = '#000000';
});

document.getElementById('marker').addEventListener('click', () => {
    currentTool = 'marker';
    currentColor = '#FF0000';
});

document.getElementById('eraser').addEventListener('click', () => {
    currentTool = 'eraser';
    currentColor = '#FFFFFF';
});

document.getElementById('shapes').addEventListener('click', () => {
    currentTool = 'shape';
    currentShape = prompt("Escolha a forma (reta, retângulo, círculo, triângulo, pentágono, hexágono):");
});

document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('export').addEventListener('click', () => {
    const format = prompt("Escolha o formato (pdf, png, jpg):");
    if (format === 'pdf') {
        exportToPDF();
    } else if (format === 'png' || format === 'jpg') {
        exportToImage(format);
    }
});

document.getElementById('background').addEventListener('click', () => {
    const choice = prompt("Escolha o fundo (pautado, quadriculado, pontilhado, imagem):");
    if (choice === 'imagem') {
        const imgUrl = prompt("Insira a URL da imagem:");
        setBackgroundImage(imgUrl);
    } else {
        setBackgroundPattern(choice);
    }
});
