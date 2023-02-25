#!/usr/bin/python3
from PyPDF2.errors import PdfReadError
from flask import Flask, render_template, request, send_from_directory, make_response
from io import BytesIO
import gtts
from PyPDF2 import PdfReader
import os
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')


@app.route("/", methods=['POST', 'GET'])
def home():
    error = None
    if request.method == 'POST':
        try:
            # Deletes previously created mp3 file
            current_directory = os.getcwd()
            files_in_dir = os.listdir()
            for file in files_in_dir:
                if file == "sinework.mp3":
                    os.remove(file)
            # Gets string from uploaded PDF
            pdf_file = request.files['file']
            bytes_file = BytesIO(pdf_file.read())
            pdf_string = ""
            reader = PdfReader(bytes_file)
            number_of_pages = len(reader.pages)
            for number in range(number_of_pages):
                page = reader.pages[number]
                pdf_string += page.extract_text()
            # Creates mp3 file from string
            tts = gtts.gTTS(pdf_string)
            tts.save("sinework.mp3")
            response = make_response(send_from_directory(current_directory, "sinework.mp3", as_attachment=True))
            # Set cookie for displaying loading animation before download start
            now = datetime.now()
            after_20_seconds = now + timedelta(seconds=20)
            response.set_cookie(key="downloadStarted", value="1", expires=after_20_seconds)
            return response
        except PdfReadError:
            error = "Upload your PDF file first"
            return render_template("index.html", error=error)
    else:
        return render_template("index.html", error=error)


if __name__ == "__main__":
    app.run()
