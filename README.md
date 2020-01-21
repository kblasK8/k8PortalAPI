# BBPortal API

Contents:
1. [Overview](#overview)
2. [Tech stack](#tech-stack)
3. [Installation](#installation)
4. [Backend Setup](#backend-setup)
5. [Deployment](#api-deployment)

## Overview
BBPortal is a REST API that receives and sends data to manage Bold Business employee transactions in the web portal. The BBPortal API provides functionality to different modules and able to use in different platforms. The design of the API applies the JSON web token authorization for security purposes.

## Tech stack
- ExpressJS - NodeJS framework used for routing, receiving and sending data
- MongoDB - a NoSQL Database
- NGINX - HTTP web server to serve a proxy for NodeJS and render the frontend web pages.
- NodeJS - Runtime backend server for javascript
- NPM - Node Package Manager
- PM2 - Daemon process manager for NodeJS

## Installation

To run this API on your local machine you need to install the following tools:
Choose the following installer based on your operating system.

1. Click URL below to download Postman installer then install.<br/>
    https://www.getpostman.com/downloads/

2. Click URL below to download GIT installer then install.<br/>
	https://git-scm.com/downloads

3. Click URL below to download NodeJS installer then install.<br/>
	https://nodejs.org/en/download/

4. Click URL below to download MongoDB Community Server then install. For Mac or linux, you can skip this step since installing MongoDB is part of the migration script.<br/>
	https://www.mongodb.com/download-center/community

5. Click URL below to download Robo 3T then install.<br/>
	https://robomongo.org/download

7. Click URL below to download VSCode then install.<br/>
	https://code.visualstudio.com/download

6. Restart your computer.

## Backend Setup

After installing the programs and tools, we need to setup now the code and run the API.
1. Open your command prompt (Windows) or terminal (Mac / Linux).

2. The code base repository is in Github. Create an account if you don't have yet. If you have an account, coordinate to `Kenneth Blas` to add your account in the repository. Make sure to add a write permission to be able to contribute to the code base. Below is the guide to add user in repository and how to add push or write permission.<br/>
	https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/adding-outside-collaborators-to-repositories-in-your-organization

3. Go to your desired directory where you will save the code base.
```
cd /path/to/your/target/folder
```

4. Run the GIT command below to clone the code base from Github. Input your username and password for first time cloning the project after running the command. Then branch out to the dev branch. As of now, the dev branch is the latest code base.
```
git clone https://github.com/kblasK8/k8PortalAPI.git
git branch dev origin/dev
```

5. After cloning, go inside to the project folder.
```
cd k8PortalAPI
```

6. Install node modules for project library dependecies.
```
npm install
```

7. Start MongoDB Community Server.

### For Mac or Linux you can run the migration shell script instead to install MongoDB, import starting data and run the ervice. In your terminal from inside the project folder run the below command.
```
sh migration/migrate.sh
```
### For Windows, run this in the command prompt.
```
C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe
```

8. Import data to the MongoDB. If you run the migration script from in Mac or Linux you can skip this step.

### In command prompt, go to migration folder by running the below command.
```
cd migration
```
### Then run the following MongoDB import commands
```
mongoimport --db PortalDB --collection departments --type json --file departments.json --legacy
mongoimport --db PortalDB --collection resourceassignmentcategories --type json --file resourceassignmentcategories.json --legacy
mongoimport --db PortalDB --collection resourceassignmentroles --type json --file resourceassignmentroles.json --legacy
```

9. In your command prompt or terminal, you are now ready to run the API.

### Up to one folder if you are inside the directory of migration. Else skip this step.
```
cd ..
```
### Run the API
```
node server.js
```

10. You can test the API routes by using `Postman`. Refer to the wiki for the list if APIs.
11. For editing the code preferably use the VSCode as your IDE.
12. For restarting the API service to test the new added or changed code just go to the terminal where you run the `node server.js` then  press `ctrl + c` to stop the API service then yun again via `node server.js`.

## API Deployment
Below are the steps to deploy the new release features and updates to the API.

1. Remote the server in AWS via command below. Enter your passphrase after. Coordinate with `Malcolm Goodman` for your access if you don't have. Below is the IP address of the production server.
```
ssh -i /path/to/you/PEM/key your_username@52.74.172.38
```

2. Go to the API project folder directory.
```
cd /var/www/html/api/
```

3. Pull your changes from GIT. Enter your sudo password after.
```
sudo git pull
```

4. Stop the existing running API service. Then start API service again via PM2 command.
```
pm2 stop 1
pm2 start ecosystem.config.js
```
or shorthand, you can restart the service
```
pm2 restart 1
```

5. Check if the API service is running.
```
pm2 list
```

6. Check for errors in the runtime via `pm2` command below. If there are no error logs then you successfully deployed the updates of our API. Else fix and check your code.
```
pm2 monit
```
or
```
pm2 logs
```
