FROM python:3.7.5-slim
RUN pip install virtualenv
RUN virtualenv retrieve
COPY . /retrieve
WORKDIR /retrieve
RUN pip install numpy
RUN pip install --upgrade -r requirements.txt 
