FROM python:3.7.5-slim
RUN pip install virtualenv
RUN virtualenv model 
COPY . /model
WORKDIR /model
RUN pip install numpy
RUN pip install --upgrade -r requirements.txt 
CMD ["sh","-c","ls && python app.py db init && python app.py db migrate && python app.py db upgrade && python app.py execute_model"]
    
