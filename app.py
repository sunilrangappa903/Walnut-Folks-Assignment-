import os
import json
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini AI
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")
genai.configure(api_key=api_key)

# We use gemini-2.5-flash for text generation tasks where speed is important
model = genai.GenerativeModel('gemini-2.5-flash')

PROMPT_TEMPLATE = """
You are an expert Social Media Strategist and Copywriter.

Analyze the following brand details and generate a brand voice analysis and 10 tweets.

Brand Details:
- Brand Name: {brand_name}
- Industry/Category: {industry}
- Campaign Objective: {objective}
- Additional Description/Products: {description}

Task 1: Brand Voice Analysis
Determine the brand's tone, target audience, and primary content themes. 

Task 2: Content Generation
Write exactly 10 high-quality tweets based on the brand details and voice analysis. Ensure a mix of styles: engaging/conversational, promotional, witty/meme-style, and informative/value-driven. The content MUST be highly relevant to the brand and objective.

CRITICAL INSTRUCTIONS:
You MUST respond strictly with valid, parseable JSON and nothing else. DO NOT wrap the response in markdown code blocks like ```json ... ```. The JSON object should have the following structure:
{{
  "brand_voice_summary": [
    "Bullet point 1 about tone",
    "Bullet point 2 about audience",
    "Bullet point 3 about themes"
  ],
  "tweets": [
    {{
      "style": "engaging",
      "text": "Tweet text here without quotes..."
    }},
    ...9 more tweets...
  ]
}}
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_tweets():
    try:
        data = request.json
        brand_name = data.get('brandName', 'Unknown Brand')
        industry = data.get('industry', 'General')
        objective = data.get('objective', 'Brand Awareness')
        description = data.get('description', '')

        prompt = PROMPT_TEMPLATE.format(
            brand_name=brand_name,
            industry=industry,
            objective=objective,
            description=description
        )

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up potential markdown formatting from Gemini
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        response_text = response_text.strip()

        # Parse JSON
        result = json.loads(response_text)
        return jsonify(result), 200

    except Exception as e:
        print(f"Error generating tweets: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
