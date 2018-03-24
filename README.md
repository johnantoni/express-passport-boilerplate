# express-passport-boilerplate

A Super stacked express / react boilerplate for your new projects

Includes

* express
* cors
* passport
* mongoose
* session auth with sendgrid for reset emails
* helmet
* morgan & morgan-body for logging
* dotenv to load your project's .env file for development
* react inside the client dir (super basic created via create-react-app)
* auth wrapper to secure all /v1/* api routes
* and a whole load of other magic....

I'll be updating this project over time as I continue down the road of react.

If you see any glaring errors or things that you'd improve drop me a pull-request, if I meet you in person I'll buy you a pint.

Enjoy!

## .env

The server relies on the .env file to set all it's environment attributes, you'll see a basic one under .env-dev

So before you begin, copy .env-dev to .env

    cp .env-dev .env
