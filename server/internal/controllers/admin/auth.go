package admin

import (
	"github.com/bunjdo/bunjtender/internal/controllers"
	"github.com/bunjdo/bunjtender/internal/entities"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
	"time"
)

type JWTCustomClaims struct {
	ID uint `json:"id"`
	jwt.RegisteredClaims
}

type adminLoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type adminLoginOutput struct {
	Token string `json:"token"`
}

func PostLogin(c echo.Context) error {
	var input adminLoginInput
	if err := c.Bind(&input); err != nil {
		return echo.ErrBadRequest
	}

	db := (c.(*controllers.Context)).DB

	admin := entities.Admin{
		Email:    input.Email,
		Password: []byte(input.Password),
	}
	if err := admin.QueryByEmailPassword(db); err != nil {
		return echo.ErrUnauthorized
	}

	claims := JWTCustomClaims{
		admin.ID,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("BUNJTENDER_JWT_SECRET")))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, &adminLoginOutput{Token: tokenString})
}

func AdminFromAuth(c echo.Context, admin *entities.Admin) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTCustomClaims)
	admin.ID = claims.ID

	return admin.Query(c.(*controllers.Context).DB)
}

func GetAdmin(c echo.Context) error {
	var admin entities.Admin
	if err := AdminFromAuth(c, &admin); err != nil {
		return echo.ErrUnauthorized
	}

	return c.JSON(http.StatusOK, &admin)
}
