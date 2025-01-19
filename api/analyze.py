import os
import base64
import io
import json
import requests
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

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

def handler(event, context):
    print("Handler started") # Debug log
    try:
        # Validate environment variables
        azure_key = os.environ.get('AZURE_COMPUTER_VISION_API_KEY')
        azure_endpoint = os.environ.get('AZURE_COMPUTER_VISION_ENDPOINT')
        
        print(f"Azure Key present: {bool(azure_key)}")
        print(f"Azure Endpoint present: {bool(azure_endpoint)}")
        
        if not azure_key or not azure_endpoint:
            raise ValueError("Missing required Azure credentials")

        # Parse request body
        print("Parsing request body")
        if not event.get('body'):
            raise ValueError("No request body provided")
            
        try:
            body = json.loads(event['body'])
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON body: {str(e)}")

        if 'image' not in body:
            raise ValueError("No image data in request body")

        # Initialize Azure client
        print("Initializing Azure client")
        client = ComputerVisionClient(
            endpoint=azure_endpoint,
            credentials=CognitiveServicesCredentials(azure_key)
        )
        
        # Process image
        print("Decoding image")
        try:
            image_data = base64.b64decode(body['image'])
        except Exception as e:
            raise ValueError(f"Invalid base64 image data: {str(e)}")
            
        image_stream = io.BytesIO(image_data)
        
        # Analyze with Azure
        print("Calling Azure API")
        analysis = client.analyze_image_in_stream(
            image_stream,
            visual_features=[VisualFeatureTypes.description]
        )
        
        if not analysis.description or not analysis.description.captions:
            raise ValueError("No description generated for the image")

        description = analysis.description.captions[0].text
        print(f"Analysis complete. Description: {description}")

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'description': description
            })
        }
            
    except Exception as e:
        error_message = str(e)
        print(f"Error in handler: {error_message}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': False,
                'error': error_message
            })
        } 