package linux

import "golang.org/x/sys/unix"

func GetUptime() (uint64, error) {
	var info unix.Sysinfo_t

	err := unix.Sysinfo(&info)
	if err != nil {
		return 0, err
	}

	return uint64(info.Uptime), nil
}
