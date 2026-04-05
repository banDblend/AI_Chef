import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure the API securely
api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    ingredients = data.get('ingredients', '').strip()

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are an expert, friendly chef. I have the following ingredients: {ingredients}.
        Please suggest a delicious recipe I can make with these (it's okay if I need a few basic pantry staples like salt, pepper, or oil).
        
        Format the response in Markdown:
        # Recipe Name
        *Brief Description*
        
        ## Ingredients
        - ingredient 1
        - ingredient 2
        
        ## Instructions
        1. Step 1
        2. Step 2
        """

        response = model.generate_content(prompt)
        return jsonify({"recipe": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
