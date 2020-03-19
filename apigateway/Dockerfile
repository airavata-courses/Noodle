# base image 
FROM node:12

#set working directory 
RUN mkdir apigate

#Copy files to docker
COPY . /apigate
WORKDIR /apigate

RUN  npm install
EXPOSE 5050
CMD [ "node","server.js"]