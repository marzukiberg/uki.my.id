#!/usr/bin/env node

import chalk from "chalk";
import { execSync, spawn } from "child_process";
import readline from "readline";

const colors = {
    success: chalk.green,
    error: chalk.red,
    warning: chalk.yellow,
    info: chalk.cyan,
    muted: chalk.gray,
};

const symbols = {
    check: "✓",
    cross: "✕",
    info: "ℹ",
    warning: "⚠",
    loading: "⟳",
};

function log(message, level = "info") {
    const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const prefix = `${colors.muted(`[${timestamp}]`)}`;

    switch (level) {
        case "success":
            console.log(`${prefix} ${colors.success(`${symbols.check} ${message}`)}`);
            break;
        case "error":
            console.log(`${prefix} ${colors.error(`${symbols.cross} ${message}`)}`);
            break;
        case "warning":
            console.log(`${prefix} ${colors.warning(`${symbols.warning} ${message}`)}`);
            break;
        case "info":
            console.log(`${prefix} ${colors.info(`${symbols.info} ${message}`)}`);
            break;
        default:
            console.log(`${prefix} ${message}`);
    }
}

function executeCommand(command, description) {
    return new Promise((resolve, reject) => {
        try {
            log(`${description}...`);
            const output = execSync(command, {
                stdio: ["inherit", "pipe", "pipe"],
                encoding: "utf-8",
            });
            log(`${description} completed`, "success");
            resolve(output);
        } catch (error) {
            log(`${description} failed: ${error.message}`, "error");
            reject(error);
        }
    });
}

function executeSpawnCommand(command, args, description) {
    return new Promise((resolve, reject) => {
        log(`${description}...`);
        const child = spawn(command, args);

        let output = "";
        child.stdout.on("data", (data) => {
            output += data.toString();
            process.stdout.write(data);
        });

        child.stderr.on("data", (data) => {
            process.stderr.write(data);
        });

        child.on("close", (code) => {
            if (code === 0 || code === 12) {
                log(`${description} completed`, "success");
                resolve(output);
            } else {
                log(`${description} failed with code ${code}`, "error");
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        child.on("error", (error) => {
            log(`${description} error: ${error.message}`, "error");
            reject(error);
        });
    });
}

async function checkNodeVersion() {
    try {
        const version = execSync("node --version", { encoding: "utf-8" })
            .trim()
            .substring(1);
        const [major] = version.split(".");
        const requiredVersion = 18;

        if (parseInt(major) < requiredVersion) {
            log(
                `Node.js version must be ${requiredVersion} or higher. Current: ${version}`,
                "error"
            );
            process.exit(1);
        }

        log(`Node.js version OK: ${version}`, "success");
    } catch (error) {
        log("Failed to check Node.js version", "error");
        process.exit(1);
    }
}

async function buildProject() {
    try {
        await executeCommand("pnpm build", "Building project locally");
    } catch (error) {
        process.exit(1);
    }
}

async function syncProject(host, remotePath) {
    try {
        log(`Syncing project to ${host}:${remotePath}`);
        await executeSpawnCommand("rsync", [
            "-avz",
            "--delete",
            "--exclude=node_modules",
            "--exclude=.git",
            "--exclude=.next/cache",
            ".next",
            "public",
            "package.json",
            "next.config.js",
            "ecosystem.config.js",
            "pages",
            "components",
            "lib",
            "styles",
            "hooks",
            "utils",
            "middleware.js",
            "scripts",
            `${host}:${remotePath}/`
        ], "Syncing project files");
    } catch (err) {
        log(`Failed to sync project: ${err.message}`, "error");
        process.exit(1);
    }
}

async function checkRemotePath(host, remotePath) {
    try {
        const cmd = `ssh ${host} "if [ -d '${remotePath}' ]; then echo 'EXISTS'; else echo 'MISSING'; fi"`;
        const out = execSync(cmd, { encoding: "utf-8" }).trim();
        return out === "EXISTS";
    } catch (err) {
        log(`Failed to check remote path: ${err.message}`, "error");
        throw err;
    }
}

function askYesNo(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(`${question} (y/N): `, (answer) => {
            rl.close();
            const ok = String(answer).trim().toLowerCase() === "y";
            resolve(ok);
        });
    });
}

async function createRemotePath(host, remotePath) {
    try {
        await executeSpawnCommand("ssh", [host, `mkdir -p ${remotePath} && chmod 755 ${remotePath}`], `Creating remote path ${remotePath}`);
    } catch (err) {
        log(`Failed to create remote path: ${err.message}`, "error");
        process.exit(1);
    }
}

async function deployToServer(host, remotePath) {
    try {
        log("Deploying to server...");
        const deployCommand = `
            cd ${remotePath}
            
            # Stop PM2 service
            pm2 delete ukay.dev 2>/dev/null || true
            
            # Install dependencies (non-interactive)
            CI=true PUPPETEER_SKIP_DOWNLOAD=true pnpm install --prod --no-frozen-lockfile --silent
            # Start service
            pm2 start ecosystem.config.js
            pm2 save
            
            echo ""
            echo "✅ Deployment complete!"
            pm2 logs ukay.dev --lines 10 --nostream
        `;

        await executeSpawnCommand("ssh", [host, deployCommand], "Deploying to server");
    } catch (err) {
        log(`Failed to deploy to server: ${err.message}`, "error");
        process.exit(1);
    }
}

async function main() {
    const host = "stb";
    const remotePath = "/mnt/sdcard/stb/apps/ukay.dev/";

    try {
        console.log(colors.info.bold("\n╔════════════════════════════════════════════════════╗"));
        console.log(colors.info.bold("║     UKAY.DEV - STB Deployment Script v1.0         ║"));
        console.log(colors.info.bold("╚════════════════════════════════════════════════════╝\n"));

        await checkNodeVersion();
        await buildProject();

        const exists = await checkRemotePath(host, remotePath);
        if (!exists) {
            log(`Remote path ${remotePath} does not exist on ${host}`, "warning");
            const confirm = await askYesNo(`Create ${remotePath} on ${host}?`);
            if (!confirm) {
                log("Aborting deploy. Please create the remote directory and re-run.", "error");
                process.exit(1);
            }

            await createRemotePath(host, remotePath);
        } else {
            log(`Remote path ${remotePath} exists on ${host}`, "success");
        }

        await syncProject(host, remotePath);

        // Run remote deploy steps (stop/install/start via PM2)
        await deployToServer(host, remotePath);

        log("Deployment to STB completed", "success");
        process.exit(0);
    } catch (err) {
        log(`Deployment failed: ${err.message}`, "error");
        process.exit(1);
    }
}

main();
