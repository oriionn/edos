#include <stdio.h>
#include "linux.h"

int main() {
    struct HardMemory ram;
    struct SwapMemory swap;

    if (getMemory(&ram, &swap) != 0) {
        fprintf(stderr, "Unable to retrieve memory information\n");
        return 1;
    }

    printf("Memory : %lu / %lu\n", ram.free, ram.total);
    printf("Swap : %lu / %lu\n", swap.free, swap.total);

    return 0;
}
