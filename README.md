# Startoryx

Startoryx is an analogue of Kickstarter - a site for raising funds for the implementation of creative, scientific and industrial projects under the crowdfunding scheme (that is, voluntary donations)

Live Demo: http://startoryx.live/

## Features:
* Local Two-Factor Authentication using Email and Password
* OAuth 2.0 Authentication via Google
* Link OAuth strategies to one account
* MVC Project Structure
* Account Management (profile details, change data/password, forgot/reset password)
* Viewing the profile of other users
* Project Management (create, read, update, delete projects)
* Publication of the project by moderation in the admin panel
* Comments, ratings for projects
* Project board with sorting and search
* Topping up the balance and donating to projects via PayPal
* Admin Panel (/admin)
* Landing, Contact Us, FAQ, Error etc. pages

## Getting Started
### Prerequisites
* NodeJS, NPM (https://www.npmjs.com/get-npm)
* MongoDB server, local or remote (https://www.mongodb.com/)
* Cloudinary (https://cloudinary.com/)
* Heroku - optional

### Installing
```bash
# Get the latest snapshot
git clone https://github.com/zaurbbb/startoryx-crowdfunding-nodejs.git
```
``` bash
# Change directory
cd myproject
```
``` bash
# Install NPM dependencies
npm install
```
Create an .env file locally. You can duplicate .env.example and name the new copy .env. Adapt the variables to your needs.
``` bash
# Then simply start your app
npm run start 
# or npm run dev
```

## Responsibilities

* Front-End development - [Zaur](https://github.com/zaurbbb)
* Back-End development - [Bioneisme](https://github.com/Bioneisme)
* UI/UX design - [Akniet](https://github.com/akniet1818)

## Deployment
You have access to the project by these links:
* Heroku Deployment: http://startoryx.live/
* GitHub Pages Deployment https://zaurbbb.github.io/startoryx/

## License
startoryx-crowdfunding-nodejs is available under the [MIT License](https://tldrlegal.com/license/mit-license)
