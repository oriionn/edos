package linux

import (
	"bufio"
	"edos/server/models"
	"fmt"
	"os"
	"path"
	"strings"

	"golang.org/x/sys/unix"
)

func GetDisks() ([]models.Disk, error) {
	entries, err := os.ReadDir("/sys/class/block")

	if err != nil {
		return nil, err
	}

	var disks []models.Disk
	for _, entry := range entries {
		diskName := entry.Name()

		partition, err := os.ReadFile("/sys/class/block/" + diskName + "/partition")
		if err == nil && strings.TrimSpace(string(partition)) != "0" {
			continue
		}

		diskEntries, err := os.ReadDir("/sys/class/block/" + diskName)
		if err != nil {
			break
		}

		hasPartitions := false
		for _, diskEntry := range diskEntries {
			if strings.HasPrefix(diskEntry.Name(), diskName) {
				hasPartitions = true
				break
			}
		}

		if !hasPartitions {
			var d models.Disk
			getDisk(diskName, &d)
			disks = append(disks, d)
		} else {
			for _, diskEntry := range diskEntries {
				partition_name := diskEntry.Name()
				if strings.HasPrefix(partition_name, diskName) {
					var d models.Disk
					getDisk(partition_name, &d)
					disks = append(disks, d)
				}
			}
		}
	}

	return disks, nil
}

func getDisk(device string, disk *models.Disk) uint8 {
	disk.Device = device

	sizeFile, err := os.Open("/sys/class/block/" + device + "/size")
	if err != nil {
		return 1
	}
	defer sizeFile.Close()

	_, err = fmt.Fscanf(sizeFile, "%d", &disk.TotalSize)
	if err != nil {
		return 1
	}

	disk.TotalSize *= 512

	mountpoint := GetMountpoint(device)
	if mountpoint == "" {
		disk.Name = device
		disk.FreeSize = -1
	} else {
		var stats unix.Statfs_t
		err := unix.Statfs(mountpoint, &stats)
		if err == nil {
			disk.FreeSize = int64(stats.Bavail) * int64(stats.Bsize)
		} else {
			disk.FreeSize = -1
		}

		if mountpoint == "/" {
			disk.Name = "Main"
		} else {
			disk.Name = path.Base(mountpoint)
		}
	}

	return 0
}

func GetMountpoint(device string) string {
	mounts, err := os.Open("/proc/mounts")
	if err != nil {
		return ""
	}
	defer mounts.Close()

	scanner := bufio.NewScanner(mounts)
	for scanner.Scan() {
		fields := strings.Fields(scanner.Text())
		if len(fields) >= 2 && fields[0] == "/dev/"+device {
			return fields[1]
		}
	}

	return ""
}
