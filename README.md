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
1. `$ sudo npm install bower -g`
1. `$ bower install`
1. Get your [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key#key).
1. If you plan to deploy to Cloud Foundry, get the [cf CLI](https://github.com/cloudfoundry/cli) for your platform

## To build the project:
1. Edit the `./app/index.html` file, replacing `MY_GOOGLE_API_KEY` with your Google Maps API key (see above)
1. `$ grunt clean build`
1. `$ ./gradlew clean assemble`
1. If you want to run locally, you will need a running [Redis](http://redis.io/download#installation), on _localhost_
1. The app can be run locally using the Spring Boot _über JAR_: `$ java -jar build/libs/IoTConnectedCarEmulator.jar`
1. If running locally, the dashboard is accessible here: [http://localhost:8080/](http://localhost:8080/)
1. Click the blue right arrow icon near the top to start it, or use one of the others to speed it up, rewind, etc.
1. If you omitted the Google Maps API key step, you might get an "_Oops! Something went wrong_" error, with some additional detail, but no map.  In this case, repeat the above build steps, ensuring you do that replacement in `index.html`.

## To deploy on Pivotal Cloud Foundry:
1. Have a look at and, if necessary, edit the [manifest](./manifest.yml).  Note that the `redis` service there corresponds with the _redis_ service you create in the next step.
1. `$ cf create-service <redis service> <plan> redis` (e.g. `cf create-service rediscloud 30mb redis`)
1. `$ cf push`
1. `$ cf apps` will show your deployed apps, including the URL for this app

## Develop locally (iterate rapidly on HTML and Javascript changes)
1. `$ ./gradlew bootrun` Start the Spring Boot App up
1. `$ grunt serve` Start the local server with LiveReload enabled

## References
* [Yeoman](http://yeoman.io/)
* [AngularJS](https://angularjs.org/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Pivotal Cloud Foundry](http://pivotal.io/platform-as-a-service/pivotal-cloud-foundry)


