module.exports = {
    apps: [{
        name: 'ukay.dev',
        script: '/usr/bin/npm',
        args: 'start -- -p 3001',
        cwd: '/mnt/sdcard/stb/apps/ukay.dev',
        env: {
            NODE_ENV: 'production',
            PATH: '/usr/bin:/usr/bin:/usr/sbin:/usr/sbin:/sbin:/bin',
            NODE: '/usr/bin/node'
        },
        interpreter: 'none'
    }]
}
