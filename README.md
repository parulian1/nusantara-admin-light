# Nusantara Admin

This 


## Project Structure

| Directory    | Role  |
| ------------ | ----- |
| src/app/core | Generic components, only imported to root |
| src/app/services | Application-specific services |
| src/app/resolvers | Application-specific resolvers |
| 

### Application-specific Code

The following directories must contain only code 
specifically related to Nusantara Admin.  These
will typically be services responsible for communicating
with API endpoints, and modelling responses.

#### /src/app/services

Services which fetch data from the API.

#### /src/app/resolvers

Data resolvers used for getting data before loading pages

#### /src/app/pages

Components that are loaded on the screen.

#### /src/app/models

API data models

### Generic Code

#### /src/app/core
#### /src/app/shared
#### /src/view-wrappers/
