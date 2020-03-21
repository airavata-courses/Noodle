import unittest
import boto3
import botocore
from botocore.client import Config
from metpy.io import Level2File
import json
import numpy as np


class Tests(unittest.TestCase):
    
    def test_process(self):
        print("Testing nexrad data retrieval ")
        
        s3 = boto3.resource('s3', config=Config(signature_version=botocore.UNSIGNED,
                                                user_agent_extra='Resource'))
        bucket = s3.Bucket('noaa-nexrad-level2')
        status = "Failure"
        for obj in bucket.objects.filter(Prefix="2019/06/26/KVWX/KVWX20190626_221105_V06"):
            print(obj.key)
            # Use MetPy to read the file
            f = Level2File(obj.get()['Body'])
            status = "Success"
        
    
        expected = "Success"
        self.assertEqual(status,expected,msg = "Data retrieval failed")

 

if __name__ == '__main__':
	print("Testing data retrieval")
	unittest.main()



