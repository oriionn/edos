package main

import (
	"edos/server/models"
	"edos/server/socket"
	"edos/server/systems"
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

func main() {
	var (
		token = flag.String("token", "", "Authentification token")
		host  = flag.String("host", "localhost", "Ip address of the tcp socket")
		port  = flag.String("port", "8000", "Port of the tcp socket")

		oldCpu  models.CPUStats
		newCpu  models.CPUStats
		oldNet  models.NetworkStats
		newNet  models.NetworkStats
		network models.Network
	)
	flag.Parse()

	if *token == "" {
		fmt.Println("--token is required")
		flag.Usage()
		os.Exit(1)
	}

	id, key, err := decodeToken(*token)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	conn, err := net.Dial("tcp", *host+":"+*port)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer conn.Close()

	err = socket.Login(conn, key, id)
	if err != nil {
		fmt.Println(err)
	}

	CPUName := systems.GetCPUName()
	err = socket.CPUName(conn, CPUName, id)
	if err != nil {
		fmt.Println(err)
	}

	go func() {
		ticker := time.NewTicker(1*time.Minute + 500*time.Millisecond)

		for range ticker.C {
			disks, err := systems.GetDisks()
			if err != nil {
				fmt.Println(err)
			}

			for _, disk := range disks {
				err = socket.Disk(conn, disk, id)
				if err != nil {
					fmt.Println(err)
				}
			}
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
			fmt.Println(err)
		}
		socket.Uptime(conn, uptime, id)

		err = socket.CPUUsage(conn, systems.GetCPUUsage(oldCpu, newCpu), id)
		if err != nil {
			fmt.Println(err)
		}

		network = systems.GetNetworkStats(&oldNet, &newNet)

		err = socket.Network(conn, network, newNet, id)
		if err != nil {
			fmt.Println(err)
		}

		oldCpu = newCpu
		oldNet = newNet

	}

	/* var hard models.HardMemory
	var swap models.SwapMemory

	var old models.CPUStats
	var new models.CPUStats

	var oldNetwork models.NetworkStats
	var newNetwork models.NetworkStats

	systems.GetMemory(&hard, &swap)
	systems.ReadCPU(&old)
	linux.ReadNetworkStats(&oldNetwork)

	fmt.Printf("Memory : %d / %d\n", hard.Total-hard.Free, hard.Total)
	fmt.Printf("Swap : %d / %d\n", swap.Total-swap.Free, swap.Total)
	fmt.Printf("CPU Name : %s\n", systems.GetCPUName())

	uptime, err := systems.GetUptime()
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Printf("Uptime : %d\n", uptime)
	}

	disks, err := systems.GetDisks()

	if err != nil {
		fmt.Println(err)
	}

	for i, disk := range disks {
		fmt.Printf("\n")
		fmt.Println("Disk " + strconv.Itoa(i))
		fmt.Println("Device     : " + disk.Device)
		fmt.Println("Name       : " + disk.Name)
		if disk.FreeSize == -1 {
			fmt.Println("Free size  : Unknown")
		} else {
			fmt.Println("Free size  : " + strconv.Itoa(int(disk.FreeSize)))
		}
		fmt.Println("Total size : " + strconv.Itoa(int(disk.TotalSize)))
		fmt.Printf("\n")
	}

	time.Sleep(1 * time.Second)
	systems.ReadCPU(&new)
	linux.ReadNetworkStats(&newNetwork)

	network := linux.GetNetworkStats(&oldNetwork, &newNetwork)
	fmt.Printf("Upload in 1 sec   : %d bytes\n", network.Upload)
	fmt.Printf("Download in 1 sec : %d bytes\n", network.Download)

	fmt.Printf("CPU Usage         : %.2f%s \n", systems.GetCPUUsage(old, new), "%") */
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
