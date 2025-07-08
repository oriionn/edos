package socket

import (
	"edos/server/models"
	"encoding/json"
	"net"
)

func SendMessage(message models.SocketData, conn net.Conn) (string, error) {
	jsonData, err := json.Marshal(message)
	if err != nil {
		return "", err
	}

	_, err = conn.Write(jsonData)
	if err != nil {
		return "", err
	}

	response := make([]byte, 1024)
	n, err := conn.Read(response)
	if err != nil {
		return "", err
	}

	return string(response[:n]), nil
}
