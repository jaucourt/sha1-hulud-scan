# sha1-hulud-scan
Scans repo for Sha1-Hulud vulnerable packages. Uses node 22+

# usage
Install the one dependency (not, it's not on the vulnerability list):
```
$ npm i
```
Then navigate to the repo you want to scan, followed by running scanner.js, 
e.g.:
```
$ node ../sha1-hulud-scan/scanner.js
```
A file npm-tree.txt will be created in your repo, you can delete this once the 
scan completes.
Please also note that it will highlight whether an affected package is present, 
but it doesn't check the version - so if you have a vulnerability highlighted, 
check your version and consider pinning to an unaffected version.