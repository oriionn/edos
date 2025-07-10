package logger

import "github.com/fatih/color"

func Warn(text string) {
	c := color.New(color.FgYellow).Add(color.Underline)
	log("⚡", c.Sprintf("warn"), text)
}
