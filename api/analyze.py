from http.server import BaseHTTPRequestHandler
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
import json
import os
import base64
import io
import requests

# API credentials from environment variables
AZURE_API_KEY = os.getenv('AZURE_COMPUTER_VISION_API_KEY')
AZURE_ENDPOINT = os.getenv('AZURE_COMPUTER_VISION_ENDPOINT')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')

# Initialize Azure Computer Vision Client
cv_client = ComputerVisionClient(
    AZURE_ENDPOINT,
    CognitiveServicesCredentials(AZURE_API_KEY)
)

def identify_subject(image_data):
    # Your existing identify_subject function
    # Analyze image using Azure Computer Vision
    image_stream = io.BytesIO(image_data)
    image_features = [VisualFeatureTypes.description]
    analysis = cv_client.analyze_image_in_stream(image_stream, image_features)
    
    # Extract subject from image description
    description = analysis.description.captions[0].text
    return description

def generate_story(subject):
    # Call DeepSeek API to generate story
    url = "https://api.deepseek.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }
    prompt = f"Write a short, fun children's story about {subject}. Keep it under 100 words."
    
    data = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 200
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    story = response.json()["choices"][0]["message"]["content"]
    return story

def handler(request):
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    try:
        # Parse multipart form data
        content_type = request.headers.get('content-type', '')
        if not content_type.startswith('multipart/form-data'):
            raise ValueError('Invalid content type')

        # Get image data from request
        image_data = request.files['image'].read()
        
        # Identify subject
        subject = identify_subject(image_data)
        
        # Generate story
        story = generate_story(subject)
        
        # Encode image
        image_b64 = base64.b64encode(image_data).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'image': f'data:image/jpeg;base64,{image_b64}',
                'story': story
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        response = handler(self)
        self.send_response(response['statusCode'])
        for key, value in response['headers'].items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(response['body'].encode())

    def do_OPTIONS(self):
        response = handler(self)
        self.send_response(response['statusCode'])
        for key, value in response['headers'].items():
            self.send_header(key, value)
        self.end_headers() 