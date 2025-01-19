from flask import Flask, request, jsonify
from flask_cors import CORS
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
import os
import base64
from dotenv import load_dotenv
import io
import requests

app = Flask(__name__)
# Enable CORS for all domains and routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

# API credentials
AZURE_API_KEY = os.getenv('AZURE_COMPUTER_VISION_API_KEY')
AZURE_ENDPOINT = os.getenv('AZURE_COMPUTER_VISION_ENDPOINT')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')

# Initialize Azure Computer Vision Client
cv_client = ComputerVisionClient(
    AZURE_ENDPOINT,
    CognitiveServicesCredentials(AZURE_API_KEY)
)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'ok',
        'message': 'Server is running'
    })

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze_image():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        print("Request received")
        
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file found'
            }), 400

        file = request.files['image']
        image_data = file.read()
        
        # Identify the subject using Azure
        print("Analyzing image with Azure...")
        subject = identify_subject(image_data)
        print(f"Identified subject: {subject}")
        
        # Generate story using DeepSeek
        print("Generating story with DeepSeek...")
        story = generate_story(subject)
        print("Story generated successfully")
        
        # Encode image for response
        image_b64 = base64.b64encode(image_data).decode('utf-8')
        
        return jsonify({
            'success': True,
            'image': f'data:image/jpeg;base64,{image_b64}',
            'story': story
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

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

if __name__ == '__main__':
    print("Starting server with Azure and DeepSeek APIs...")
    print(f"Azure Endpoint: {AZURE_ENDPOINT}")
    print("Azure Key Length:", len(AZURE_API_KEY) if AZURE_API_KEY else "Not set")
    print("DeepSeek Key Length:", len(DEEPSEEK_API_KEY) if DEEPSEEK_API_KEY else "Not set")
    app.run(host='127.0.0.1', port=5000, debug=True) 