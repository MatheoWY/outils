const path = require('path');

module.exports = {
  apps: [
    {
      name: 'workandyou-api',
      script: 'server/index.js',
      cwd: path.resolve(__dirname, '../../'),
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100
    },
    {
      name: 'workandyou-python',
      script: 'main.py',
      interpreter: path.resolve(__dirname, '../../methode workandyou/venv/bin/python'),
      args: ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'],
      cwd: path.resolve(__dirname, '../../methode workandyou'),
      instances: 1,
      env: {
        PYTHONUNBUFFERED: '1'
      },
      error_file: 'logs/python-error.log',
      out_file: 'logs/python-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '800M',
      exp_backoff_restart_delay: 100
    }
  ]
};
