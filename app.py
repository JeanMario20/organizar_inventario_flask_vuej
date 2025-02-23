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
    sqlData = models.inventario.query.filter_by(ubicacion = "Principal")
    if not isinstance(sqlData, list):
        sqlData = [item.to_dict() for item in sqlData]
    return jsonify(sqlData)

@app.route('/api/dataBodega')
def get_data_bodega():
    sqlBodegaData = models.inventario.query.filter_by(ubicacion = 'Bodega').all()
    return jsonify(sqlBodegaData)

#unir las dos funciones de get_index_table_principal = queryFilter_byName
@app.route('/api/get_index_table_principal', methods=['POST'])
def getIndex():
    data = request.get_json()
    index = models.inventario.query.filter_by(nombre = data['nombre']).first()
    return jsonify(index)

@app.route('/api/searchItem', methods=['POST'])
def seachItem():
    data = request.get_json()
    seachItem = models.inventario.query.filter_by(nombre = data["nombre"]).first()
    return jsonify(seachItem)

@app.route('/api/add_new_data', methods=['POST'])
def addData():
    data = request.get_json()
    newItem = models.inventario(nombre=data["nombre"], num_existente= data["numExist"], precio = data["precio"], ubicacion = data["ubicacion"])
    db.session.add(newItem)
    db.session.commit()
    return jsonify(newItem)

@app.route('/api/edit_data', methods=['POST'])
def editData():
    data = request.get_json()
    editData = models.inventario.query.filter_by(nombre = data["oldName"]).first()
    editData.nombre = data["newName"]
    editData.precio = data["newPrecio"]
    editData.num_existente = data["newNumExist"]
    db.session.commit()
    return jsonify(data)



@app.route('/api/delete_Data', methods=['POST'])
def deleteData():
    data = request.get_json()
    print(data)
    models.inventario.query.filter_by(nombre = data['nombre']).delete()
    db.session.commit()
    return jsonify(data)

@app.route('/api/increase_or_decreased_data', methods=['POST'])
def increase_data():
    data = request.get_json()
    user = models.inventario.query.filter_by(nombre = data['nombre']).first()
    if data['action'] == "increased":
        user.num_existente = user.num_existente + 1
        db.session.commit()
    if data['action'] == 'decreased':
        user.num_existente = user.num_existente - 1
        db.session.commit()
    return jsonify(data)

@app.route('/api/moveLocationItems', methods=['POST'])
def move_location_items():
    data = request.get_json()
    user = models.inventario.query.filter_by(nombre = data['nombre']).first()
    if data['ubicacion'] == "Principal":
        user.ubicacion = "Bodega"
    if data['ubicacion'] == "Bodega":
        user.ubicacion = "Principal"
    db.session.commit()
    return jsonify(data)

#borrar todos los datos:
    #db.session.query(models.inventario).delete()
    #db.session.commit()


if __name__ == '__main__':
    app.run()