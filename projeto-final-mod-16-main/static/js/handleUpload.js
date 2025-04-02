document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let currentFilepath = '';

    document.getElementById('file-input').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('editor-menu').classList.remove('hidden');
                document.querySelector('.image-editor-creator').classList.add('hidden'); // Ocultar o criador de imagem
    
                const image = new Image();
                image.onload = function () {
                    const maxWidth = 400;
                    const scaleFactor = maxWidth / image.width;
                    canvas.width = maxWidth;
                    canvas.height = image.height * scaleFactor;
    
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                };
    
                image.src = e.target.result;
            };
            reader.readAsDataURL(file);
    
            // Upload the file to the backend
            const formData = new FormData();
            formData.append('file', file);
    
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.filepath) {
                    currentFilepath = data.filepath;
                } else {
                    alert('Erro ao fazer upload da imagem.');
                }
            });
        }
    });

    // Add event listeners for filter buttons
    document.getElementById('grayscale').addEventListener('click', () => applyFilter('grayscale'));
    document.getElementById('sepia').addEventListener('click', () => applyFilter('sepia'));
    document.getElementById('blur').addEventListener('click', () => applyFilter('blur'));
    document.getElementById('sharpen').addEventListener('click', () => applyFilter('sharpen'));

    document.getElementById('brightness').addEventListener('input', function (event) {
        const brightnessValue = event.target.value / 100; // Normalizar para o intervalo 0.0 - 2.0
        applyFilter('brightness', { brightness: brightnessValue }); // Passar o valor como parte de options
    });

    document.getElementById('contrast').addEventListener('input', function (event) {
        const contrastValue = event.target.value / 100; // Normalizar para o intervalo 0.0 - 2.0
        applyFilter('contrast', { contrast: contrastValue }); // Passar o valor como parte de options
    });

    document.getElementById('download-image-editor').addEventListener('click', function () {
        const canvas = document.getElementById('canvas');
        const link = document.createElement('a');
        link.download = 'imagem-editada.png'; // Nome do arquivo de download
        link.href = canvas.toDataURL('image/png'); // Converte o conteúdo do canvas para uma URL de dados
        link.click(); // Simula o clique no link para iniciar o download
    });
    
    function applyFilter(filterType, options = {}) {
        const canvas = document.getElementById('canvas');
    
        // Verificar se o canvas está inicializado
        if (canvas.width === 0 || canvas.height === 0) {
            alert('Nenhuma imagem carregada ou criada.');
            return;
        }
    
        const requestBody = {
            filepath: currentFilepath || null, // Permitir null se não houver imagem carregada
            filter: filterType,
            ...options // Adiciona as opções ao corpo da requisição
        };
    
        fetch('/apply_filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const image = new Image();
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                URL.revokeObjectURL(url);
            };
            image.src = url;
        })
        .catch(error => {
            console.error('Erro ao aplicar filtro:', error);
        });
    }
});