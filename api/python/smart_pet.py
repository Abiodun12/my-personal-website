from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from dotenv import load_dotenv
import requests
import json
import datetime
import re
import dashscope
from dashscope import MultiModalConversation
import keep_alive

app = Flask(__name__)
# Enable CORS for all domains and routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

# API credentials
DASHSCOPE_API_KEY = os.getenv('DASHSCOPE_API_KEY')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
DEEPSEEK_MODEL = "deepseek-chat"

# Set DashScope base URL
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
            response = jsonify({
                "success": False,
                "error": "Request must be JSON",
                "result": None
            })
            response.headers['Content-Type'] = 'application/json'
            return response, 400

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
        try:
            result = analyze_image(image_data)
            response = jsonify(result)
            response.headers['Content-Type'] = 'application/json'
            return response
        except Exception as e:
            response = jsonify({
                "success": False,
                "error": str(e),
                "result": None
            })
            response.headers['Content-Type'] = 'application/json'
            return response, 500

    except Exception as e:
        response = jsonify({
            "success": False,
            "error": str(e),
            "result": None
        })
        response.headers['Content-Type'] = 'application/json'
        return response, 500

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

def generate_story_with_deepseek(subject):
    """Generate story using DeepSeek API"""
    try:
        # Clean the subject
        clean_subject = re.sub(r"^(a|an|the)\s+", "", subject, flags=re.IGNORECASE).split(',')[0].split('.')[0].strip()
        
        url = "https://api.deepseek.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        prompt = f"Write a creative 3-sentence story about a {clean_subject}, followed by an interesting fun fact. Use this format exactly: [Story] ... [Fun Fact: ...]"
        
        data = {
            "model": DEEPSEEK_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a creative storyteller who writes engaging stories about anything in images."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            story = response.json()['choices'][0]['message']['content'].strip()
            # Ensure proper formatting
            if not story.startswith('[Story]'):
                story = f"[Story] {story}"
            if '[Fun Fact:' not in story:
                story = f"{story} [Fun Fact: {clean_subject}s are fascinating in many ways!]"
            return story
        else:
            return f"[Story] A {clean_subject} had an incredible adventure today. Everyone was amazed by its presence. It brought joy to all who encountered it. [Fun Fact: {clean_subject}s can be found in many places around the world!]"

    except Exception as e:
        print(f"Story generation error: {str(e)}")
        return f"[Story] A {clean_subject} had an incredible adventure today. Everyone was amazed by its presence. It brought joy to all who encountered it. [Fun Fact: {clean_subject}s can be found in many places around the world!]"

def analyze_image(image_data):
    """Analyze image using DashScope for subject identification, then DeepSeek for story"""
    try:
        print("Starting image analysis...")
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Enhanced prompt for better subject identification and breed detection
        messages = [
            {
                "role": "user",
                "content": [
                    {"image": f"data:image/jpeg;base64,{image_base64}"},
                    {"text": "What exactly is in this image? If it's an animal, please identify the specific breed or species. Be precise but concise with your answer (1-5 words)."}
                ]
            }
        ]

        response = MultiModalConversation.call(
            model='qwen-vl-plus',
            messages=messages,
            api_key=DASHSCOPE_API_KEY
        )

        if response.status_code == 200:
            # Extract and clean subject
            subject = response.output.choices[0].message.content[0].get('text', '').strip()
            print(f"Extracted subject: {subject}")
            
            # Clean up the subject for better story generation
            subject = re.sub(r"^(a|an|the)\s+", "", subject, flags=re.IGNORECASE)
            subject = subject.split('.')[0].split(',')[0].strip()
            
            if not subject:
                return {
                    "success": False,
                    "error": "Could not identify subject in image",
                    "result": None
                }
            
            # Generate story using DeepSeek
            story = generate_story_with_deepseek(subject)
            print(f"Generated story: {story}")
            
            return {
                "success": True,
                "error": None,
                "result": {
                    "subject": subject,
                    "story": story
                }
            }
        else:
            return {
                "success": False,
                "error": f"DashScope API error: {response.message}",
                "result": None
            }

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