package entities

import (
	"gorm.io/gorm"
)

type Extra struct {
	ID     uint      `json:"id" gorm:"primarykey"`
	Name   string    `json:"name"`
	Type   ExtraType `json:"type"`
	Items  []string  `json:"items" gorm:"serializer:json"`
	ItemID uint      `json:"-"`
}

type Category struct {
	ID       uint   `json:"id" gorm:"primarykey"`
	Name     string `json:"name" gorm:"uniqueIndex"`
	Items    []Item `json:"items"`
	BarID    uint   `json:"-"`
	Disabled bool   `json:"disabled"`
}

type Item struct {
	ID          uint      `json:"id" gorm:"primarykey"`
	Name        string    `json:"name"`
	Subtitle    string    `json:"subtitle"`
	Image       string    `json:"image"`
	Description string    `json:"description"`
	Recipe      string    `json:"recipe"`
	Extras      []Extra   `json:"extras"`
	Features    []Feature `json:"features" gorm:"serializer:json"`
	CategoryID  uint      `json:"-"`
	BarID       uint      `json:"-"`
	Disabled    bool      `json:"disabled"`
}

func QueryAvailableMenuItems(db *gorm.DB) ([]Item, error) {
	var items []Item
	err := db.Model(&Item{}).Preload("Extra").Preload("Category").Where(
		&Item{Disabled: false},
	).Where(
		&Category{Disabled: false},
	).Find(&items).Error
	return items, err
}

func QueryAvailableCategories(db *gorm.DB) (*[]Category, error) {
	var categories []Category

	err := db.Model(&Category{}).Preload("Items").Preload("Items.Extras").Where(
		&Category{Disabled: false},
	).Where(
		&Item{Disabled: false},
	).Find(&categories).Error

	return &categories, err
}

func QueryAvailableMenu(db *gorm.DB) (Menu, error) {
	categories, err := QueryAvailableCategories(db)

	var menu = make(Menu)
	for _, element := range *categories {
		menu[element.Name] = element.Items
	}

	return menu, err
}
