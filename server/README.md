# Edos Server
The server retrieves all information from your server and sends it back to the client via a TCP socket.

## Installation
### Prerequisites
- make
- go

### Installation
1. Clone and download dependencies
```sh
git clone https://github.com/oriionn/edos.git
cd edos/server
go mod download
```

2. Compile and move file
```sh
make
mkdir -p /usr/local/bin
mv server /usr/local/bin/edos-server
```

3. Create a config file
```sh
mkdir -p /etc/edos
sudo touch /etc/edos/config
```

4. Retrieve the token from the client interface: to do this, click on the small key in your client's panel.

5. Edit the config file
```
TOKEN=YOUR_TOKEN
HOST=CLIENT_HOST
PORT=CLIENT_PORT
```

6. Create a service
```sh
sudo touch /etc/systemd/system/edos.service
```

7. Edit the service
```
[Unit]
Description=Edos Server
After=network.target

[Service]
Type=simple
User=emilien
EnvironmentFile=/etc/edos/config
ExecStart=/usr/local/bin/edos-server -token "${EDOS_TOKEN}" -host "${HOST}" -port "${PORT}"
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

8. Start Edos
```sh
sudo systemctl daemon-reload
sudo systemctl restart edos.service
```
