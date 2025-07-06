package models

type Disk struct {
	Device    string
	Name      string
	FreeSize  int64
	TotalSize int64
}
