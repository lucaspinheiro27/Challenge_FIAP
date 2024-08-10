from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Carregar variáveis de ambiente
load_dotenv()

# Conectar ao MongoDB
conn_str = os.getenv('MONGODB_URI')
client = MongoClient(conn_str)
db = client["Cluster"]
collection = db["Audios"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_transcription', methods=['POST'])
def get_transcription():
    data = request.json
    file_name = data.get('file_name')
    query = {"file_name": file_name}
    projection = {"transcription": 1, "_id": 0}

    transcription = collection.find_one(query, projection)

    if transcription:
        return jsonify(transcription)
    else:
        return jsonify({"error": "Transcription not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
