#!/bin/bash

#Install Brew
	if [[ $(command -v brew) == "" ]]; then
	    echo "Installing Hombrew..."
	    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	else
	    echo "Updating Homebrew..."
	    brew update
	fi

#Install MongoDB
	if brew ls --versions mongodb-community > /dev/null; then
		# The package is installed
		echo "MongoDB formulae found! Upgrading MongoDB..."
		brew upgrade mongodb-community
	else
		# The package is not installed
		echo "Installing MongoDB..."
		brew tap mongodb/brew
		brew install mongodb-community
	fi
	
	echo "Starting MongoDB service..."
	brew services stop mongodb-community
	brew services start mongodb-community

#Importing default data
	echo "Importing data..."
	mongoimport --db PortalDB --collection accounts --type json --file accounts.json --legacy
	mongoimport --db PortalDB --collection departments --type json --file departments.json --legacy
	mongoimport --db PortalDB --collection resourceassignmentcategories --type json --file resourceassignmentcategories.json --legacy
	mongoimport --db PortalDB --collection resourceassignmentroles --type json --file resourceassignmentroles.json --legacy
	echo "Data imported done."
