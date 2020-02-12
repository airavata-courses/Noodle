import jsons
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from model.user import db, User
from service import service
from flask import request
from threading import Thread
from flask import json

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:idontknow.3@localhost:5432/processdb'
SQLALCHEMY_TRACK_MODIFICATIONS = True
db.init_app(app)
db.app = app
migrate = Migrate(app,db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

@manager.command
def process_data():
    consumer = service.Consumer("retrieved-data")
    consKafka = consumer.get_consumer()
    while True :
        msg_pack = consKafka.poll(timeout_ms=500)
        for tp, messages in msg_pack.items():
            for msg in messages:
                user_obj = msg.value
                user = jsons.load(user_obj, User)
                consumer.process_data(user.station, user, db)


if __name__ == '__main__':
    manager.run()

