### Package install
Install Node.js
then, run the command
`npm install`
to install all required packages

### SSL Certificate Setup
To use this project locally, you need to generate SSL certificates for `localhost`.

1. Install [mkcert](https://github.com/FiloSottile/mkcert).
2. Run the following commands:
   `mkcert -install`
   `mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost`


### ENV Setup
You also need to set up a .env file with:
VITE_API_BASE_URL=(Your localhost api url here)
VITE_ENV=development
VITE_DEBUG=true
VITE_BUILD_VERSION=(Your build version here)

then, run the command: `npm run dev` while in the root folder

