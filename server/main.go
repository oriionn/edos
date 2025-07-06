package main

import (
	"edos/server/models"
	"edos/server/systems"
	"fmt"
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

	time.Sleep(5 * time.Second)
	systems.ReadCPU(&new)

	fmt.Printf("CPU Usage : %.2f%s \n", systems.GetCPUUsage(old, new), "%")
}
