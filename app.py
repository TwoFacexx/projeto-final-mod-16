from flask import Flask, render_template, request, jsonify, send_file
from PIL import Image, ImageDraw, ImageFont, ImageFilter
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


@app.route('/apply_filter', methods=['POST'])
def apply_filter():
    data = request.json
    filepath = data.get('filepath')
    filter_type = data.get('filter')

    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'Arquivo não encontrado.'}), 400

    try:
        img = Image.open(filepath)

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

        output = BytesIO()
        img.save(output, format='PNG')
        output.seek(0)
        return send_file(output, mimetype='image/png')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)