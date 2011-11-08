#!/bin/sh
export MAVEN_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
mvn clean jetty:run-exploded -Pmojarra