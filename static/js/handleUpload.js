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



    document.getElementById('upload-button').addEventListener('click', function() {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.getElementById('uploaded-image');
                img.src = e.target.result;
                img.style.display = 'block';
                uploadBox.style.display = 'none';
                editorMenu.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            alert('Please select a file first.');
        }
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