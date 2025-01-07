package entities

type ExtraType string

const (
	ExtraTypeChecklist ExtraType = "checklist"
	ExtraTypeRadio     ExtraType = "radio"
)

type Feature string

const (
	FeatureSpicy      Feature = "spicy"
	FeatureVegetarian Feature = "vegetarian"
	FeatureWarm       Feature = "warm"
	FeatureCold       Feature = "cold"
)

type Menu = map[string][]Item
