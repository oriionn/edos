package main

import (
	"edos/server/models"
	"edos/server/systems"
	"fmt"
)

func main() {
	var hard models.HardMemory
	var swap models.SwapMemory

	systems.GetMemory(&hard, &swap)

	fmt.Printf("Memory : %d / %d\n", hard.Free, hard.Total)
	fmt.Printf("Swap : %d / %d\n", swap.Free, swap.Total)
}
