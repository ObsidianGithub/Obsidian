from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'video' not in request.files:
        return redirect(url_for('index'))

    video = request.files['video']
    if video.filename == '':
        return redirect(url_for('index'))

    # Save the uploaded video
    video.save(os.path.join(app.config['UPLOAD_FOLDER'], video.filename))

    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run()
