package systems

import (
	"edos/server/models"
	"fmt"
	"os"
	"strings"

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
	swap.Total = info.Freeswap * coefficient

	return 0
}

func ReadCPU(stats *models.CPUStats) uint8 {
	file, err := os.ReadFile("/proc/cpuinfo")
	reader := strings.NewReader(string(file))

	if err != nil {
		return 1
	}

	_, err = fmt.Fscanf(reader, "cpu  %llu %llu %llu %llu %llu %llu %llu %llu %llu %llu",
		&stats.User, &stats.Nice, &stats.System, &stats.Idle,
		&stats.Iowait, &stats.Irq, &stats.Softirq, &stats.Steal,
		&stats.Guest, &stats.GuestNice)

	if err != nil {
		return 1
	}

	return 0
}
