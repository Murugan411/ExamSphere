FROM tomcat:10.1-jdk21-temurin

RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Backend web files
COPY backend/WebContent /usr/local/tomcat/webapps/ExamSphere

# Frontend
COPY frontend /usr/local/tomcat/webapps/ExamSphere

# JDBC libraries
COPY backend/lib/*.jar /usr/local/tomcat/lib/

# Java source code
COPY backend/src /tmp/src

WORKDIR /tmp/src

# Compile Java servlets
RUN mkdir -p /tmp/classes && \
    find . -name "*.java" > /tmp/sources.txt && \
    javac \
    -cp "/usr/local/tomcat/lib/*" \
    -d /tmp/classes \
    @/tmp/sources.txt

# Copy compiled Java classes
RUN mkdir -p /usr/local/tomcat/webapps/ExamSphere/WEB-INF/classes && \
    cp -r /tmp/classes/* /usr/local/tomcat/webapps/ExamSphere/WEB-INF/classes/

EXPOSE 10000

CMD ["sh", "-c", "echo 'Starting ExamSphere Tomcat...'; echo \"Render PORT = ${PORT:-10000}\"; sed -i \"s/port=\\\"8080\\\"/port=\\\"${PORT:-10000}\\\"/\" /usr/local/tomcat/conf/server.xml; echo 'Tomcat connector configured'; exec catalina.sh run"]