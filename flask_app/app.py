from services import simulated_db, hash_password, verify_password
from flask import session
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    email = ''
    stayConnected = False
    if request.method == 'POST':
        if request.form.get('forgot'):
            email = request.form.get('email', '')
            # Simular envío de email de recuperación
            error = 'Se ha enviado un enlace de recuperación a tu email.'
        else:
            email = request.form.get('email', '')
            password = request.form.get('password', '')
            stayConnected = bool(request.form.get('stayConnected'))
            user = next((u for u in simulated_db['usuarios'] if u['email'] == email), None)
            if not user or not verify_password(password, user['passwordHash']):
                error = 'Credenciales incorrectas.'
            else:
                session['user_id'] = user['id']
                session['user_email'] = user['email']
                return redirect(url_for('index'))
    return render_template('login.html', error=error, email=email, stayConnected=stayConnected)

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    name = ''
    email = ''
    if request.method == 'POST':
        name = request.form.get('name', '')
        email = request.form.get('email', '')
        password = request.form.get('password', '')
        confirmPassword = request.form.get('confirmPassword', '')
        if password != confirmPassword:
            error = 'Las contraseñas no coinciden.'
        elif len(password) < 6:
            error = 'La contraseña debe tener al menos 6 caracteres.'
        elif any(u['email'] == email for u in simulated_db['usuarios']):
            error = 'El email ya está registrado.'
        else:
            new_user = {
                'id': str(uuid.uuid4()),
                'nombre': name,
                'email': email,
                'passwordHash': hash_password(password),
                'createdAt': None,
                'lastLogin': None
            }
            simulated_db['usuarios'].append(new_user)
            session['user_id'] = new_user['id']
            session['user_email'] = new_user['email']
            return redirect(url_for('index'))
    return render_template('register.html', error=error, name=name, email=email)
from flask import Flask, render_template, redirect, url_for, request, session
from services import generate_questions

app = Flask(__name__)
app.secret_key = 'your_secret_key'


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/exam', methods=['GET', 'POST'])
def exam_form():
    error = None
    topic = ''
    questionType = 'opcion_multiple'
    count = 5
    touched = False
    questions = None
    if request.method == 'POST':
        topic = request.form.get('topic', '')
        questionType = request.form.get('questionType', 'opcion_multiple')
        try:
            count = int(request.form.get('count', 5))
        except ValueError:
            count = 5
        touched = True
        if not topic:
            error = 'Ingrese un tema.'
        elif count < 1 or count > 50:
            error = 'Número de preguntas entre 1 y 50.'
        else:
            questions = generate_questions(topic, questionType, count)
            # Aquí podrías redirigir o mostrar las preguntas
            return render_template('questions.html', questions=questions)
    return render_template('exam_form.html', error=error, topic=topic, questionType=questionType, count=count, touched=touched)

# Aquí se agregarán más rutas y lógica

if __name__ == '__main__':
    app.run(debug=True)
