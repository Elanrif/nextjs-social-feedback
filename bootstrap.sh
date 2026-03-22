#!/bin/bash# Convert to Unix lformat if needed: dos2unix bootstrap.sh

OS=$(uname)
Color_Off='\033[0m'
Color_Green='\033[0;32m'
Color_Red='\033[0;31m'

echo_success() {
  echo -e "${Color_Green}${1}${Color_Off}"
}

echo_error() {
  echo -e "${Color_Red}${1}${Color_Off}"
}


echo_success "Bootstrapping ${PWD##*/}"

# Step 0: Clean
# ================

echo "Remove node modules..."
rm -rf .next dist build out node_modules


# Step 1: Setup project
# ================

echo "Install node modules"
npm install

echo "Setup husky..."
npx husky
chmod +x ./.husky/pre-commit
chmod +x ./.husky/_/husky.sh


# Step final: Complete
# ================

echo_success "Bootstrap completed!"
