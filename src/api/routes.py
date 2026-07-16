"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import create_access_token  # Importa esto arriba junto a los otros imports
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt  # 1. Importamos la librería de cifrado
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Blueprint('api', __name__)
CORS(api)

# Inicializamos Bcrypt pasándole la app de flask indirectamente o usándolo de forma directa:
bcrypt = Bcrypt()

# Ruta para cambiar de color y eliminar favoritos:


@api.route('/favorite/<string:pokemon_name>', methods=['DELETE'])
@jwt_required()
def delete_favorite(pokemon_name):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()

    # Buscamos el favorito específico de ese usuario y ese pokemon
    fav = Favorite.query.filter_by(
        user_id=user.id, pokemon_name=pokemon_name).first()

    if fav:
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Eliminado de favoritos"}), 200
    return jsonify({"msg": "No encontrado"}), 404


@api.route('/favorite', methods=['POST'])
# Protegemos la ruta para que solo usuarios logueados puedan guardar favoritos
@jwt_required()
def add_favorite():
    body = request.get_json()
    email = get_jwt_identity()  # Obtenemos el email del usuario logueado desde el token

    # Buscamos al usuario en la DB
    user = User.query.filter_by(email=email).first()

    # Creamos el nuevo favorito
    new_favorite = Favorite(
        user_id=user.id,
        pokemon_name=body["pokemon_name"]
    )

    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"msg": "Pokémon añadido a favoritos"}), 201


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()

    if "email" not in body or "password" not in body:
        return jsonify({"msg": "Email y contraseña son obligatorios"}), 400

    # 1. Buscamos el usuario por email
    user = User.query.filter_by(email=body["email"]).first()

    # 2. Si no existe o la contraseña no coincide
    if user is None or not bcrypt.check_password_hash(user.password, body["password"]):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401

    # 3. Creamos el token de acceso
    access_token = create_access_token(identity=user.email)

    return jsonify({"access_token": access_token, "msg": "Login exitoso"}), 200


@api.route('/signup', methods=['POST'])
def handle_signup():
    # 2. Recibimos los datos que nos envía React (en formato JSON)
    body = request.get_json()

    # Validación: Nos aseguramos de que envíen todos los campos obligatorios
    if body is None:
        return jsonify({"msg": "Body cannot be empty"}), 400
    if "email" not in body or "password" not in body or "username" not in body:
        return jsonify({"msg": "Email, password and username are required"}), 400

    # 3. Verificar si el usuario o el email ya existen en la base de datos
    user_exists = User.query.filter_by(email=body["email"]).first()
    username_exists = User.query.filter_by(username=body["username"]).first()

    if user_exists or username_exists:
        return jsonify({"msg": "El usuario o el email ya están registrados"}), 400

    # 4. ¡CIFRAMOS LA CONTRASEÑA!
    # Generamos un 'hash' seguro a partir del texto plano que envió el usuario
    hashed_password = bcrypt.generate_password_hash(
        body["password"]).decode('utf-8')

    # 5. Creamos el nuevo usuario con la contraseña cifrada
    new_user = User(
        username=body["username"],
        email=body["email"],
        password=hashed_password,  # Guardamos el hash, no la contraseña real
        is_active=True
    )

    # 6. Guardamos en la base de datos
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "¡Entrenador registrado con éxito!"}), 201


@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    # Obtenemos los nombres de los pokemones favoritos de este usuario
    favorites = [fav.pokemon_name for fav in user.favorites]
    return jsonify(favorites), 200
