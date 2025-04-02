document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let currentFilepath = '';
    let originalImage = null; // Armazena a imagem original para resetar filtros
    const scales = [1, 2, 3]; // Fatores de escala (1x, 2x, 3x)
    let currentScaleIndex = 0;
    let currentRotation = 0; // Ângulo de rotação atual

    document.getElementById('file-input').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('editor-menu').classList.toggle('hidden');
                document.querySelector('.image-editor-creator').classList.add('hidden'); // Ocultar o criador de imagem

                const image = new Image();
                image.onload = function () {
                    const maxWidth = 400;
                    const scaleFactor = maxWidth / image.width;
                    canvas.width = maxWidth;
                    canvas.height = image.height * scaleFactor;

                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    originalImage = new Image(); // Salvar a imagem original
                    originalImage.src = canvas.toDataURL();
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

    // Função para resetar filtros
    document.getElementById('reset-filters').addEventListener('click', function () {
        if (!originalImage) {
            alert('Nenhuma imagem carregada ou criada para resetar.');
            return;
        }

        originalImage.onload = function () {
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            ctx.drawImage(originalImage, 0, 0);
        };
        originalImage.src = originalImage.src; // Recarregar a imagem original
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

    // Resize button functionality
    document.getElementById('resize-image').addEventListener('click', function () {
        if (canvas.width === 0 || canvas.height === 0) {
            alert('Nenhuma imagem carregada ou criada.');
            return;
        }
    
        currentScaleIndex = (currentScaleIndex + 1) % scales.length; // Alternar entre os tamanhos
        const scale = scales[currentScaleIndex];
    
        const image = new Image();
        image.onload = function () {
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = canvas.toDataURL(); // Usar a imagem atual do canvas
    });

    // Rotate button functionality
    document.getElementById('rotate-image').addEventListener('click', function () {
        if (canvas.width === 0 || canvas.height === 0) {
            alert('Nenhuma imagem carregada ou criada.');
            return;
        }

        currentRotation = (currentRotation + 90) % 360; // Incrementar a rotação em 90 graus

        const image = new Image();
        image.onload = function () {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            if (currentRotation === 90 || currentRotation === 270) {
                tempCanvas.width = canvas.height;
                tempCanvas.height = canvas.width;
            } else {
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
            }

            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tempCtx.rotate((currentRotation * Math.PI) / 180);
            tempCtx.drawImage(image, -canvas.width / 2, -canvas.height / 2);

            canvas.width = tempCanvas.width;
            canvas.height = tempCanvas.height;
            ctx.drawImage(tempCanvas, 0, 0);
        };
        image.src = canvas.toDataURL(); // Usar a imagem atual do canvas
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