# AI-Powered Tweet Generator

This project is a Flask-based web application that leverages the Gemini API to analyze a brand's voice and automatically generate a batch of 10 on-brand tweets. It was built as an assignment for Walnut Folks.

## Approach & Methodology

### 1. Analyzing Brand Voice
When a user submits the form, the inputs—Brand Name, Industry, Campaign Objective, and a Description—are collected. 
Rather than creating separate rigid pipelines, this data is sent as context to the Gemini AI (using `gemini-1.5-flash` for high-speed text generation). The LLM infers the brand tone, target audience, and primary content themes.

### 2. Prompt Structure & Logic
We utilize a single, comprehensive Prompt Template using Zero-Shot prompting with strict formatting constraints:
- **Role Definition:** The AI is assigned the persona of an "expert Social Media Strategist and Copywriter."
- **Context Injection:** The user's input is securely interpolated into the prompt.
- **Task Segregation:** The prompt explicitly asks for two tasks:
  - Task 1: Voice Analysis (tone, audience, themes).
  - Task 2: Content Generation (exactly 10 tweets across varying specified styles).
- **JSON Formatting Enforcement:** To ensure the frontend can reliably parse and render the output, the prompt features a 'CRITICAL INSTRUCTION' enforcing a strict JSON output schema without markdown wrapping.

### 3. Tools Used
- **Backend Framework:** Python / Flask
- **AI Model:** Google Gemini API (`gemini-1.5-flash`) via `google-generativeai` SDK
- **Frontend:** HTML5, Vanilla CSS (with modern aesthetics like glassmorphism and CSS grid/flexbox), Vanilla JavaScript (Fetch API for async requests)
- **Icons:** Feather Icons

## How to Run Locally

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate the virutal environment: `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Ensure your `.env` file contains your Gemini API key: `GOOGLE_API_KEY=your_key_here`
6. Run the application: `python app.py`
7. Navigate to `http://127.0.0.1:5000` in your browser.