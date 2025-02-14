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
import datetime

app = Flask(__name__)
# Enable CORS for all domains and routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

# API credentials
AZURE_API_KEY = os.getenv('AZURE_COMPUTER_VISION_API_KEY')
AZURE_ENDPOINT = os.getenv('AZURE_COMPUTER_VISION_ENDPOINT')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
DEEPSEEK_MODEL = "deepseek-chat"

# Initialize Azure Computer Vision Client
cv_client = ComputerVisionClient(
    AZURE_ENDPOINT,
    CognitiveServicesCredentials(AZURE_API_KEY)
)

@app.route('/')
def home():
    return jsonify({"status": "ok", "message": "API is running"})

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze_image_route():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        print("Received request")  # Debug log
        data = request.get_json()
        
        if not data or 'image' not in data:
            print("No image in request")  # Debug log
            return jsonify({'error': 'No image found in request'}), 400

        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        
        # Analyze image with Azure
        subject = analyze_image(image_data)
        print(f"Identified subject: {subject}")

        # Generate story with DeepSeek
        story = generate_story(subject)
        print(f"Generated story about: {subject}")

        return jsonify({
            'success': True,
            'subject': subject,
            'story': story
        })

    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check() -> dict:
    """
    Health check endpoint to monitor API status.

    Returns:
        dict: Status information including timestamp and message
    """
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'message': 'Smart Pet API is running',
        'version': '1.0.0'  # Added for monitoring
    })

def analyze_image(image_data):
    """Analyze image using Azure Computer Vision"""
    image_stream = io.BytesIO(image_data)

    # Analyze with multiple feature types
    analysis = cv_client.analyze_image_in_stream(
        image_stream,
        visual_features=[VisualFeatureTypes.objects, VisualFeatureTypes.description, VisualFeatureTypes.tags]
    )

    # Check objects first
    if analysis.objects:
        sorted_objects = sorted(
            analysis.objects,
            key=lambda obj: (obj.rectangle.w * obj.rectangle.h),
            reverse=True
        )
        for obj in sorted_objects:
            if obj.object_property.lower() not in ["person", "human face", "grass", "indoor", "outdoor"]:
                return obj.object_property.lower()

    # Check description caption
    if analysis.description and analysis.description.captions:
        return analysis.description.captions[0].text.lower()

    # Check tags
    if analysis.tags:
        sorted_tags = sorted(analysis.tags, key=lambda t: t.confidence, reverse=True)
        for tag in sorted_tags:
            if tag.name.lower() not in ["person", "human", "grass", "indoor", "outdoor"]:
                return tag.name.lower()

    return "animal"

def generate_story(subject):
    """Generate a concise, engaging story with a fun fact about the subject."""
    
    prompt = f"""Write a very short, fun, and engaging story (max 2-4 sentences) about {subject}, 
    followed by an interesting fun fact. Make it heartwarming and attention-grabbing. 
    Format: [Story] [Fun Fact: your fact here]"""

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }

    data = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": "You are a creative storyteller who specializes in short, engaging pet and animal stories with interesting facts. Keep stories brief and fun."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 1.5,
        "max_tokens": 100,  # Reduced for shorter stories
        "stream": False
    }

    try:
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        story = response.json()["choices"][0]["message"]["content"]
        return story
    except Exception as e:
        print(f"DeepSeek API error: {str(e)}")
        return f"Meet this amazing {subject}! Every day brings a new adventure with this wonderful companion. Fun Fact: Did you know that {subject}s have unique personalities just like humans?"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port) 