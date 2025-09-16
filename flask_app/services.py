import uuid
import random
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from seed_data import initialize_test_data, test_user

# Base de datos simulada en memoria
simulated_db = {
    'usuarios': [],
    'sesiones': [],
    'reset_password': []
}

def load_from_storage():
    # En Flask, podrías usar archivos o una base real. Aquí solo memoria.
    pass

def save_to_storage():
    pass

# Inicializar datos de prueba
initialize_test_data(simulated_db)

# Función para hashear contraseña
def hash_password(password):
    return generate_password_hash(password)

# Función para verificar contraseña
def verify_password(password, hash):
    return check_password_hash(hash, password)

# Generador de preguntas
def generate_questions(tema, tipo, cantidad):
    difficulties = ['facil', 'media', 'dificil']
    base_options = [
        ['A', 'B', 'C', 'D'],
        ['Verdadero', 'Falso'],
        ['Patrón 1', 'Patrón 2', 'Patrón 3', 'Patrón 4']
    ]
    options_by_type = {
        'opcion_multiple': base_options[0],
        'verdadero_falso': base_options[1],
        'matriz_logica': base_options[2]
    }
    def make_question(i):
        opciones = list(options_by_type.get(tipo, base_options[0]))
        return {
            'id': f"temp-{int(datetime.datetime.now().timestamp())}-{i}",
            'pregunta': f"({tema}) Pregunta de tipo {tipo} #{i + 1}",
            'opciones': opciones,
            'respuesta_correcta': opciones[0],
            'tipo': tipo,
            'tema': tema,
            'dificultad': random.choice(difficulties),
            'fecha_creacion': datetime.datetime.now().isoformat(),
            'fecha_ultimo_uso': None,
            'imagenUrl': f"https://picsum.photos/seed/{tema}-{i}/640/360" if tipo == 'matriz_logica' else None,
            'descripcion_logica': 'Relación visual entre patrones.' if tipo == 'matriz_logica' else None
        }
    return [make_question(i) for i in range(cantidad)]
