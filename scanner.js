#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import csvParser from 'csv-parser';
// import fetch from 'node-fetch';


// List of packages to scan for
const results = [];
fetch('https://raw.githubusercontent.com/Cobenian/shai-hulud-detect/main/compromised-packages.txt')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch compromised packages list: ${response.statusText}`);
    }
    return response.text();
  })
  .then(text => {
    const packages = text.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split(':')[0]);
    console.log('Scanning installed packages…');

    // Generate the npm dependency tree and save it to a temporary file
    try {
      execSync('npm ls --all > npm-tree.txt', { stdio: 'ignore' });
    } catch (error) {
      console.error('Error generating npm dependency tree. Ensure you have a valid package.json and node_modules directory.');
      process.exit(1);
    }
    
    // Read the generated npm-tree.txt file
    
    const npmTree = fs.readFileSync('npm-tree.txt', 'utf8');
    
    console.log('\n=== RESULTS ===');
    let foundAny = false;
    
    // Check for each package in the dependency tree
    packages.forEach(pkg => {
      if (npmTree.includes(pkg)) {
        console.log(`FOUND: ${pkg}`);
        foundAny = true;
      }
    });
    
    if (!foundAny) {
      console.log('No compromised packages detected in your dependency tree.');
    }
  });
