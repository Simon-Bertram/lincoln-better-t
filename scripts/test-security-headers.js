#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Test script to verify security headers including COOP are properly set
 * Run with: node scripts/test-security-headers.js
 */

const https = require("node:https");
const http = require("node:http");

const testUrls = [
  "http://localhost:3000", // Web app
  "http://localhost:3001", // Server app
];

const expectedHeaders = [
  "cross-origin-opener-policy",
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "x-xss-protection",
  "referrer-policy",
  "permissions-policy",
];

function testHeaders(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    const req = client.get(url, (res) => {
      const headers = res.headers;
      const results = {
        url,
        status: res.statusCode,
        headers: {},
        missing: [],
        issues: [],
      };

      // Check for expected headers
      for (const header of expectedHeaders) {
        const value = headers[header];
        if (value) {
          results.headers[header] = value;
        } else {
          results.missing.push(header);
        }
      }

      // Validate COOP header
      const coop = headers["cross-origin-opener-policy"];
      if (coop && coop.toLowerCase() === "same-origin") {
        results.headers["cross-origin-opener-policy"] = coop;
      } else if (coop) {
        results.issues.push(`COOP header has unexpected value: ${coop}`);
      } else {
        results.issues.push("COOP header is missing");
      }

      resolve(results);
    });

    req.on("error", (err) => {
      reject({ url, error: err.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject({ url, error: "Request timeout" });
    });
  });
}

async function runTests() {
  console.log("🔒 Testing Security Headers...\n");

  for (const url of testUrls) {
    try {
      const result = await testHeaders(url);

      console.log(`📡 Testing: ${result.url}`);
      console.log(`   Status: ${result.status}`);

      if (result.missing.length > 0) {
        console.log(`   ⚠️  Missing headers: ${result.missing.join(", ")}`);
      }

      if (result.issues.length > 0) {
        console.log(`   ❌ Issues: ${result.issues.join(", ")}`);
      }

      if (result.missing.length === 0 && result.issues.length === 0) {
        console.log("   ✅ All security headers present and valid");
      }

      console.log(
        `   🔐 COOP: ${result.headers["cross-origin-opener-policy"] || "MISSING"}`
      );
      console.log("");
    } catch (error) {
      console.log(`❌ Failed to test ${error.url}: ${error.error}`);
      console.log("");
    }
  }

  console.log(
    "💡 To verify cross-origin isolation, check if self.crossOriginIsolated returns true in browser console"
  );
}

runTests().catch(console.error);
