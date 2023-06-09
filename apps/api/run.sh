#!/bin/sh

echo
echo -e "\e[1;36m ----- Run migrations ----- \e[0m"
echo

npx prisma migrate deploy

# =========================================================

echo
echo -e "\e[1;36m ----- Start server ----- \e[0m"
echo

node main.js
