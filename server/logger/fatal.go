package logger

import "github.com/fatih/color"

func Fatal(text string) {
	c := color.New(color.FgHiRed).Add(color.Underline)
	log("💀", c.Sprintf("fatal"), text)
}
