from threading import Thread

from flask import Flask
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from model.job import Job
from model.user import db, User
from service import service
import jsons

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:idontknow.3@localhost:5432/retrievedb'
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
        msg_pack = consKafka.poll(timeout_ms=500)
        for tp, messages in msg_pack.items():
            for msg in messages:
                user_job = msg.value
                user = jsons.load(user_job, User)
                prod = service.Producer(user.station)
                kafka_prod = prod.connect_kafka_producer()
                #user = User("Naga711","Data retrieval",'2019/06/26/KVWX/KVWX20190626_221105_V06')
                prod.retrieve_data(kafka_prod,user,db)


if __name__ == "__main__":
    manager.run()