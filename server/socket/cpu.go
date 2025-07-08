package socket

import (
	"edos/server/models"
	"errors"
	"net"
	"strconv"
	"strings"
)

func CPUName(conn net.Conn, name string, id int) error {
	message := models.SocketData{
		Id:   id,
		Type: models.CPUName,
		Data: name,
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

func CPUUsage(conn net.Conn, usage float32, id int) error {
	message := models.SocketData{
		Id:   id,
		Type: models.CPUUsage,
		Data: strconv.FormatFloat(float64(usage), 'f', 2, 64),
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
