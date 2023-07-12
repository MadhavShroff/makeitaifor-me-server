homeDir="/home/ubuntu/makeitaifor-me-server";

cd $homeDir; # go to home directory

/home/ubuntu/.nvm/versions/node/v18.16.1/bin/pm2 startOrRestart $homeDir/ecosystem.config.js --name "ai-server"; # start server