from kafka import KafkaConsumer
import time
from kafka import KafkaProducer
import boto3
import botocore
from botocore.client import Config
from metpy.io import Level2File
import json
import numpy as np
from model.job import Job
from model.user import User


class Consumer():

    def __init__(self,topic):
        self.topic = topic

    def get_consumer(self):
        consumer = KafkaConsumer(self.topic, auto_offset_reset='earliest',
                             bootstrap_servers=['kafka-service:9092'],value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                                 api_version=(0, 10), consumer_timeout_ms=1000)
        return consumer

    def get_producer(self):
        _producer = None
        try:
            _producer = KafkaProducer(bootstrap_servers=['kafka-service:9092'], api_version=(0, 10))
        except Exception as ex:
            print('Exception while connecting Kafka')
            print(str(ex))
        finally:
            return _producer

    def publish_message(self,producer,topic,key,value):
        try:
            key_bytes = bytes(key, encoding='utf-8')
            value_bytes = json.dumps(value.__dict__).encode('utf-8')
            producer.send(topic, key=key_bytes, value=value_bytes)
            producer.flush()
            return "Data processed"
        except Exception as ex:
            print('Exception in publishing rawdata')
            print(str(ex))
            return "Failed to process data"

    def publish_status(self, producer_instance, topic_name, key, value):
            try:
                key_bytes = bytes(key, encoding='utf-8')
                value_bytes = json.dumps(value.__dict__).encode('utf-8')
                producer_instance.send(topic_name, key=key_bytes, value=value_bytes)
                producer_instance.flush()
            except Exception as ex:
                print('Exception in publishing status')
                print(str(ex))

    def process_data(self,prefix,message,db):

        s3 = boto3.resource('s3', config=Config(signature_version=botocore.UNSIGNED,
                                                user_agent_extra='Resource'))
        bucket = s3.Bucket('noaa-nexrad-level2')
        for obj in bucket.objects.filter(Prefix=prefix):
            print(obj.key)

            # Use MetPy to read the file
            f = Level2File(obj.get()['Body'])
            sweep = 0
            # First item in ray is header, which has azimuth angle
            az = np.array([ray[0].az_angle for ray in f.sweeps[sweep]])

            ref_hdr = f.sweeps[sweep][0][4][b'REF'][0]
            ref_range = np.arange(ref_hdr.num_gates) * ref_hdr.gate_width + ref_hdr.first_gate
            ref = np.array([ray[4][b'REF'][1] for ray in f.sweeps[sweep]])

            rho_hdr = f.sweeps[sweep][0][4][b'RHO'][0]
            rho_range = (np.arange(rho_hdr.num_gates + 1) - 0.5) * rho_hdr.gate_width + rho_hdr.first_gate
            rho = np.array([ray[4][b'RHO'][1] for ray in f.sweeps[sweep]])

            phi_hdr = f.sweeps[sweep][0][4][b'PHI'][0]
            phi_range = (np.arange(phi_hdr.num_gates + 1) - 0.5) * phi_hdr.gate_width + phi_hdr.first_gate
            phi = np.array([ray[4][b'PHI'][1] for ray in f.sweeps[sweep]])

            zdr_hdr = f.sweeps[sweep][0][4][b'ZDR'][0]
            zdr_range = (np.arange(zdr_hdr.num_gates + 1) - 0.5) * zdr_hdr.gate_width + zdr_hdr.first_gate
            zdr = np.array([ray[4][b'ZDR'][1] for ray in f.sweeps[sweep]])

        producer = self.get_producer()
        status = self.publish_message(producer,"processed-data",prefix,message)
        job = Job("process", message.user, status, message.station)
        self.publish_status(producer,"process-session",message.user,job)
        message.job = 'Data Processing'
        user = User(message.user,message.job,message.station)
        db.session.add(user)
        db.session.commit()


    # def consume_messages(self,consumer,user,db):
    #     for msg in consumer:
    #         prefix = msg.value.decode("utf-8")
    #         self.process_data(prefix,user,db)
    #     consumer.close()




