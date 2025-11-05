#!/usr/bin/env node

/**
 * CSP Test Script
 *
 * This script tests if Content Security Policy headers are properly set
 * Run with: node scripts/test-csp.js
 */

const https = require("node:https");
const http = require("node:http");

const testUrl = process.argv[2] || "http://localhost:3000";

function logMessage(message) {
  // eslint-disable-next-line no-console
  console.log(message);
}

function checkDirectives(cspHeader) {
  const directives = [
    "default-src",
    "script-src",
    "style-src",
    "object-src",
    "frame-ancestors",
  ];

  logMessage("\n🔍 Checking key directives:");
  for (const directive of directives) {
    const hasDirective = cspHeader.includes(directive);
    logMessage(`   ${hasDirective ? "✅" : "❌"} ${directive}`);
  }
}

function checkSecurityHeaders(headers) {
  const securityHeaders = [
    "X-Content-Type-Options",
    "X-Frame-Options",
    "X-XSS-Protection",
    "Referrer-Policy",
  ];

  logMessage("\n🔍 Checking security headers:");
  for (const header of securityHeaders) {
    const value = headers[header.toLowerCase()];
    logMessage(`   ${value ? "✅" : "❌"} ${header}: ${value || "Not found"}`);
  }
}

function testCSP(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, (res) => {
        const headers = res.headers;
        const cspHeader = headers["content-security-policy"];

        logMessage(`🔍 Testing CSP headers for: ${url}`);
        logMessage(`📊 Response Status: ${res.statusCode}`);
        logMessage(`🔒 CSP Header Present: ${!!cspHeader}`);

        if (cspHeader) {
          logMessage("✅ CSP Header Found:");
          logMessage(`   ${cspHeader}`);

          checkDirectives(cspHeader);
          checkSecurityHeaders(headers);
        } else {
          logMessage("❌ No CSP header found!");
          logMessage(`Available headers: ${Object.keys(headers).join(", ")}`);
        }

        resolve();
      })
      .on("error", (err) => {
        // eslint-disable-next-line no-console
        console.error("❌ Error testing CSP:", err.message);
        reject(err);
      });
  });
}

async function main() {
  try {
    await testCSP(testUrl);
    // eslint-disable-next-line no-console
    console.log("\n🎉 CSP test completed!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("💥 CSP test failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testCSP };
