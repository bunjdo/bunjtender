package entities

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Admin struct {
	ID       uint   `gorm:"primarykey"`
	Email    string `gorm:"uniqueIndex"`
	Password []byte `json:"-"`
	Disabled bool
	Bars     []Bar `json:"-"`
}

type Customer struct {
	ID                uint `gorm:"primarykey"`
	Name              string
	NotificationToken string `json:"-"`
	BarID             uint   `json:"-"`
}

func (admin *Admin) QueryByEmailPassword(db *gorm.DB) error {
	var err error

	if err = db.Model(Admin{Email: admin.Email}).Take(admin).Error; err == nil {
		err = bcrypt.CompareHashAndPassword(admin.Password, admin.Password)
	}

	return err
}

func (admin *Admin) Query(db *gorm.DB) error {
	return db.Take(admin).Error
}

func (customer *Customer) Query(db *gorm.DB) error {
	return db.Take(customer).Error
}
