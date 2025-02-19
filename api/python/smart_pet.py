from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from dotenv import load_dotenv
import io
import requests
import dashscope
import json
import datetime

app = Flask(__name__)
# Enable CORS for all domains and routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

# API credentials
DASHSCOPE_API_KEY = os.getenv('DASHSCOPE_API_KEY')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
DEEPSEEK_MODEL = "deepseek-chat"

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
        print("Received request")
        data = request.get_json()
        
        if not data or 'image' not in data:
            print("No image in request")
            return jsonify({'error': 'No image found in request'}), 400

        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        
        # Analyze image with DashScope
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
        print(f"Error: {str(e)}")
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
    """Analyze image using DashScope Vision API"""
    try:
        # Create temporary file for image
        temp_path = "temp_image.jpg"
        with open(temp_path, "wb") as f:
            f.write(image_data)

        # Call DashScope API using MultiModalConversation for better analysis
        messages = [
            {
                "role": "user",
                "content": [
                    {"image": temp_path},
                    {"text": "What animal or pet do you see in this image? Give me just the name of the animal in one word."}
                ]
            }
        ]

        response = dashscope.MultiModalConversation.call(
            model='qwen-vl-max',
            api_key=DASHSCOPE_API_KEY,
            messages=messages
        )

        # Clean up temp file
        os.remove(temp_path)

        if response.status_code == 200:
            # Extract the animal name from the response
            description = response.output.choices[0].message.content[0]["text"]
            # Extract just the animal name using simple text processing
            animal_words = ["dog", "cat", "bird", "hamster", "rabbit", "fish", "parrot"]
            description_lower = description.lower()
            for animal in animal_words:
                if animal in description_lower:
                    return animal
            
            # If no specific animal found, return generic terms
            if any(word in description_lower for word in ["pet", "animal"]):
                return "pet"

        return "animal"

    except Exception as e:
        print(f"Error in image analysis: {str(e)}")
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