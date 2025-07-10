package main

import (
	"edos/server/logger"
	"edos/server/models"
	"edos/server/socket"
	"edos/server/systems"
	"fmt"
	"net"
	"time"
)

func mainLoop(conn net.Conn, id int) error {
	var (
		oldCpu  models.CPUStats
		newCpu  models.CPUStats
		oldNet  models.NetworkStats
		newNet  models.NetworkStats
		network models.Network
		hard    models.HardMemory
		swap    models.SwapMemory
	)

	CPUName := systems.GetCPUName()
	err := socket.CPUName(conn, CPUName, id)
	if err != nil {
		logger.Warn("An error occurred when sending the CPU name")
	}
	logger.Debug("The CPU name has been sent")

	go func() {
		ticker := time.NewTicker(1*time.Minute + 500*time.Millisecond)

		sendDisks(conn, id)
		for range ticker.C {
			sendDisks(conn, id)
		}
	}()

	systems.ReadCPU(&oldCpu)
	systems.ReadNetworkStats(&oldNet)
	ticker := time.NewTicker(1 * time.Second)

	for range ticker.C {
		newNet = models.NetworkStats{}

		systems.ReadCPU(&newCpu)
		systems.ReadNetworkStats(&newNet)

		uptime, err := systems.GetUptime()
		if err != nil {
			logger.Warn("An error occurred while retrieving uptime")
		}
		socket.Uptime(conn, uptime, id)
		logger.Debug("Uptime has been sent")

		err = socket.CPUUsage(conn, systems.GetCPUUsage(oldCpu, newCpu), id)
		if err != nil {
			logger.Warn("An error has occurred while sending the CPU usage upload")
			if isConnectionClosed(err) {
				return err
			}
		}
		logger.Debug("CPU usage has been sent")

		network = systems.GetNetworkStats(&oldNet, &newNet)

		err = socket.Network(conn, network, newNet, id)
		if err != nil {
			logger.Warn("An error has occurred while sending network data.")
			if isConnectionClosed(err) {
				return err
			}
		}
		logger.Debug("Network information has been sent")

		systems.GetMemory(&hard, &swap)
		socket.Memory(conn, hard, swap, id)
		logger.Debug("Memory statistics have been sent")

		oldCpu = newCpu
		oldNet = newNet
	}

	return nil
}

func sendDisks(conn net.Conn, id int) {
	disks, err := systems.GetDisks()
	if err != nil {
		logger.Warn("An error has occurred while recovering data from disks")
	}

	for _, disk := range disks {
		err = socket.Disk(conn, disk, id)
		if err != nil {
			logger.Warn(fmt.Sprintf("Une erreur s'est produite lors de l'envoi des données du disque \"%s\"", disk.Device))
		}
		logger.Debug(fmt.Sprintf("The \"%s\" disk statistics have been sent", disk.Device))
	}
}
