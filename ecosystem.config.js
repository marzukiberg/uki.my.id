module.exports = {
    apps: [{
        name: 'ukay.dev',
        script: '/mnt/sdcard/stb/apps/ukay.dev/node_modules/next/dist/bin/next',
        args: 'start -p 5110',
        cwd: '/mnt/sdcard/stb/apps/ukay.dev',
        env: {
            NODE_ENV: 'production',
            PORT: '5110'
        }
    }]
}
