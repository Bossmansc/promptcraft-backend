import os
from flask import Flask
from flask_cors import CORS
from models import db
from routes import api_bp
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    # Render provides DATABASE_URL if you add a Postgres DB. 
    # Otherwise it falls back to SQLite.
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///promptcraft.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize Extensions
    CORS(app)
    db.init_app(app)
    
    # Register Blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Create DB tables
    with app.app_context():
        db.create_all()
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
