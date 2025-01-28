from flask import Flask
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

if __name__ == '__main__':
    app.run()