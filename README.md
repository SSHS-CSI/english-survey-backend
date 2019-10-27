# Backend for English Survey
## Prerequisites

Make sure you installed [Node.js](https://nodejs.org/) and [yarn](hhttps://yarnpkg.com/).
When using windows, install unix tools and git bash from [git](https://git-scm.com/download/win).

## Initial setup

Clone this repository and install all dependencies: 

``` shell
$ git clone https://github.com/SSHS-CSI/english-survey-backend.git
$ cd english-survey-backend
$ yarn
```

You should create an env file for env variables.
Make a `.env` file with variables you want to access in the app.

``` shell
$ touch .env
$ cat <<EOF > .env
VARIABLE_NAME="variable-value"
EOF
```

Start the server:

``` shell
$ yarn start
```

[The app](http://localhost:8000) runs on port 8000 on localhost.

