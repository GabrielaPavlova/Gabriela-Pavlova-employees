# Sirma Solution Task

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.6.

## More Information 

In this code, we use the date-fns library's parse function to attempt to parse dates in different formats. If a date is invalid, it's treated as null. This allows the code to handle various date formats gracefully. The formatDate function ensures that null dates are converted to the current date when calculating work duration.

Certainly! If your CSV data may have various date formats, you can modify the findLongestWorkPeriod function to handle multiple date formats. To do this, you can use a library like date-fns to parse dates in different formats.

First, install the date-fns library.

Second, install PapaParse for CSV. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


