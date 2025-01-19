from flask import Flask, request, jsonify
import os
import json
import base64
import io
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
import requests

app = Flask(__name__)

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
    prompt = f"Tell me a heartwarming story about {subject}."
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }
    
    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 150,
        "stream": False
    }
    
    try:
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        response_data = response.json()
        return response_data['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error generating story: {e}")
        return f"Sorry, I couldn't generate a story at this time. But I identified a {subject}!"

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        # Validate environment variables
        azure_key = os.environ.get('AZURE_COMPUTER_VISION_API_KEY')
        azure_endpoint = os.environ.get('AZURE_COMPUTER_VISION_ENDPOINT')
        
        print(f"Azure Key present: {bool(azure_key)}")
        print(f"Azure Endpoint present: {bool(azure_endpoint)}")
        
        if not azure_key or not azure_endpoint:
            return jsonify({'success': False, 'error': 'Missing Azure credentials'}), 500

        # Get request data
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'success': False, 'error': 'No image data provided'}), 400

        # Initialize Azure client
        print("Initializing Azure client")
        client = ComputerVisionClient(
            endpoint=azure_endpoint,
            credentials=CognitiveServicesCredentials(azure_key)
        )
        
        # Process image
        print("Decoding image")
        try:
            image_data = base64.b64decode(data['image'])
        except Exception as e:
            return jsonify({'success': False, 'error': f'Invalid base64 image data: {str(e)}'}), 400
            
        image_stream = io.BytesIO(image_data)
        
        # Analyze with Azure
        print("Calling Azure API")
        analysis = client.analyze_image_in_stream(
            image_stream,
            visual_features=[VisualFeatureTypes.description]
        )
        
        if not analysis.description or not analysis.description.captions:
            return jsonify({'success': False, 'error': 'No description generated for the image'}), 500

        description = analysis.description.captions[0].text
        print(f"Analysis complete. Description: {description}")

        return jsonify({
            'success': True,
            'description': description
        })
            
    except Exception as e:
        print(f"Error in analyze: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Vercel serverless handler
def handler(event, context):
    return app.wsgi_app(event, context) 