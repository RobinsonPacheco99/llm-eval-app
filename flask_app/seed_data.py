import uuid
from werkzeug.security import generate_password_hash

test_user = {
    'id': str(uuid.uuid4()),
    'nombre': 'Usuario de Prueba',
    'email': 'test@ejemplo.com',
    'passwordHash': generate_password_hash('password123'),
    'createdAt': None,
    'lastLogin': None
}

def initialize_test_data(db):
    # Verifica si ya existe el usuario de prueba
    if not any(u['email'] == test_user['email'] for u in db['usuarios']):
        db['usuarios'].append(test_user)
