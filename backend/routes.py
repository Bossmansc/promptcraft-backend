import os
from flask import Blueprint, request, jsonify
from models import db, PromptHistory
from openai import OpenAI

api_bp = Blueprint('api', __name__)

def get_ai_client():
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        return None
    try:
        # We explicitly disable proxies implicitly to avoid environment conflicts if needed,
        # but usually just updating the library version fixes it.
        return OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
    except Exception as e:
        print(f"Warning: Failed to initialize AI client: {e}")
        return None

def generate_with_ai(user_input, stack_pref, style_pref):
    client = get_ai_client()
    if not client:
        return "Error: DEEPSEEK_API_KEY not configured or Client init failed.", "Error", "Error"

    system_prompt = f"""
    You are 'CodeCraft AI', an expert software architect. 
    Your goal is to transform casual user requests into professional, structured development prompts.
    
    Output Format Requirements:
    - Project Name: [Creative Name]
    - Goal: [Refined goal]
    - Stack Level: [Specific Stack]
    - Visual Style: [Specific Style]
    - Key Features: [List of 3-5 core technical features]
    
    Configuration Constraints:
    - User Preference for Stack: {stack_pref} (If 'Auto-Infer', choose based on complexity).
    - User Preference for Style: {style_pref} (If 'Auto-Infer', choose based on vibe).
    """

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Request: {user_input}"}
            ],
            stream=False
        )
        content = response.choices[0].message.content
        
        final_stack = stack_pref if stack_pref != "Auto-Infer" else "AI Inferred"
        final_style = style_pref if style_pref != "Auto-Infer" else "AI Inferred"
        
        return content, final_stack, final_style
        
    except Exception as e:
        return f"API Error: {str(e)}", "Error", "Error"

# Fallback logic if no API key is present
def generate_fallback(text, stack, style):
    return f"""Project Name: Local Fallback
    
Goal: {text}
Stack: {stack}
Style: {style}

(DeepSeek API Key missing or Client Error. Add DEEPSEEK_API_KEY to .env to enable AI generation.)""", stack, style

@api_bp.route('/generate', methods=['POST'])
def generate():
    data = request.json
    user_input = data.get('inputText', '')
    stack_pref = data.get('selectedStack', 'Auto-Infer')
    style_pref = data.get('selectedStyle', 'Auto-Infer')
    
    # Try to generate with AI if key exists
    if os.environ.get("DEEPSEEK_API_KEY"):
        generated_text, stack, style = generate_with_ai(user_input, stack_pref, style_pref)
        # If the AI function returned an error message starting with Error/API Error, allow fallback?
        # For now, we accept the error message as the output.
    else:
        generated_text, stack, style = generate_fallback(user_input, stack_pref, style_pref)
    
    # Save to history
    history_item = PromptHistory(
        user_input=user_input,
        generated_prompt=generated_text,
        stack_type=stack,
        style_type=style
    )
    db.session.add(history_item)
    db.session.commit()
    
    return jsonify({
        'generatedPrompt': generated_text,
        'inferredStack': stack,
        'inferredStyle': style,
        'historyItem': history_item.to_dict()
    })

@api_bp.route('/history', methods=['GET'])
def get_history():
    items = PromptHistory.query.order_by(PromptHistory.created_at.desc()).limit(20).all()
    return jsonify([item.to_dict() for item in items])

@api_bp.route('/history/<int:id>', methods=['DELETE'])
def delete_history(id):
    item = PromptHistory.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Deleted successfully'})
