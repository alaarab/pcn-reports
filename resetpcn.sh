rm -rf ./logs/*
npx sequelize db:drop
npx sequelize db:create
psql pcn < ~/pcn-gspa-new.sql
npx sequelize db:seed --seed db/seeders/20240214034303-delete-zero-balance-patients-and-guarantors.js 
# psql pcn < ~/pcn.sql
# node importNextGen.js
