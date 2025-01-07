package entities

type Bar struct {
	ID         uint `gorm:"primarykey"`
	Name       string
	Token      string `json:"-"`
	AdminID    uint
	Customers  []Customer `json:"-"`
	Categories []Category `json:"-"`
	Items      []Item     `json:"-"`
	Disabled   bool       `json:"-"`
}
