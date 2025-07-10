package logger

import "github.com/fatih/color"

func Debug(text string) {
	c := color.New(color.FgBlue).Add(color.Underline)
	log("🐛", c.Sprintf("debug"), text)
}
