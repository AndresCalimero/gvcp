# GVCP
GNU Video Conferencing Platform

## Configuration

  The following table contains all the currently available configuration properties:

| Name | Default value | Description |
| ------------- | ------------- | ------------- |
| debug | false | Shows debug info in the server's console |
| url | localhost | The URL of the server (example: https://my-domain.com/) |
| secure | true | Enable HTTPS (should be enabled always) |
| cli | true | Command line interface for the server's console |
| title | GVCP | The title that shown in the website |
| ip | 0.0.0.0 | The listening IP (0.0.0.0 for listening in all interfaces) |
| port | 80 | The port for the HTTP server |
| ssl_port | 443 | The port for the HTTPS server |
| public_folder | ./public | The web server's folder |
| error_template | error.tmpl | The template to use when an error occurs (relative to the 'views' folder) |
| cache_max_age | 604800 | The maximum amount of seconds to keep the cached data |
| server_info | GVCP-Server | The value of the HTTP header 'server' field |
| stun_turn_server_api | false | The API configuration of the STUN and TURN servers provider (more info below) |
| stun_servers | [] | The STUN servers (more info below) |
| turn_servers | [] | The TURN servers (more info below) |
| room_capacity | 4 | The maximum capacity of rooms (-1 for unlimited capacity, not recommended) |

## What is STUN/TURN?

  STUN and TURN are a set of IETF standard protocols for negotiating traversing NATs when establishing peer-to-peer communication sessions.

  A host uses Session Traversal Utilities for NAT (STUN) to discover its public IP address when it is located behind a NAT/Firewall. When this host wants to receive an incoming connection from another party, it provides this public IP address as a possible location where it can receive a connection.

  If the NAT/Firewall still won't allow the two hosts to connect directly, they make a connection to a server implementing Traversal Using Relay around NAT (TURN), which will relay media between the two parties.

  A TURN server can be used as a STUN server but not otherwise.

## STUN/TURN API

  WebRTC requires STUN and/or TURN servers to help establish the connection between clients, you have the option to run your own turn server (you can use [rfc-5766-turn-server](https://github.com/coturn/coturn)) or use a provider like [XirSys](http://xirsys.com) which offer free plans.

  Example of **stun_turn_server_api** property using XirSys:

```js
{
    [...]
    "stun_turn_server_api": {
        "url": "https://service.xirsys.com/ice",
        "ident": "[your user]",
        "secret": "[your secret token]",
        "domain": "[your domain]",
        "application": "[your app name]",
        "room": "[your room name]",
        "secure": 1
    },
    [...]
}
```

  Example of **stun_servers** property using Google's public STUN servers:

```js
{
    [...]
    "stun_servers": [
        {url:"stun:stun.l.google.com:19302"},
        {url:"stun:stun1.l.google.com:19302"},
        {url:"stun:stun2.l.google.com:19302"},
        {url:"stun:stun3.l.google.com:19302"},
        {url:"stun:stun4.l.google.com:19302"}
    ],
    [...]
}
```

  Example of **turn_servers** property using your own TURN server:

```js
{
    [...]
    "turn_servers": [
        {
            "url": "turn:ip:port?transport=udp",
            "secret": "[your secret]",
            "expiry": "[the expiry time]"
        },
        {
            "url": "turn:ip:port?transport=udp",
            "secret": "[your secret]",
            "expiry": "[the expiry time]"
        }
    ],
    [...]
}
```

  **NOTE:** If you set the **stun_turn_server_api** property you don't need to set the **stun_servers** and **turn_servers** properties.
