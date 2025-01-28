from pathlib import Path

BASE_DIR = Path(__file__).parent
#print(BASE_DIR)

class Confing:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + str(BASE_DIR.joinpath('db.sqlite'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
