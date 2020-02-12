from kafka import KafkaConsumer
import time
from kafka import KafkaProducer
import boto3
import botocore
from botocore.client import Config
import matplotlib.pyplot as plt
from metpy.io import Level2File
from metpy.plots import add_timestamp, ctables
from mpl_toolkits.axes_grid1 import make_axes_locatable
import json
import numpy as np
import base64
import io

from model.image import Image
from model.job import Job
from model.user import User, db
import app


class Consumer():

    def __init__(self,topic):
        self.topic = topic

    def get_consumer(self):
        consumer = KafkaConsumer(self.topic, auto_offset_reset='earliest',
                             bootstrap_servers=['127.0.0.1:9092'], api_version=(0, 10),
                                 value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                                 consumer_timeout_ms=1000)
        return consumer

    def get_producer(self):
        _producer = None
        try:
            _producer = KafkaProducer(bootstrap_servers=['127.0.0.1:9092'], api_version=(0, 10))
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
            return "Model executed"
        except Exception as ex:
            print('Exception in publishing image data')
            print(str(ex))
            return "Failed to execute model"

    def publish_status(self, producer_instance, topic_name, key, value):
            try:
                key_bytes = bytes(key, encoding='utf-8')
                value_bytes = json.dumps(value.__dict__).encode('utf-8')
                producer_instance.send(topic_name, key=key_bytes, value=value_bytes)
                producer_instance.flush()
            except Exception as ex:
                print('Exception in publishing status')
                print(str(ex))

    def execute_model(self,prefix,user,db):

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
            # Get the NWS reflectivity colortable from MetPy
            ref_norm, ref_cmap = ctables.registry.get_with_steps('NWSReflectivity', 5, 5)

            # Plot the data!
            fig, axes = plt.subplots(2, 2, figsize=(15, 15))
            for var_data, var_range, colors, lbl, ax in zip((ref, rho, zdr, phi),
                                                            (ref_range, rho_range, zdr_range, phi_range),
                                                            (ref_cmap, 'plasma', 'viridis', 'viridis'),
                                                            ('REF (dBZ)', 'RHO', 'ZDR (dBZ)', 'PHI'),
                                                            axes.flatten()):
                # Turn into an array, then mask
                data = np.ma.array(var_data)
                data[np.isnan(data)] = np.ma.masked

                # Convert az,range to x,y
                xlocs = var_range * np.sin(np.deg2rad(az[:, np.newaxis]))
                ylocs = var_range * np.cos(np.deg2rad(az[:, np.newaxis]))

                # Define norm for reflectivity
                norm = ref_norm if colors == ref_cmap else None

                # Plot the data
                a = ax.pcolormesh(xlocs, ylocs, data, cmap=colors, norm=norm)

                divider = make_axes_locatable(ax)
                cax = divider.append_axes('right', size='5%', pad=0.05)
                fig.colorbar(a, cax=cax, orientation='vertical', label=lbl)

                ax.set_aspect('equal', 'datalim')
                ax.set_xlim(-100, 100)
                ax.set_ylim(-100, 100)
                add_timestamp(ax, f.dt, y=0.02, high_contrast=False)
            plt.suptitle('KVWX Level 2 Data', fontsize=20)
            plt.tight_layout()
            #plt.show()
            print("Image generated")
            pic_IObytes = io.BytesIO()
            plt.savefig(pic_IObytes, format='png')
            pic_IObytes.seek(0)
            pic_hash = base64.b64encode(pic_IObytes.read())

        producer = self.get_producer()
        #status = self.publish_message(producer,"model",prefix,user)
        job = Job("process",user.name,"Model Executed",user.station)
        self.publish_status(producer,"model-session",user.name,job)
        user.job = "Model Execution"
        db.session.add(user)
        db.session.commit()
        user_record= User.query.filter_by(name=user.name).first()
        image = Image(user_record.id,pic_hash)
        db.session.add(image)
        db.session.commit()





