from http.server import BaseHTTPRequestHandler
import json
import base64
import io
import os
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials
import requests

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)

            # Validate Azure credentials
            azure_key = os.environ.get('AZURE_COMPUTER_VISION_API_KEY')
            azure_endpoint = os.environ.get('AZURE_COMPUTER_VISION_ENDPOINT')
            
            if not azure_key or not azure_endpoint:
                raise ValueError('Missing Azure credentials')

            # Process image
            image_data = base64.b64decode(data['image'])
            image_stream = io.BytesIO(image_data)
            
            # Initialize Azure client
            client = ComputerVisionClient(
                endpoint=azure_endpoint,
                credentials=CognitiveServicesCredentials(azure_key)
            )
            
            # Analyze image
            analysis = client.analyze_image_in_stream(
                image_stream,
                visual_features=['Description']
            )
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = json.dumps({
                'success': True,
                'description': analysis.description.captions[0].text
            })
            self.wfile.write(response.encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = json.dumps({
                'success': False,
                'error': str(e)
            })
            self.wfile.write(response.encode()) 