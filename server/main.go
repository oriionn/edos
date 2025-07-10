package main

import (
	"edos/server/logger"
	"edos/server/socket"
	"encoding/base64"
	"errors"
	"flag"
	"fmt"
	"net"
	"os"
	"strconv"
	"strings"
	"time"
)

func isConnectionClosed(err error) bool {
	if err == nil {
		return false
	}

	if strings.Contains(err.Error(), "connection reset by peer") ||
		strings.Contains(err.Error(), "broken pipe") ||
		strings.Contains(err.Error(), "connection refused") ||
		strings.Contains(err.Error(), "use of closed network connection") {
		return true
	}

	return false
}

func main() {
	var (
		token = flag.String("token", "", "Authentification token")
		host  = flag.String("host", "localhost", "Ip address of the tcp socket")
		port  = flag.String("port", "8000", "Port of the tcp socket")
	)
	flag.Parse()

	if *token == "" {
		logger.Fatal("You must specify the server token")
		flag.Usage()
		os.Exit(1)
	}

	id, key, err := decodeToken(*token)
	if err != nil {
		logger.Fatal("Unable to decode token")
		os.Exit(1)
	}

	for {
		err := connectAndRun(*host, *port, id, key)
		if err != nil {
			logger.Error(fmt.Sprintf("Connection error: %v. Retrying in 2 seconds...", err))
			time.Sleep(2 * time.Second)
			continue
		}
	}
}

func decodeToken(token string) (int, string, error) {
	rawDecoded, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return 0, "", err
	}

	decoded := string(rawDecoded)
	splitted := strings.Split(decoded, ";")
	if len(splitted) < 2 {
		return 0, "", errors.New("Invalid token")
	}

	id, err := strconv.Atoi(splitted[0])
	if err != nil {
		return 0, "", err
	}

	return id, splitted[1], nil
}

func connectAndRun(host, port string, id int, key string) error {
	logger.Info("Connecting to the server...")

	conn, err := net.Dial("tcp", host+":"+port)
	if err != nil {
		logger.Error("Unable to connect to server")
		return err
	}
	defer conn.Close()

	logger.Info("Connected to server")
	logger.Info("Authentification...")

	err = socket.Login(conn, key, id)
	if err != nil {
		logger.Error("An error occurred while authenticating to the server")
		os.Exit(1)
	}

	logger.Info("Authenticated to server")

	return mainLoop(conn, id)
}
