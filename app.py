from flask import Flask, request, render_template, jsonify, send_file
from PIL import Image, ImageDraw, ImageFont
import io
import os

app = Flask(__name__, template_folder="templates", static_folder="static")

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"})
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    return jsonify({"message": "Upload realizado com sucesso", "filepath": filepath})

@app.route('/add_text', methods=['POST'])
def add_text():
    data = request.json
    img_path = data.get("filepath")
    text = data.get("text")
    color = data.get("color", "white")
    
    if not img_path or not text:
        return jsonify({"error": "Dados inválidos"})
    
    img = Image.open(img_path)
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()
    draw.text((50, 50), text, fill=color, font=font)
    
    output_path = os.path.join(UPLOAD_FOLDER, "edited.png")
    img.save(output_path)
    return jsonify({"message": "Texto adicionado", "filepath": output_path})

@app.route('/draw_circle', methods=['POST'])
def draw_circle():
    data = request.json
    img_path = data.get("filepath")
    
    if not img_path:
        return jsonify({"error": "Caminho da imagem não fornecido"})
    
    img = Image.open(img_path)
    draw = ImageDraw.Draw(img)
    draw.ellipse([100, 100, 200, 200], outline="red", width=5)
    
    output_path = os.path.join(UPLOAD_FOLDER, "edited.png")
    img.save(output_path)
    return jsonify({"message": "Círculo desenhado", "filepath": output_path})

@app.route('/draw_line', methods=['POST'])
def draw_line():
    data = request.json
    img_path = data.get("filepath")
    
    if not img_path:
        return jsonify({"error": "Caminho da imagem não fornecido"})
    
    img = Image.open(img_path)
    draw = ImageDraw.Draw(img)
    draw.line([50, 50, 200, 200], fill="blue", width=5)
    
    output_path = os.path.join(UPLOAD_FOLDER, "edited.png")
    img.save(output_path)
    return jsonify({"message": "Linha desenhada", "filepath": output_path})

@app.route('/download', methods=['GET'])
def download_image():
    filepath = os.path.join(UPLOAD_FOLDER, "edited.png")
    return send_file(filepath, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)