module.exports = {
  apps: [
    {
      name: 'cross',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        HOSTNAME: '0.0.0.0',
        PORT: 3000
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      combine_logs: true,
      merge_logs: true,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 10000,
      kill_timeout: 5000
    }
  ]
};
