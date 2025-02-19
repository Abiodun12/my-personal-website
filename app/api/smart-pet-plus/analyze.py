from http.server import BaseHTTPRequestHandler
import json
import base64
import io
import os
from dashscope import ImageRecognition

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)

            dashscope_key = os.environ.get('DASHSCOPE_API_KEY')
            
            if not dashscope_key:
                raise ValueError('Missing DashScope API key')

            image_data = base64.b64decode(data['image'])
            
            # Save temporary file
            temp_path = "temp_image.jpg"
            with open(temp_path, "wb") as f:
                f.write(image_data)

            # Analyze with DashScope
            response = ImageRecognition.call(
                model='image-recognition',
                image_path=temp_path,
                api_key=dashscope_key
            )

            # Clean up
            os.remove(temp_path)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            if response.status_code == 200:
                description = response.output.labels[0].name if response.output.labels else "animal"
            else:
                description = "animal"

            response_data = json.dumps({
                'success': True,
                'description': description
            })
            self.wfile.write(response_data.encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = json.dumps({
                'success': False,
                'error': str(e)
            })
            self.wfile.write(response_data.encode()) 