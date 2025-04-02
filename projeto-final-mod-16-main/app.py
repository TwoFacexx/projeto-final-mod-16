from flask import Flask, render_template, request, jsonify, send_file
from PIL import Image, ImageDraw, ImageFont, ImageFilter,  ImageEnhance
import os
from io import BytesIO

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado.'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    return jsonify({'filepath': filepath})

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


@app.route('/apply_filter', methods=['POST'])
def apply_filter():
    data = request.json
    filepath = data.get('filepath')
    filter_type = data.get('filter')
    brightness_value = data.get('brightness', 1.0)
    contrast_value = data.get('contrast', 1.0)
    text_content = data.get('text', '')
    text_color = data.get('color', '#000000')

    # Criar uma nova imagem em branco se o filepath for None
    if not filepath:
        img = Image.new('RGB', (800, 600), 'white')  # Tamanho padrão 800x600, fundo branco
    elif not os.path.exists(filepath):
        return jsonify({'error': 'Arquivo não encontrado.'}), 400
    else:
        img = Image.open(filepath)

    try:
        if filter_type == 'grayscale':
            img = img.convert('L').convert('RGB')
        elif filter_type == 'sepia':
            sepia_img = Image.new("RGB", img.size)
            pixels = img.load()
            for x in range(img.width):
                for y in range(img.height):
                    r, g, b = pixels[x, y]
                    tr = int(0.393 * r + 0.769 * g + 0.189 * b)
                    tg = int(0.349 * r + 0.686 * g + 0.168 * b)
                    tb = int(0.272 * r + 0.534 * g + 0.131 * b)
                    sepia_img.putpixel((x, y), (min(tr, 255), min(tg, 255), min(tb, 255)))
            img = sepia_img
        elif filter_type == 'blur':
            img = img.filter(ImageFilter.BLUR)
        elif filter_type == 'sharpen':
            img = img.filter(ImageFilter.SHARPEN)
        elif filter_type == 'brightness':
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(brightness_value)
        elif filter_type == 'contrast':
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(contrast_value)
        elif filter_type == 'add_text':
            draw = ImageDraw.Draw(img)
            font = ImageFont.load_default()  # Use default font
            text_position = (10, 10)  # Position of the text (top-left corner)
            rgb_color = hex_to_rgb(text_color)  # Convert hex color to RGB
            draw.text(text_position, text_content, fill=rgb_color, font=font)

        output = BytesIO()
        img.save(output, format='PNG')
        output.seek(0)
        return send_file(output, mimetype='image/png')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)