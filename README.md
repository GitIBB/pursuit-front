### SSL Certificate Setup
To work on this project locally, you need to generate SSL certificates for `localhost`.

1. Install [mkcert](https://github.com/FiloSottile/mkcert).
2. Run the following commands:
   ```bash
   mkcert -install
   mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost