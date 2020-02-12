from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    job = db.Column(db.String(255))
    station = db.Column(db.String(255))

    def __init__(self, name, job,station):
        self.name = name
        self.job = job
        self.station =station

