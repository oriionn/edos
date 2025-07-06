package models

type NetworkStats struct {
	RBytes      uint64
	RPackets    uint64
	RErrs       uint64
	RDrop       uint64
	RFifo       uint64
	RFrame      uint64
	RCompressed uint64
	RMulticast  uint64

	TBytes      uint64
	TPackets    uint64
	TErrs       uint64
	TDrop       uint64
	TFifo       uint64
	TColls      uint64
	TCarrier    uint64
	TCompressed uint64
}

type Network struct {
	Upload   uint32
	Download uint32
}
