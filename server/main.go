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

	systems.GetMemory(&hard, &swap)
	systems.ReadCPU(&old)

	fmt.Printf("Memory : %d / %d\n", hard.Total-hard.Free, hard.Total)
	fmt.Printf("Swap : %d / %d\n", swap.Total-swap.Free, swap.Total)
	fmt.Printf("CPU Name : %s\n", systems.GetCPUName())

	disks, err := linux.GetDisks()

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

	time.Sleep(5 * time.Second)
	systems.ReadCPU(&new)

	fmt.Printf("CPU Usage : %.2f%s \n", systems.GetCPUUsage(old, new), "%")
}
