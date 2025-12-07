module.exports = {
    apps: [{
        name: 'ukay.dev',
        script: '/usr/local/bin/npm',
        args: 'start -- -p 3001',
        cwd: '/mnt/sdcard/stb/apps/ukay.dev',
        env: {
            NODE_ENV: 'production',
            PATH: '/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/bin',
            NODE: '/usr/local/bin/node'
        },
        interpreter: 'none'
    }]
}
