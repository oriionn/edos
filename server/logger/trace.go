package logger

import "github.com/fatih/color"

func Trace(text string) {
	c := color.New(color.FgCyan).Add(color.Underline)
	log("🔍", c.Sprintf("trace"), text)
}
