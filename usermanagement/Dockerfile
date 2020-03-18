# base image 
FROM node:12

#set working directory 
RUN mkdir userman

#Copy files to docker
COPY . /userman
WORKDIR /userman

RUN  npm install
EXPOSE 5000

CMD [ "npm","server.js"]