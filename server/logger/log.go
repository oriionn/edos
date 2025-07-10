package logger

import (
	"fmt"

	"github.com/fatih/color"
)

func log(emoji string, prefix string, info string) {
	c := color.RGB(126, 140, 157)
	fmt.Println(emoji, prefix, "\t\t", c.Sprintf("%s", info))
}
