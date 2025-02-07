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

@app.route('/api/add_new_data', methods=['POST'])
def addData():
    data = request.get_json()
    newItem = models.inventario(nombre=data["nombre"], num_existente= data["numExist"], precio = data["precio"], ubicacion = data["ubicacion"])
    db.session.add(newItem)
    db.session.commit()
    return jsonify(newItem)

@app.route('/api/delete_Data', methods=['POST'])
def deleteData():
    data = request.get_json()
    models.inventario.query.filter_by(id = data['id']).delete()
    #u = db.session.get(models.inventario, sqlItem,)
    db.session.commit()

    #print(data['id'])
    return jsonify(data)

if __name__ == '__main__':
    app.run()