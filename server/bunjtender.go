package main

import (
	"fmt"
	"github.com/bunjdo/bunjtender/internal/controllers"
	"github.com/bunjdo/bunjtender/internal/controllers/admin"
	"github.com/bunjdo/bunjtender/internal/entities"
	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
)

func main() {
	db, _ := gorm.Open(sqlite.Open("db.sqlite"), &gorm.Config{})

	err := db.AutoMigrate(&entities.Extra{}, &entities.Category{}, &entities.Item{})
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &controllers.Context{Context: c, DB: db}
			return next(cc)
		}
	})

	e.GET("/menu", controllers.GetMenu)

	e.POST("/login", admin.PostAdminLogin)

	adminGroup := e.Group("/admin")
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(admin.JWTCustomClaims)
		},
		SigningKey: []byte("secret"),
	}
	adminGroup.Use(echojwt.WithConfig(config))
	adminGroup.GET("/categories", controllers.GetCategories)

	e.Logger.Fatal(e.Start(":1323"))
}
