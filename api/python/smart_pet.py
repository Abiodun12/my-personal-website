from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from dotenv import load_dotenv
import io
import requests
import json
import datetime
import re
import dashscope

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
        print(f"Full error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred processing your request',
            'details': str(e)
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
        # Convert image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Set up DashScope API base URL
        dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'

        # First, determine if it's an animal
        messages = [
            {
                "role": "user",
                "content": [
                    {"image": f"data:image/jpeg;base64,{image_base64}"},
                    {"text": "Is this an animal? Answer with just 'yes' or 'no'."}
                ]
            }
        ]

        print("Checking if image contains an animal...")
        response = dashscope.MultiModalConversation.call(
            model='qwen-vl-max',
            api_key=DASHSCOPE_API_KEY,
            messages=messages,
            result_format='message'
        )

        if response.status_code == 200:
            is_animal = 'yes' in response.output.choices[0].message.content[0]["text"].lower()
            
            if is_animal:
                # If it's an animal, ask for specific breed identification
                messages = [
                    {
                        "role": "user",
                        "content": [
                            {"image": f"data:image/jpeg;base64,{image_base64}"},
                            {"text": "What breed of animal is this? Be specific and accurate. Give just the breed name."}
                        ]
                    }
                ]
            else:
                # If not an animal, ask for general object identification
                messages = [
                    {
                        "role": "user",
                        "content": [
                            {"image": f"data:image/jpeg;base64,{image_base64}"},
                            {"text": "What is this? Describe the main subject in one word."}
                        ]
                    }
                ]

            print("Getting detailed identification...")
            response = dashscope.MultiModalConversation.call(
                model='qwen-vl-max',
                api_key=DASHSCOPE_API_KEY,
                messages=messages,
                result_format='message'
            )
            
            print(f"API Response: {response}")

            if response.status_code == 200:
                text = response.output.choices[0].message.content[0]["text"].lower().strip()
                text = text.rstrip('.')
                print(f"Identified subject: {text}")
                return text

        return "unidentified object"

    except Exception as e:
        print(f"Detailed error in image analysis: {str(e)}")
        return "unidentified object"

def generate_story(subject):
    """Generate a story about the identified subject."""
    try:
        # Create a more flexible prompt based on the subject
        prompt = f"""Write a very short story (2-3 sentences) about this {subject}. 
        Include one interesting fact. Format: [Story] [Fun Fact: ...]"""

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }

        data = {
            "model": DEEPSEEK_MODEL,
            "messages": [
                {
                    "role": "system", 
                    "content": "You are a creative storyteller who specializes in engaging stories with interesting facts."
                },
                {"role": "user", "content": prompt}
            ],
            "temperature": 1.2,  # Increased for more creative stories
            "max_tokens": 150,
            "stream": False
        }

        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=10
        )
        
        response.raise_for_status()
        story = response.json()["choices"][0]["message"]["content"]
        return story

    except Exception as e:
        print(f"DeepSeek API error: {str(e)}")
        return f"A fascinating {subject} caught everyone's attention today. Its unique characteristics made it stand out. Fun Fact: Every {subject} has its own special story to tell!"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port) 