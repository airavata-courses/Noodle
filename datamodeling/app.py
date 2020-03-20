import jsons
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from model.job import Job
from model.message import Message
from model.user import db, User
from service import service
from flask import request
from threading import Thread
from flask import json



app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI']=os.environ['SQLALCHEMY_DATABASE_URI']
SQLALCHEMY_TRACK_MODIFICATIONS = True
db.init_app(app)
db.app = app
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)


@manager.command
def execute_model():
    consumer = service.Consumer("processed-data")
    consKafka = consumer.get_consumer()
    count = 154
    while True :
        msg_pack = consKafka.poll()
        for tp, messages in msg_pack.items():
            for msg in messages:
                user_obj = msg.value
                message = jsons.load(user_obj, Message)
                count += 1
                consumer.execute_model(message.station, message, db)


if __name__ == '__main__':
    manager.run()
