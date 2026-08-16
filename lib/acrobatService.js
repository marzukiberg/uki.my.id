import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

/**
 * Acrobat / Adobe PDF Services wrapper
 *
 * Notes:
 * - Preferred: place full Adobe PDF Services credentials JSON and set ACROBAT_CREDENTIALS_PATH
 *   pointing to it. This is compatible with the official SDK (@adobe/pdfservices-node-sdk).
 * - Alternative: set ACROBAT_CLIENT_ID, ACROBAT_CLIENT_SECRET, ACROBAT_ORGANIZATION_ID.
 *   This will attempt an OAuth client_credentials exchange and call the REST API.
 *
 * The function below tries the SDK if installed and credentials file is present; otherwise
 * it will try a REST-based call. If neither is available, it throws a helpful error.
 */

const IMS_TOKEN_URL = 'https://ims-na1.adobelogin.com/ims/token';
const PDFSERVICES_BASE = 'https://pdfservices.adobe.com'; // base for REST endpoints

export async function convertPdfToDocxWithAdobe(pdfPath, outDocxPath) {
    // Basic checks
    if (!pdfPath || !outDocxPath) throw new Error('pdfPath and outDocxPath required');

    const credsPath = process.env.ACROBAT_CREDENTIALS_PATH || process.env.PDF_SERVICES_CREDENTIALS_PATH;
    let clientId = process.env.ACROBAT_CLIENT_ID || process.env.PDF_SERVICES_CLIENT_ID;
    let clientSecret = process.env.ACROBAT_CLIENT_SECRET || process.env.PDF_SERVICES_CLIENT_SECRET;

    // Try the official Node SDK if available and credentials file exists
    try {
        // If a specific creds path is not set, try the repository sample credentials as a convenience
        const fallbackSample = path.join(process.cwd(), 'PDFServicesSDK-Node.jsSamples', 'pdfservices-api-credentials.json');
        const finalCredsPath = credsPath && fs.existsSync(credsPath) ? credsPath : (fs.existsSync(fallbackSample) ? fallbackSample : null);

        if (finalCredsPath) {
            // Read and do a basic validation to give clearer error messages for incomplete sample files
            const raw = fs.readFileSync(finalCredsPath, 'utf8');
            let parsed;
            try {
                parsed = JSON.parse(raw);
            } catch (parseErr) {
                throw new Error(`Adobe credentials file JSON parse error: ${parseErr.message}`);
            }

            // The SDK expects either a service-account style credentials JSON (private_key, technical_account_id, org_id, etc.)
            // or a simple client_credentials block (client_id, client_secret) used by the sample folder.
            const hasServiceKeys = parsed.private_key || parsed.technical_account_id || parsed.serviceAccount || parsed.service_account_credentials;
            const hasClientCreds = parsed.client_credentials && parsed.client_credentials.client_id && parsed.client_credentials.client_secret;

            if (!hasServiceKeys && !hasClientCreds) {
                throw new Error(`Credentials file found at ${finalCredsPath} but it does not appear to be a Service Account (JWT) credentials JSON nor a client_credentials JSON. Please create a Service Account (JWT) integration for "PDF Services API" in Adobe Developer Console and download the full credentials JSON, or provide client_id & client_secret.`);
            }

            // If the file contains client_credentials, prefer to use them as ServicePrincipalCredentials
            if (hasClientCreds) {
                clientId = parsed.client_credentials.client_id;
                clientSecret = parsed.client_credentials.client_secret;
                console.log('Found client_credentials in credentials file; will attempt ServicePrincipalCredentials using client_id/client_secret');
            }

            // Lazy require so this file doesn't crash if SDK is not installed
            const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');

            const credentials = PDFServicesSdk.Credentials
                .serviceAccountCredentialsBuilder()
                .fromFile(finalCredsPath)
                .build();

            const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
            const ExportPDF = PDFServicesSdk.ExportPDF;
            const exportPDFOperation = ExportPDF.Operation.createNew(ExportPDF.SupportedTargetFormats.DOCX);

            const input = PDFServicesSdk.FileRef.createFromLocalFile(pdfPath);
            exportPDFOperation.setInput(input);

            const result = await exportPDFOperation.execute(executionContext);
            await result.saveAsFile(outDocxPath);
            console.log('Adobe SDK: conversion successful using credentials at', finalCredsPath);
            return;
        }
    } catch (err) {
        // SDK may be missing or conversion failed; log and continue to try REST/client-credentials
        console.error('Adobe SDK conversion failed or SDK not usable:', err?.message || err);
    }

    // If client credentials are provided, prefer using the official SDK's ServicePrincipalCredentials
    // (sample scripts use this approach). This avoids scope issues seen with a raw token endpoint.
    if (clientId && clientSecret) {
        try {
            // Lazy require to avoid hard dependency at module import time
            const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');

            const { ServicePrincipalCredentials, PDFServices, MimeType, ExportPDFParams, ExportPDFJob, ExportPDFResult } = PDFServicesSdk;

            console.log('Creating ServicePrincipalCredentials with provided clientId/clientSecret');
            const credentials = new ServicePrincipalCredentials({ clientId, clientSecret });
            const pdfServices = new PDFServices({ credentials });

            // Upload file as an asset
            console.log('Uploading PDF to Adobe PDF Services...');
            const readStream = fs.createReadStream(pdfPath);
            const inputAsset = await pdfServices.upload({ readStream, mimeType: MimeType.PDF });

            // Create export job for DOCX
            console.log('Submitting export job (PDF -> DOCX)');
            const params = new ExportPDFParams({ targetFormat: PDFServicesSdk.ExportPDFTargetFormat.DOCX });
            const job = new ExportPDFJob({ inputAsset, params });

            const pollingURL = await pdfServices.submit({ job });
            const pdfServicesResponse = await pdfServices.getJobResult({ pollingURL, resultType: ExportPDFResult });

            // Get content and save to outDocxPath
            console.log('Downloading result asset...');
            const resultAsset = pdfServicesResponse.result.asset;
            const streamAsset = await pdfServices.getContent({ asset: resultAsset });

            await new Promise((resolve, reject) => {
                const outStream = fs.createWriteStream(outDocxPath);
                streamAsset.readStream.pipe(outStream);
                streamAsset.readStream.on('error', reject);
                outStream.on('finish', resolve);
                outStream.on('error', reject);
            });

            console.log('Adobe PDF Services export completed and saved to', outDocxPath);
            return;
        } catch (e) {
            console.error('Adobe conversion failed using SDK ServicePrincipalCredentials:', e?.message || e);
            // Fall through to other fallbacks below
        }
    }

    // If we reach here, we cannot perform conversion
    throw new Error('Adobe Acrobat conversion not configured. Set ACROBAT_CREDENTIALS_PATH or ACROBAT_CLIENT_ID & ACROBAT_CLIENT_SECRET in env.');
}
