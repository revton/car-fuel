#!/bin/bash
# Runs backend with hot reload (Spring Boot DevTools)
# Must be run from project root
./gradlew bootRun --continuous -Pargs="--spring.profiles.active=dev"
