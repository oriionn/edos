package socket

import (
	"edos/server/models"
	"encoding/json"
	"errors"
	"net"
	"strings"
)

func Disk(conn net.Conn, disk models.Disk, id int) error {
	message := models.DiskSocketData{
		Id:   id,
		Type: models.Disks,
		Data: disk,
	}

	jsonData, err := json.Marshal(message)
	if err != nil {
		return err
	}

	_, err = conn.Write(jsonData)
	if err != nil {
		return err
	}

	response := make([]byte, 1024)
	n, err := conn.Read(response)
	if err != nil {
		return err
	}

	resp := string(response[:n])
	if strings.TrimSpace(resp) != "true" {
		return errors.New("Disk sending failed")
	}

	return nil
}
