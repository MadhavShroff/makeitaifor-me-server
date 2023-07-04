module.exports = {
  apps: [
    {
      name: 'NestJS Application',
      script: 'dist/main.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 'max', // 'max' will create as many instances as you have CPU cores
      autorestart: true, // Automatically restart app if it crashes or stops
      watch: false, // Watch for changes and restart app when changes are made
      max_memory_restart: '1G', // Restart app if it reaches this much memory
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
