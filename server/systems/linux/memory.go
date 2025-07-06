package linux

import (
	"edos/server/models"

	"golang.org/x/sys/unix"
)

func GetMemory(hard *models.HardMemory, swap *models.SwapMemory) uint8 {
	var info unix.Sysinfo_t
	var coefficient uint64

	err := unix.Sysinfo(&info)
	if err != nil {
		return 1
	}

	coefficient = 1
	if info.Unit != 0 {
		coefficient = uint64(info.Unit)
	}

	hard.Free = info.Freeram * coefficient
	hard.Total = info.Totalram * coefficient
	swap.Free = info.Freeswap * coefficient
	swap.Total = info.Totalswap * coefficient

	return 0
}
