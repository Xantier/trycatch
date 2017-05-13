# Try-Catch Boundary testing

> Code is easy, state is hard

Try-Catch is a test utility to automate labourious API call + database checking tasks when doing manual testing. The utility follows three simple steps to accomodate full end-to-end test of your API exposing web application:
1. Initialize Database with wanted values
2. Make an API call and check that the response from API matches expected
3. Run a database query and assert that expected rows are returned.

The application has two modes: `WEB` and `CLI`

* On web mode you can navigate to `localhost:7357` with your browser and use the GUI to build, test and save your test cases.
* On CLI mode the application reads scenario JSON files from your `scenario-folder` that you have set in your `properties.yaml`. These scenarios are run automatically and result are printed out to the console. 

## To setup
1. Clone the repository.
2. Set up you database connection strings in `db.yml` file that you can find from the `conf` folder.
3. Run the application with `./gradlew run`.

## To deploy and distribute
1. Clone the repository
2. Create an `executable jar` by running `./gradlew shadowJar` from the command line.
3. Move you `generated jar` file from `build/libs` folder to the installation location.
4. Move the `conf` folder to the installation location.
5. Setup your database connection strings and scenario location settings in `db.yml` and `properties.yml`
6. Run the application:
  * In web mode: `java -jar trycatch-all.jar`
  * In CLI mode: `java -jar trycatch-all.jar cli`

## To develop further

The web application is built using `Ratpack` on top of `Kotlin` on the backend and `React` on the frontend. API calls are made using `okHttp3` and responses are wrapped in `RxJava/RxKotlin` observables. Database connection is handled by JDBC and `HikariCP`, sessions are handled by `KotlinQuery`. Database responses are again wrapped in `RxJava/RxKotlin` observables. React components are loosely typed with the help of `Flow`. Dependency injection framework in use is `Guice`. Build processes are handled by `Gradle` in the backend and `Webpack` on the frontend.
To startup the `Ratpack server` on dev mode you have two options (from the root folder of the project):
* Standard: `gradle run`
* Continuous: `gradle run -t`

If you don't have `gradle` installed:
* Standard: `./gradlew run`
* Continuous: `./gradlew run -t`

To start `frontend development server` you have two options(from the folder `src/ratpack/static`):
* Standard: `npm run build`
* Continuous with auto reload: `npm start`

Note that you need to have run `npm install` before starting developing on the frontend. 


## License

MIT