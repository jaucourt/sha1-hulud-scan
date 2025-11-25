#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import csvParser from 'csv-parser';


// List of packages to scan for
const results = [];
fs.createReadStream(new URL('./compromised-packages.csv', import.meta.url), 'utf8')
  .pipe(csvParser())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const packages = results.map(row => row.package_name);
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
