from kafka import KafkaProducer, KafkaConsumer
import boto3
import botocore
from botocore.client import Config
import matplotlib.pyplot as plt
from metpy.io import Level2File
from metpy.plots import add_timestamp, ctables
from mpl_toolkits.axes_grid1 import make_axes_locatable
import numpy as np
import json

from model.job import Job
from model.user import User

class Consumer():

    def __init__(self,topic):
        self.topic = topic

    def get_consumer(self):
        consumer = KafkaConsumer(self.topic, auto_offset_reset='latest',
                             bootstrap_servers=['kafka:9092'], value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                                 api_version=(0, 10), consumer_timeout_ms=10000)
        return consumer

class Producer():

    def __init__(self,station):
        self.station = station

    def publish_rawdata(self,producer_instance, topic_name, key, value):
        try:
            key_bytes = bytes(key, encoding='utf-8')
            value_bytes = json.dumps(value.__dict__).encode('utf-8')
            producer_instance.send(topic_name, key=key_bytes, value=value_bytes)
            producer_instance.flush()
            return "Data retrieved"
        except Exception as ex:
            print('Exception in publishing rawdata')
            print(str(ex))
            return "Could not retrieve data"

    def publish_status(self,producer_instance,topic_name,key,value):
        try:
            key_bytes = bytes(key, encoding='utf-8')
            value_bytes = json.dumps(value.__dict__).encode('utf-8')
            producer_instance.send(topic_name, key=key_bytes, value=value_bytes)
            producer_instance.flush()

        except Exception as ex:
            print('Exception in publishing status')
            print(str(ex))


    def retrieve_data(self,producer_instance,message,db):
        s3 = boto3.resource('s3', config=Config(signature_version=botocore.UNSIGNED,
                                                user_agent_extra='Resource'))
        bucket = s3.Bucket('noaa-nexrad-level2')
        key =""
        for obj in bucket.objects.filter(Prefix=message.station):
            key = obj.key
            # Use MetPy to read the file
            f = Level2File(obj.get()['Body'])
            status = self.publish_rawdata(producer_instance,"retrieved-data",message.station,message)
            job = Job("retrieve",message.user,status,message.station)
            self.publish_status(producer_instance,"retrieve-session",job.user,job)
        #user = User(user["name"], "Data Retrieveal",user["station"])
        user = User(message.user, message.job, message.station)
        db.session.add(user)
        db.session.commit()


    def connect_kafka_producer(self):
        _producer = None
        try:
            _producer = KafkaProducer(bootstrap_servers=['kafka:9092'], api_version=(0, 10))
        except Exception as ex:
            print('Exception while connecting Kafka')
            print(str(ex))
        finally:
            return _producer


