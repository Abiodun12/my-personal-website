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
from dashscope import MultiModalConversation

app = Flask(__name__)
# Enable CORS for all domains and routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

# API credentials
DASHSCOPE_API_KEY = os.getenv('DASHSCOPE_API_KEY')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
DEEPSEEK_MODEL = "deepseek-chat"

# Set DashScope base URL for international API
dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'

@app.route('/')
def home():
    return jsonify({"status": "ok", "message": "API is running"})

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze_image_route():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        if not request.is_json:
            return jsonify({
                "success": False,
                "error": "Request must be JSON",
                "result": None
            }), 400

        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({
                "success": False,
                "error": "No image provided",
                "result": None
            }), 400

        # Decode base64 image
        try:
            image_data = base64.b64decode(data['image'])
        except:
            return jsonify({
                "success": False,
                "error": "Invalid image data",
                "result": None
            }), 400

        # Analyze image
        result = analyze_image(image_data)
        
        # Always return JSON response
        return jsonify(result)

    except Exception as e:
        print(f"Error in route handler: {str(e)}")  # Log error but don't send in response
        return jsonify({
            "success": False,
            "error": "Server error",
            "result": None
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
    """Analyze image using DashScope MultiModal API"""
    try:
        # Convert image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        messages = [
            {
                "role": "user",
                "content": [
                    {"image": f"data:image/jpeg;base64,{image_base64}"},
                    {"text": "What is this? Give me just the subject name."}
                ]
            }
        ]

        response = MultiModalConversation.call(
            model='qwen-vl-plus',
            messages=messages,
            api_key=os.getenv('DASHSCOPE_API_KEY')
        )

        if response.status_code == 200:
            subject = response.output.choices[0].message.content[0].get('text', '').strip()
            # Clean up the subject to get just the main noun
            subject = subject.split()[0] if subject else "animal"
            
            return {
                "success": True,
                "result": {
                    "subject": subject,
                    "story": f"A wonderful {subject} brought joy to everyone today. Every {subject} has unique characteristics!"
                }
            }
        else:
            raise Exception(f"DashScope API error: {response.message}")

    except Exception as e:
        print(f"Error in analyze_image: {str(e)}")
        return {
            "success": False,
            "error": "Failed to analyze image",
            "result": None
        }

def generate_story(subject):
    """Generate a story about the identified subject."""
    try:
        prompt = f"Write a very short story (2-3 sentences) about this {subject}. Include one interesting fact. Format: [Story] [Fun Fact: ...]"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }

        data = {
            "model": DEEPSEEK_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a creative storyteller. Always respond in this format: [Story] ... [Fun Fact: ...]"
                },
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,  # Lower temperature for more consistent formatting
            "max_tokens": 150,
            "stream": False
        }

        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=10
        )

        if response.status_code == 200:
            story = response.json()["choices"][0]["message"]["content"]
            # Ensure story has correct format
            if not story.startswith("[Story]"):
                story = f"[Story] {story}"
            if "[Fun Fact:" not in story:
                story = f"{story} [Fun Fact: {subject}s are fascinating creatures!]"
            return story
        else:
            # Fallback story with guaranteed format
            return f"[Story] A wonderful {subject} brought joy to everyone today. [Fun Fact: Every {subject} has unique characteristics!]"

    except Exception as e:
        print(f"Story generation error: {str(e)}")
        # Fallback story with guaranteed format
        return f"[Story] A wonderful {subject} brought joy to everyone today. [Fun Fact: Every {subject} has unique characteristics!]"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port) 