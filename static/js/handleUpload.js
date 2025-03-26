document.addEventListener('DOMContentLoaded', function () {
    const addTextButton = document.getElementById('add-text');
    const drawCircleButton = document.getElementById('draw-circle');
    const editorMenu = document.getElementById('editor-menu');
    const drawLineButton = document.getElementById('draw-line');
    const saveImageButton = document.getElementById('save-image');
    const textColorInput = document.getElementById('text-color');
    const uploadBox = document.getElementById('upload-box');
    const textContentInput = document.getElementById('text-content');
    const fileInput = document.getElementById('file-input');
    const canvas = document.getElementById('canvas');



    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('editor-menu').classList.remove('hidden');
    
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                const image = new Image();
    
                image.onload = function() {                   
                    const maxWidth = 400; 
                    const scaleFactor = maxWidth / image.width;
                    canvas.width = maxWidth;
                    canvas.height = image.height * scaleFactor;
    
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                };
    
                image.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    

    document.getElementById('upload-button').addEventListener('click', function() {
        document.getElementById('file-input').click();
    });

    addTextButton.addEventListener('click', function () {
        const formData = new FormData();
        formData.append('text', textContentInput.value);
        formData.append('color', textColorInput.value);
        formData.append('image', fileInput.files[0]);
        uploadImage('/add_text', formData);
    });

    drawCircleButton.addEventListener('click', function () {
        const formData = new FormData();
        formData.append('color', textColorInput.value);
        formData.append('image', fileInput.files[0]);
        uploadImage('/draw_circle', formData);
    });

    drawLineButton.addEventListener('click', function () {
        const formData = new FormData();
        formData.append('color', textColorInput.value);
        formData.append('image', fileInput.files[0]);
        uploadImage('/draw_line', formData);
    });

    saveImageButton.addEventListener('click', function () {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    addTextButton.addEventListener('click', function () {
        const formData = new FormData();
        formData.append('text', textContentInput.value);
        formData.append('color', textColorInput.value);
        formData.append('image', fileInput.files[0]);
        uploadImage('/add_text', formData);
    });

    drawCircleButton.addEventListener('click', function () {
        const formData = new FormData();
        formData.append('color', textColorInput.value);
        formData.append('image', fileInput.files[0]);
        uploadImage('/draw_circle', formData);
    });

    drawLineButton.addEventListener('click', function () {
        const formData = new FormData();
        formData.append('color', textColorInput.value);
        formData.append('image', fileInput.files[0]);
        uploadImage('/draw_line', formData);
    });

    saveImageButton.addEventListener('click', function () {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});