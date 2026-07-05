# Use an official Maven image to build the app
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# In a real environment, you'd copy pom.xml and source code here and run `mvn clean package`
# COPY pom.xml .
# COPY src ./src
# RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar (Assuming target/*.jar exists after build)
# COPY --from=build /app/target/*.jar app.jar
# For demonstration, we'll just write the command
# ENTRYPOINT ["java", "-jar", "app.jar"]

# Simulated for deployment instructions
EXPOSE 8080
ENV SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/learnpilot

CMD ["echo", "Backend ready for deployment. Refer to README.md for build instructions."]
