homeDir="/home/ubuntu/makeitaifor-me-server";

/home/ubuntu/.nvm/versions/node/v18.16.1/bin/npm install; /home/ubuntu/.nvm/versions/node/v18.16.1/bin/npm run build;

/home/ubuntu/.nvm/versions/node/v19.0.1/bin/pm2 stop "ai-server"; # stop server if running
/home/ubuntu/.nvm/versions/node/v19.0.1/bin/pm2 start $homeDir/dist/main.js --name "ai-server"; # start server