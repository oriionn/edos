package socket

import (
	"edos/server/models"
	"errors"
	"net"
	"strconv"
	"strings"
)

func Uptime(conn net.Conn, uptime uint64, id int) error {
	message := models.SocketData{
		Id:   id,
		Type: models.Uptime,
		Data: strconv.FormatUint(uptime, 10),
	}

	response, err := SendMessage(message, conn)
	if err != nil {
		return err
	}

	if strings.TrimSpace(response) != "true" {
		return errors.New("Request failed")
	}

	return nil
}
