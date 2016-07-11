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
1. `$ npm install`
1. `$ bundle install`
1. `$ bower install`

## To build the project:
1. Execute a grunt build from the root of this module: `$ grunt clean build`.
1. From the root of the project, execute a gradle build:
    `$ ./gradlew clean build`
1. The Spring Boot über jar can be found in the build/libs directory and can be launched
via `$ java -jar build/libs/IoT-Dashboard.jar`.
1. The dashboard should be able to be viewed via [http://localhost:8080/index.html](http://localhost:8080/index.html)


## To deploy on Pivotal Cloud Foundry:

1. `$ cf push <APP-NAME> -p IoT-Dashboard/build/libs/IoT-Dashboard.jar -b https://github.com/cloudfoundry/java-buildpack.git --no-start`
2. `$ cf set-env <APP-NAME> JBP_CONFIG_OPEN_JDK_JRE '[version: 1.8.0_+, memory_heuristics: {heap: 85, stack: 10}]'`
3. `$ cf start <APP-NAME>`

## References
* [Yeoman](http://yeoman.io/)
* [AngularJS](https://angularjs.org/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Pivotal Cloud Foundry](http://pivotal.io/platform-as-a-service/pivotal-cloud-foundry)
