package linux

import (
	"edos/server/models"
	"fmt"
	"os"
	"strings"
)

func ReadCPU(stats *models.CPUStats) uint8 {
	file, err := os.ReadFile("/proc/stat")
	reader := strings.NewReader(string(file))

	if err != nil {
		return 1
	}

	_, err = fmt.Fscanf(reader, "cpu  %d %d %d %d %d %d %d %d %d %d",
		&stats.User, &stats.Nice, &stats.System, &stats.Idle,
		&stats.Iowait, &stats.Irq, &stats.Softirq, &stats.Steal,
		&stats.Guest, &stats.GuestNice)

	if err != nil {
		return 1
	}

	return 0
}

func GetCPUUsage(old models.CPUStats, new models.CPUStats) float32 {
	var (
		oldIdle    uint64 = old.Idle + old.Iowait
		idle       uint64 = new.Idle + new.Iowait
		oldNonIdle uint64 = old.User + old.Nice + old.System + old.Irq + old.Softirq + old.Steal
		nonIdle    uint64 = new.User + new.Nice + new.System + new.Irq + new.Softirq + new.Steal

		oldTotal uint64 = oldIdle + oldNonIdle
		total    uint64 = idle + nonIdle

		totald = total - oldTotal
		idled  = idle - oldIdle
	)

	return (float32(totald-idled) / float32(totald)) * 100
}
