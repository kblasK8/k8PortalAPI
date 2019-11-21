#!/bin/bash

username=""
password=""

mongoimport --db PortalDB --collection departments ^
          	--authenticationDatabase admin --username $username --password $password ^
          	--drop --file departments.json

mongoimport --db PortalDB --collection resourceassignmentcategories ^
          	--authenticationDatabase admin --username $username --password $password ^
          	--drop --file resourceassignmentcategories.json

mongoimport --db PortalDB --collection resourceassignmentroles ^
          	--authenticationDatabase admin --username $username --password $password ^
          	--drop --file resourceassignmentroles.json
