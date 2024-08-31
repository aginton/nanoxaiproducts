# Use the official Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use the official OpenJDK image to run the application
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose the application port and debug port
EXPOSE 8080 5005

# Set JAVA_OPTS environment variable to include remote debugging options
ENV JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"

# Run the application with remote debugging enabled
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

