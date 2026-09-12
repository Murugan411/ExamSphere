FROM tomcat:10.1-jdk21-temurin

RUN rm -rf /usr/local/tomcat/webapps/ROOT

COPY WebContent /usr/local/tomcat/webapps/ExamSphere

COPY lib/*.jar /usr/local/tomcat/lib/

COPY src /tmp/src

WORKDIR /tmp/src

RUN mkdir -p /tmp/classes && \
    find . -name "*.java" > /tmp/sources.txt && \
    javac \
    -cp "/usr/local/tomcat/lib/*" \
    -d /tmp/classes \
    @/tmp/sources.txt

RUN mkdir -p /usr/local/tomcat/webapps/ExamSphere/WEB-INF/classes && \
    cp -r /tmp/classes/* /usr/local/tomcat/webapps/ExamSphere/WEB-INF/classes/
EXPOSE 10000

CMD ["sh", "-c", "echo '=== ExamSphere container starting ==='; echo PORT=$PORT; echo '=== Tomcat version ==='; /usr/local/tomcat/bin/catalina.sh version; echo '=== Starting Tomcat ==='; exec /usr/local/tomcat/bin/catalina.sh run"]