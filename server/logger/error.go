package logger

import "github.com/fatih/color"

func Error(text string) {
	c := color.New(color.FgRed).Add(color.Underline)
	log("❌", c.Sprintf("error"), text)
}
