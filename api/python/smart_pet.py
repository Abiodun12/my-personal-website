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
        print("Received analyze request") # Debug log
        if not request.is_json:
            print("Request is not JSON") # Debug log
            return jsonify({
                "success": False,
                "error": "Request must be JSON",
                "result": None
            }), 400

        data = request.get_json()
        print("Request data received") # Debug log
        
        if 'image' not in data:
            print("No image in request") # Debug log
            return jsonify({
                "success": False,
                "error": "No image provided",
                "result": None
            }), 400

        # Decode base64 image
        try:
            image_data = base64.b64decode(data['image'])
            print("Image decoded successfully") # Debug log
        except:
            print("Failed to decode image") # Debug log
            return jsonify({
                "success": False,
                "error": "Invalid image data",
                "result": None
            }), 400

        # Analyze image
        result = analyze_image(image_data)
        print(f"Analysis result: {result}") # Debug log
        
        # Always return JSON response with consistent structure
        response = jsonify(result)
        print(f"Sending response: {response.get_data(as_text=True)}") # Debug log
        return response

    except Exception as e:
        print(f"Error in route handler: {str(e)}") # Debug log
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

def generate_story(subject):
    """Generate a creative story about the identified subject using DashScope"""
    try:
        # Clean the subject input
        clean_subject = subject.replace("The image shows a ", "").replace("a ", "").split(".")[0].strip()
        
        messages = [
            {
                "role": "system",
                "content": f"You are a creative storyteller. Write engaging short stories about {clean_subject} in this format: [Story] ... [Fun Fact: ...]"
            },
            {
                "role": "user",
                "content": f"Write a 3-sentence engaging story about a {clean_subject}. Include one interesting fun fact. Use exactly this format: [Story] ... [Fun Fact: ...]"
            }
        ]

        response = MultiModalConversation.call(
            model='qwen-plus',  # Using text model for story generation
            messages=messages,
            api_key=os.getenv('DASHSCOPE_API_KEY')
        )

        if response.status_code == 200:
            story = response.output.choices[0].message.content.strip()
            # Ensure proper formatting
            if not story.startswith('[Story]'):
                story = f"[Story] {story}"
            if '[Fun Fact:' not in story:
                story = f"{story} [Fun Fact: {clean_subject}s have fascinating abilities!]"
            return story
        else:
            return f"[Story] A curious {clean_subject} explored their world today, bringing smiles to everyone around them. [Fun Fact: {clean_subject}s are known for their remarkable intelligence and adaptability!]"

    except Exception as e:
        print(f"Story generation error: {str(e)}")
        return f"[Story] A curious {clean_subject} explored their world today, bringing smiles to everyone around them. [Fun Fact: {clean_subject}s are known for their remarkable intelligence and adaptability!]"

def analyze_image(image_data):
    """Analyze image using DashScope MultiModal API"""
    try:
        print("Starting image analysis...")
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        messages = [
            {
                "role": "user",
                "content": [
                    {"image": f"data:image/jpeg;base64,{image_base64}"},
                    {"text": "What animal or pet is shown in this image? Give me a specific but concise answer."}
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
            print(f"Extracted subject: {subject}")
            
            # Generate a story using DashScope
            story = generate_story(subject)
            print(f"Generated story: {story}")
            
            result = {
                "success": True,
                "result": {
                    "subject": subject,
                    "story": story
                }
            }
            print(f"Returning result: {result}")
            return result
        else:
            raise Exception(f"DashScope API error: {response.message}")

    except Exception as e:
        print(f"Error in analyze_image: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "result": None
        }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port) 