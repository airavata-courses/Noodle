FROM openjdk:8-jdk
RUN mkdir session
RUN apt-get update
RUN apt-get install -y maven
COPY . /session
WORKDIR session
RUN mvn clean install -e
