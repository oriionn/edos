package main

import (
	"edos/server/models"
	"edos/server/systems"
	"edos/server/systems/linux"
	"fmt"
	"strconv"
	"time"
)

func main() {
	var hard models.HardMemory
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

	fmt.Printf("CPU Usage         : %.2f%s \n", systems.GetCPUUsage(old, new), "%")
}
