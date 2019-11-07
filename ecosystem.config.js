module.exports = {
  apps : [{
    name: 'K8Portal API',
    script: 'server.js',
    autorestart: true,
    watch: true,
    ignore_watch : ["uploads"],
    instances : "max",
    exec_mode : "cluster"
  }],
};
