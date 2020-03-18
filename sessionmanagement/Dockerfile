FROM openjdk:8-jdk
RUN mkdir session
RUN apt-get update
RUN apt-get install -y maven
COPY . /session
WORKDIR session
RUN mvn clean install -e

CMD ["sh", "-c", "java -jar target/session-management-0.0.1-SNAPSHOT.jar"]