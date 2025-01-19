import os
import base64
import io
import json
import requests
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs

# Load environment variables
AZURE_API_KEY = os.getenv('AZURE_COMPUTER_VISION_API_KEY')
AZURE_ENDPOINT = os.getenv('AZURE_COMPUTER_VISION_ENDPOINT')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')

# Initialize Azure Computer Vision Client
cv_client = ComputerVisionClient(
    AZURE_ENDPOINT,
    CognitiveServicesCredentials(AZURE_API_KEY)
)

def identify_subject(image_data):
    image_stream = io.BytesIO(image_data)
    
    analysis = cv_client.analyze_image_in_stream(
        image_stream,
        visual_features=[VisualFeatureTypes.objects, VisualFeatureTypes.description, VisualFeatureTypes.tags]
    )
    
    if analysis.objects:
        sorted_objects = sorted(
            analysis.objects,
            key=lambda obj: (obj.rectangle.w * obj.rectangle.h),
            reverse=True
        )
        for obj in sorted_objects:
            if obj.object_property.lower() not in ["person", "human face", "grass", "indoor", "outdoor"]:
                return obj.object_property.lower()
    
    if analysis.description and analysis.description.captions:
        return analysis.description.captions[0].text.lower()
    
    if analysis.tags:
        sorted_tags = sorted(analysis.tags, key=lambda t: t.confidence, reverse=True)
        for tag in sorted_tags:
            if tag.name.lower() not in ["person", "human", "grass", "indoor", "outdoor"]:
                return tag.name.lower()
    
    return "animal"

def generate_story(subject):
    try:
        url = "https://api.deepseek.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        prompt = f"Write a short, heartwarming story about {subject}. Keep it under 100 words."
        
        response = requests.post(
            url,
            headers=headers,
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 150
            }
        )
        
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error generating story: {e}")
        return f"Sorry, I couldn't generate a story at this time. But I identified a {subject}!"

def handler(event, context):
    # Handle CORS preflight request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    try:
        # Get the request body
        body = event.get('body', '')
        if isinstance(body, str):
            body = base64.b64decode(body)

        # Parse multipart form data
        content_type = event.get('headers', {}).get('content-type', '')
        if 'multipart/form-data' not in content_type:
            raise ValueError('Invalid content type')

        # Extract boundary
        boundary = content_type.split('boundary=')[1]
        
        # Parse multipart form data
        parts = body.split(f'--{boundary}'.encode())
        image_data = None
        
        for part in parts:
            if b'Content-Disposition: form-data; name="image"' in part:
                # Extract image data
                image_start = part.find(b'\r\n\r\n') + 4
                image_data = part[image_start:].strip()
                break

        if not image_data:
            raise ValueError('No image data found')

        # Initialize Azure client
        cv_client = ComputerVisionClient(
            AZURE_ENDPOINT,
            CognitiveServicesCredentials(AZURE_API_KEY)
        )

        # Analyze image
        image_stream = io.BytesIO(image_data)
        analysis = cv_client.analyze_image_in_stream(
            image_stream,
            visual_features=[VisualFeatureTypes.description]
        )
        
        subject = analysis.description.captions[0].text

        # Generate story using DeepSeek
        story = generate_story(subject)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'subject': subject,
                'story': story
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        } 