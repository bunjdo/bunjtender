package controllers

import (
	"github.com/bunjdo/bunjtender/internal/entities"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetMenu(c echo.Context) error {
	menu, err := entities.QueryAvailableMenu((c.(*Context)).DB)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, &menu)
}
