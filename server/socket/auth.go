package socket

import (
	"edos/server/models"
	"errors"
	"net"
	"strings"
)

func Login(conn net.Conn, key string, id int) error {
	message := models.SocketData{
		Id:   id,
		Type: models.Init,
		Data: key,
	}

	response, err := SendMessage(message, conn)
	if err != nil {
		return err
	}

	if strings.TrimSpace(response) != "true" {
		return errors.New("Login failed")
	}

	return nil
}
