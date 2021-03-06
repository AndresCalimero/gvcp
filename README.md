# GVCP
GNU Video Conferencing Platform

This is the final project for the CS50 Course of Harvard University.

## Summary

  GVCP is a web server made with **NodeJS** whose main purpose is to make video conferencing easier, without having to install any software or plugin, only with a [compatible browser](http://www.webrtc.org) and a webcam.

  GVCP uses **WebRTC** in order to be able to establish a full mesh connection between peers, that means that GVCP is not a typical 
server-client application but a application to synchronize clients for a peer to peer connection.

  For more information I encourage you to see the [presentation video](https://www.youtube.com/watch?v=prx-eAFq_h0) on YouTube.

## Installation

```bash
$ npm install gvcp
```

## Features

  * [WebRTC](https://webrtc.org/) 
  * Configurable
  * Focus on high performance and security
  * View system using Handlebars with precompilation
  * Own micro-framework
  * Easily expandable
  * CLI (optional)
  * HTTPS redirect

## Quick Start

  Install **NodeJS v5.3.0+** using [nvm](https://github.com/creationix/nvm) **or** downloading it [here](https://nodejs.org/):

```bash
$ nvm install v5.3.0
```

  Install the package:

```bash
$ npm install gvcp
$ cd node_modules/gvcp
```

  Configure the server (**config/config.json**):

  For more info about the config file go [here](config/README.md).

```js
{
    "debug": true,
    "url": "https://localhost/",
    "secure": true,
    "cli": true,
    "title": "GVCP",
    "public_folder": "./public",
    "error_template": "error.tmpl",
    "cache_max_age": 604800,
    "server_info": "GVCP-Server",
    "stun_turn_server_api": {
        "url": "https://service.xirsys.com/ice",
        "ident": "[your user]",
        "secret": "[your secret token]",
        "domain": "[your domain]",
        "application": "[your app name]",
        "room": "[your room name]",
        "secure": 1
    },
    "room_capacity": 4
}
```

  Build the js files:

  **NOTE:** This must be done every time the config file or any JavaScript template are modified.

```bash
$ npm run build
```

  Start the server:

```bash
$ npm start
```

## License

  [GPL-3.0](LICENSE)

