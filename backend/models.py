from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class PromptHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text, nullable=False)
    generated_prompt = db.Column(db.Text, nullable=False)
    stack_type = db.Column(db.String(50))
    style_type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_input': self.user_input,
            'generated_prompt': self.generated_prompt,
            'stack_type': self.stack_type,
            'style_type': self.style_type,
            'created_at': self.created_at.isoformat()
        }
