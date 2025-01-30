from flask import Flask, jsonify, request
from flask import render_template

from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from config import Confing

load_dotenv('./.flaskenv')
app = Flask(__name__)
app.config.from_object(Confing)

db = SQLAlchemy(app)
import models
#from forms import TaskForm

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    sqlData = models.inventario.query.all()
    if not isinstance(sqlData, list):
        sqlData = [item.to_dict() for item in sqlData]
    return jsonify(sqlData)

if __name__ == '__main__':
    app.run()