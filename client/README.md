# Edos Client
The client is what allows Edos to centralize all the data sent by the servers, store it and send it.

## Installation
### Standalone
#### Prerequisites
- Bun

#### Installation

1. Clone and install
```sh
git clone https://github.com/oriionn/edos.git # Clone the repo
cd edos/client # Go to the client folder
bun install # Install dependencies
```

2. Copy the .env
```sh
cp .env.example `.env`
```

3. Edit the `.env`

4. Start the server
```sh
bun start
```

### Docker
#### Prerequisites
- Docker (Compose)

#### Installation
1. Clone and build
```sh
git clone https://github.com/oriionn/edos.git # Clone the repo
cd edos/client # Go to the client folder
docker build -t edos/client . # Build Docker image
```

2. Change env variables in `docker-compose.yml`

3. Up the docker compose
```sh
docker-compose up -d
```
