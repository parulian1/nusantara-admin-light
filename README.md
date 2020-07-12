# Nusantara Admin



## Project Structure

| Directory         | Role                                      |
| ----------------- | ----------------------------------------- |
| src/app/core      | Generic components, only imported to root |
| src/app/services  | Application-specific services             |
| src/app/resolvers | Application-specific resolvers            |


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



## 3rd-Party Libraries Used

As much as possible, we're trying to keep this light on dependencies,
while writing as little code as possible to accomplish the needs here
(more code == more bugs), but more 3rd party code is more things that
we can't maintain.

We are not using any CSS precompilers here (modern CSS features should
be enough), and we are not using any CSS frameworks (i.e., no bootstrap).

Javascript dependencies have been kept to a minimum, with the following
5 being used:

| Library                   | Use                                           |
| ------------------------- | --------------------------------------------- |
| auth0-angular jwt         | auth token handling / service injection       |
| echarts (and ngx module)  | dashboard chart widgets                       |
| ckeditor (classic editor) | richtext fields                               |
| ngx-smart-modal           | popups                                        |
| iso8601-duration          | parsing/rendering iso8601 duration fields     |
