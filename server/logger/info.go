package logger

import "github.com/fatih/color"

func Info(text string) {
	c := color.New(color.FgGreen).Add(color.Underline)
	log("✨", c.Sprintf("info"), text)
}
