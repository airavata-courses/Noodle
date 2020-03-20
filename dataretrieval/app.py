from threading import Thread

from flask import Flask
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from model.job import Job
from model.message import Message
from model.user import db, User
from service import service
import jsons

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
def retrieve_data():

    consumer = service.Consumer("data-retrieve")
    consKafka = consumer.get_consumer()

    while True:
        msg_pack = consKafka.poll()
        for tp, messages in msg_pack.items():
            for msg in messages:
                user_job = msg.value
                message = jsons.load(user_job, Message)
                prod = service.Producer(message.station)
                kafka_prod = prod.connect_kafka_producer()

                prod.retrieve_data(kafka_prod,message,db)


if __name__ == "__main__":
    manager.run()