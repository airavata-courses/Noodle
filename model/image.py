from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey

from model.user import db, User


class Image(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    userid = db.Column(db.Integer(),ForeignKey(User.id))
    image = db.Column(db.LargeBinary())

    def __init__(self, userid, image):
        self.userid = userid
        self.image = image


