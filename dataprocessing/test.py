import unittest
import boto3
import botocore
from botocore.client import Config
from metpy.io import Level2File
import json
import numpy as np


class Tests(unittest.TestCase):
    
    def test_process(self):
        print("Testing nexrad data processing ")
        
        s3 = boto3.resource('s3', config=Config(signature_version=botocore.UNSIGNED,
                                                user_agent_extra='Resource'))
        bucket = s3.Bucket('noaa-nexrad-level2')
        status = "Failure"
        for obj in bucket.objects.filter(Prefix="2019/06/26/KVWX/KVWX20190626_221105_V06"):
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
            
            status = "Success"
        
    
        expected = "Success"
        self.assertEqual(status,expected,msg = "Data processing failed")

 

if __name__ == '__main__':
	print("Testing data processing")
	unittest.main()

