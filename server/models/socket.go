package models

type DataType int

const (
	CPUUsage DataType = iota // SocketData
	CPUName                  // SocketData
	Disks                    // DiskSocketData
	Memory                   // SocketData
	Networks                 // SocketData
	Uptime                   // SocketData
	Init                     // SocketData
)

type SocketData struct {
	Id   int
	Type DataType
	Data string
}

type DiskSocketData struct {
	Id   int
	Type DataType
	Data Disk
}
