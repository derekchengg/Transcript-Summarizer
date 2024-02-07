# app/__init__.py
from flask import Flask
from .routes import main
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.register_blueprint(main)

    return app
