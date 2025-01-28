from dataclasses import dataclass
from datetime import datetime
import app

#example
@dataclass
class Model(app.db.Model):
    
    id: int
    title: str
    date: datetime
    completed: bool

    id = app.db.Column(app.db.Integer(), primary_key=True)
    title = app.db.Column(app.db.String(140))
    date = app.db.Column(app.db.DateTime(), default=datetime.now())
    completed = app.db.Column(app.db.Boolean(), default=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def __repr__(self):
        return f'<Model id: {self.id} - {self.title}'

class inventario(app.db.Model):
    id: int
    nombre: str
    num_existente: int
    precio: int
    ubicacion:str

    id = app.db.Column(app.db.Integer(), primary_key=True)
    nombre = app.db.Column(app.db.String(140))
    num_existente = app.db.Column(app.db.Integer())
    precio = app.db.Column(app.db.Integer)
    ubicacion = app.db.Column(app.String(80))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def __repr__(self):
        return f'<Model id: {self.id} - {self.nombre}'
    