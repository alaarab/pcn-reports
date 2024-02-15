rm -rf ./logs/*
npx sequelize db:drop
npx sequelize db:create
psql pcn < ~/pcn-ala-test.sql
# npx sequelize db:migrate
# npx sequelize db:seed:all
# node importNextGen.js
