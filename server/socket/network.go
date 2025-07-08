package socket

import (
	"edos/server/models"
	"errors"
	"fmt"
	"net"
	"strings"
)

func Network(conn net.Conn, network models.Network, all models.NetworkStats, id int) error {
	// Format : current_download;current_upload;all_download;all_upload

	data := fmt.Sprintf("%d;%d;%d;%d", network.Download, network.Upload, all.RBytes, all.TBytes)
	message := models.SocketData{
		Id:   id,
		Type: models.Networks,
		Data: data,
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
