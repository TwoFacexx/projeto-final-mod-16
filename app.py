from flask import Flask, request, send_file, jsonify
from PIL import Image, ImageEnhance, ImageFilter
import io

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    file = request.files['image']
    if file:
        img = Image.open(file)
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        return send_file(img_byte_arr, mimetype='image/png')

@app.route('/edit', methods=['POST'])
def edit_image():
    data = request.get_json()
    img = Image.open(io.BytesIO(data['image']))
    
    # Redimensionamento
    if 'resize' in data:
        width, height = img.size
        new_size = (int(width * data['resize'] / 100), int(height * data['resize'] / 100))
        img = img.resize(new_size)
    
    # Rotação
    if 'rotate' in data:
        img = img.rotate(data['rotate'])
    
    # Ajuste de brilho e contraste
    if 'brightness' in data:
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(data['brightness'] / 100)
    
    if 'contrast' in data:
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(data['contrast'] / 100)

    # Aplicação de filtro
    if 'filter' in data:
        if data['filter'] == 'bw':
            img = img.convert('L')  # Preto e Branco
        elif data['filter'] == 'sepia':
            img = apply_sepia_filter(img)
        elif data['filter'] == 'invert':
            img = Image.eval(img, lambda x: 255 - x)
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return send_file(img_byte_arr, mimetype='image/png')

def apply_sepia_filter(image):
    width, height = image.size
    pixels = image.load()  # Create the pixel map

    for py in range(height):
        for px in range(width):
            r, g, b = image.getpixel((px, py))

            tr = int(0.393 * r + 0.769 * g + 0.189 * b)
            tg = int(0.349 * r + 0.686 * g + 0.168 * b)
            tb = int(0.272 * r + 0.534 * g + 0.131 * b)

            if tr > 255:
                tr = 255
            if tg > 255:
                tg = 255
            if tb > 255:
                tb = 255

            pixels[px, py] = (tr,tg,tb)

    return image

@app.route('/save', methods=['POST'])
def save_image():
    data = request.get_json()
    img = Image.open(io.BytesIO(data['image']))
    img.save('edited_image.png')
    return jsonify({"message": "Image saved successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
