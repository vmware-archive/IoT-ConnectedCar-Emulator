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

1. Java 8 JDK
1. [Node.JS](https://nodejs.org/en/download/), a recent version (26 Sept. 2016: I used v5.7.1)
1. `$ npm install`
1. `$ bundle install` (is this fails, try `sudo gem install bundle`, then try again)
1. `$ bower install`
1. Get your [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key#key)

## Develop locally
1. `$ ./gradlew bootrun` Start the Spring Boot App up
1. `$ grunt serve` Start the local server with LiveReload enabled

## To build the project:
1. Edit the `./app/index.html` file, replacing `MY_GOOGLE_API_KEY` with your Google Maps API key (see above)
1. `$ grunt clean build`.
1. `$ ./gradlew clean assemble`
1. If you want to run locally, you will need a running [Redis](http://redis.io/download#installation), on _localhost_
1. The app can be run locally using the Spring Boot _über JAR_: `$ java -jar build/libs/IoTConnectedCarEmulator.jar`
1. If running locally, the dashboard is accessible here: [http://localhost:8080/](http://localhost:8080/)

## To deploy on Pivotal Cloud Foundry:
1. `$ cf create-service <redis service> <plan> redis`
1. `$ cf push -n <ROUTE-NAME>`

## References
* [Yeoman](http://yeoman.io/)
* [AngularJS](https://angularjs.org/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Pivotal Cloud Foundry](http://pivotal.io/platform-as-a-service/pivotal-cloud-foundry)


