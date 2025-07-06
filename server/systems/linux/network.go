package linux

import (
	"bufio"
	"edos/server/models"
	"os"
	"strconv"
	"strings"
)

func ReadNetworkStats(stats *models.NetworkStats) error {
	file, err := os.Open("/proc/net/dev")
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		fields := strings.Fields(scanner.Text())
		if strings.HasSuffix(fields[0], ":") {
			fields = fields[1:]
			var data []uint64
			for _, field := range fields {
				value, err := strconv.Atoi(field)
				if err != nil {
					data = nil
					break
				}
				data = append(data, uint64(value))
			}

			if data != nil {
				stats.RBytes += data[0]
				stats.RPackets += data[1]
				stats.RErrs += data[2]
				stats.RDrop += data[3]
				stats.RFifo += data[4]
				stats.RFrame += data[5]
				stats.RCompressed += data[6]
				stats.RMulticast += data[7]

				stats.TBytes += data[8]
				stats.TPackets += data[9]
				stats.TErrs += data[10]
				stats.TFifo += data[11]
				stats.TColls += data[12]
				stats.TCarrier += data[13]
				stats.TCompressed += data[14]
			}
		}
	}

	return nil
}

func GetNetworkStats(old *models.NetworkStats, new *models.NetworkStats) models.Network {
	network := models.Network{
		Download: uint32(new.RBytes) - uint32(old.RBytes),
		Upload:   uint32(new.TBytes) - uint32(old.TBytes),
	}
	return network
}
