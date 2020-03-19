# base image 
FROM node:12

#set working directory 
RUN mkdir ui

#Copy files to docker
COPY . /ui
WORKDIR /ui
RUN  npm install
EXPOSE 3000

CMD [ "npm","start"]



