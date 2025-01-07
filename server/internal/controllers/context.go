package controllers

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type Context struct {
	echo.Context
	DB *gorm.DB
}

func (c *Context) Foo() {
	println("foo")
}
