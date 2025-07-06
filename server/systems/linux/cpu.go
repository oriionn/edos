package linux

import (
	"bufio"
	"edos/server/models"
	"fmt"
	"os"
	"strings"
)

func ReadCPU(stats *models.CPUStats) uint8 {
	file, err := os.Open("/proc/stat")

	if err != nil {
		return 1
	}

	_, err = fmt.Fscanf(file, "cpu  %d %d %d %d %d %d %d %d %d %d",
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

func GetCPUName() string {
	file, err := os.Open("/proc/cpuinfo")

	if err != nil {
		return ""
	}

	defer file.Close()

	// var name string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "model name") {
			splitted := strings.Split(line, ":")
			if len(splitted) > 1 {
				return strings.Trim(splitted[1], " ")
			}
		}
	}

	return ""
}
