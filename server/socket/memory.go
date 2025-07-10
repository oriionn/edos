package socket

import (
	"edos/server/models"
	"errors"
	"fmt"
	"net"
	"strings"
)

func Memory(conn net.Conn, hard models.HardMemory, swap models.SwapMemory, id int) error {
	// Format : total_hard;free_hard;total_swap;free_swap

	data := fmt.Sprintf("%d;%d;%d;%d", hard.Total, hard.Free, swap.Total, swap.Free)
	message := models.SocketData{
		Id:   id,
		Type: models.Memory,
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
