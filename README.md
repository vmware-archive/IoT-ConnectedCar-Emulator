# Connected Car Dashboard
This is the AngularJS based dashboard + Spring Boot based emulator.  A tour of the directories here:

 * `app` - The source code for the dashboard
 * `bower_components` - The bower dependencies
 * `node_modules` - Node.js dependencies
 * `config` - The configuration for the application
 * `src` - Java/Groovy source to execute this module as a Spring Boot application.
 * `test` - The test code for the application

## Initial Setup
Before you can build the project, need to make sure all dependencies are installed

1. Java 8
1. [Node.JS](https://nodejs.org/en/download/), a recent version (26 Sept. 2016: I used v5.7.1)
1. `$ npm install`
1. `$ bundle install` (is this fails, try `sudo gem install bundle`, then try again)
1. `$ bower install`

## Develop locally
1. `$ ./gradlew bootrun` Start the Spring Boot App up
1. `$ grunt serve` Start the local server with LiveReload enabled

## To build the project:
1. Execute a grunt build from the root of this module: `$ grunt clean build`.
1. From the root of the project, execute a gradle build:
    `$ ./gradlew clean assemble`
1. *If* you want to run locally, you will need a running Redis instance on _localhost_
1. The Spring Boot _über JAR_ can be found in the build/libs directory and can be launched
via `$ java -jar build/libs/IoTConnectedCarEmulator.jar`. (FIXME: as it exists today, this will fail)
1. The dashboard should be able accessible via [http://localhost:8080/](http://localhost:8080/)

## To deploy on Pivotal Cloud Foundry:
1. `$ cf create-service <redis service> <plan> redis`
1. `$ cf push -n <ROUTE-NAME>`

## References
* [Yeoman](http://yeoman.io/)
* [AngularJS](https://angularjs.org/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Pivotal Cloud Foundry](http://pivotal.io/platform-as-a-service/pivotal-cloud-foundry)

