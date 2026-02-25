module.exports = {
  apps: [{
    name: 'namka-portfolio',
    script: 'node_modules/.bin/next',
    args: 'start -p 4000',
    cwd: '/var/www/namka-portfolio',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
}
