import openai
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "fallback_default_key")

# Function to generate GPT response
def generate_gpt_response(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": "You are a helpful AI assistant."},
                      {"role": "user", "content": prompt}],
            api_key=OPENAI_API_KEY
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error: {str(e)}"

# Home Route
@app.route('/')
def home():
    return render_template('index.html')

# API Endpoint for Chatbot
@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_input = data.get("message", "")
    response = generate_gpt_response(user_input)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
