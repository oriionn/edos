#include "models.h"
#include <linux/sysinfo.h>
#include <sys/sysinfo.h>

int getMemory(struct HardMemory *hardMemory, struct SwapMemory *swapMemory) {
    struct sysinfo info;

    if (sysinfo(&info) != 0) {
        return 1;
    }

    int factor = 1;
    if (info.mem_unit != 0) {
        factor = info.mem_unit;
    }

    unsigned long total_mem = info.totalram * factor;
    unsigned long free_mem = info.freeram * factor;
    unsigned long total_swap = info.totalswap * factor;
    unsigned long free_swap = info.totalswap * factor;

    hardMemory->free = free_mem;
    hardMemory->total = total_mem;
    swapMemory->free = free_swap;
    swapMemory->total = total_swap;

    return 0;
}
