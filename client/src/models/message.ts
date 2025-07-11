export enum DataType {
    CPU_USAGE,
    CPU_NAME,
    DISK,
    MEMORY,
    NETWORKS,
    UPTIME,
    INIT,
}

export interface Disk {
    Device: string;
    Name: string;
    FreeSize: number;
    TotalSize: number;
}

export interface Message {
    Id: number;
    Type: DataType;
    Data: string | Disk;
}