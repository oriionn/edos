package systems

import (
	"edos/server/models"
	"edos/server/systems/linux"
	"errors"
	"runtime"
)

func GetMemory(hard *models.HardMemory, swap *models.SwapMemory) uint8 {
	switch runtime.GOOS {
	case "linux":
		return linux.GetMemory(hard, swap)
	default:
		return 1
	}
}

func ReadCPU(stats *models.CPUStats) uint8 {
	switch runtime.GOOS {
	case "linux":
		return linux.ReadCPU(stats)
	default:
		return 1
	}
}

func GetCPUUsage(old models.CPUStats, new models.CPUStats) float32 {
	switch runtime.GOOS {
	case "linux":
		return linux.GetCPUUsage(old, new)
	default:
		return 10000000.0
	}
}

func GetCPUName() string {
	switch runtime.GOOS {
	case "linux":
		return linux.GetCPUName()
	default:
		return ""
	}
}

func GetDisks() ([]models.Disk, error) {
	switch runtime.GOOS {
	case "linux":
		return linux.GetDisks()
	default:
		return nil, errors.New("Unknown OS")
	}
}

func GetUptime() (uint64, error) {
	switch runtime.GOOS {
	case "linux":
		return linux.GetUptime()
	default:
		return 0, errors.New("Unknown OS")
	}
}

func ReadNetworkStats(stats *models.NetworkStats) error {
	switch runtime.GOOS {
	case "linux":
		return linux.ReadNetworkStats(stats)
	default:
		return errors.New("Unknown OS")
	}
}

func GetNetworkStats(old *models.NetworkStats, new *models.NetworkStats) models.Network {
	switch runtime.GOOS {
	case "linux":
		return linux.GetNetworkStats(old, new)
	default:
		return models.Network{
			Download: 0,
			Upload:   0,
		}
	}
}
