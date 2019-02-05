# Development Info.

### Server
Public IPv4 Address: [3.89.70.221](http://3.89.70.221/)

### Services
* **Node app path:** ```/opt/bitnami/apps/sportsbook/```
  * **Home page renderer (routes):** ```/home/bitnami/apps/test/routes/index.js```
  * **Index template:** ```/opt/bitnami/nodejs/lib/node_modules/express-generator/templates/js/index.html```
* **Listing status of Node server:** enter command ```forever list```
* **Stopping/Starting Node server:** enter command(s) ```forever stopall``` to stop, ```forever start app.js``` while inside app path (See: 'Node app path') to start
* **Restarting apache:** enter command ```sudo /opt/bitnami/ctlscript.sh restart apache```


