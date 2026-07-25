"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint, request, jsonify
from api.models import db, Favorite, User
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
api = Blueprint('api', __name__)

# RUTA DE REGISTRO


@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if not email or not password or not username:
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    # Comprobar si el usuario ya existe
    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Cifrar la contraseña antes de guardarla
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Usuario registrado con éxito"}), 200

# RUTA DE LOGIN


@api.route("/login", methods=["POST"])
def login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email).first()

    # Verificamos la contraseña cifrada
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": access_token}), 200

    return jsonify({"msg": "Email o contraseña incorrectos"}), 401


@api.route("/favorite/<string:pokemon_name>", methods=["POST", "DELETE"])
@jwt_required()
def handle_favorite(pokemon_name):
    user_id = get_jwt_identity()

    if request.method == "POST":
        # Lógica para añadir favorito
        new_fav = Favorite(user_id=user_id, pokemon_name=pokemon_name)
        db.session.add(new_fav)
        db.session.commit()
        return jsonify({"msg": "Favorito añadido"}), 200

    if request.method == "DELETE":
        # Lógica para eliminar favorito
        fav = Favorite.query.filter_by(
            user_id=user_id, pokemon_name=pokemon_name).first()
        if fav:
            db.session.delete(fav)
            db.session.commit()
            return jsonify({"msg": "Favorito eliminado"}), 200
        return jsonify({"msg": "No encontrado"}), 404


# RUTA PARA OBTENER LOS FAVORITOS DEL USUARIO
@api.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    # Devolvemos una lista con los nombres de los pokémon
    list_favorites = [f.pokemon_name for f in favorites]
    return jsonify(list_favorites), 200

# RUTA PARA ELIMINAR EL USUARIO


@api.route("/user", methods=["DELETE"])
@jwt_required()
def delete_user():
    try:
        current_user_identity = get_jwt_identity()

        # Buscamos al usuario por ID o por Email según el token
        user = User.query.get(current_user_identity)
        if not user:
            user = User.query.filter_by(email=current_user_identity).first()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Borramos los favoritos asociados para que no bloqueen el borrado
        Favorite.query.filter_by(user_id=user.id).delete()

        db.session.delete(user)
        db.session.commit()

        return jsonify({"msg": "Usuario eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print("ERROR CRÍTICO AL BORRAR USUARIO:", str(e))
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500
