export type MenuItemExtraType = "checklist" | "radio";
export type MenuItemFeature = "spicy" | "vegetarian" | "warm" | "cold";

export interface MenuItemExtra {
    name: string;
    type: MenuItemExtraType;
    items: Array<string>;
}

export interface MenuItem {
    id: string;
    name: string;
    imageUrl: string | null;
    shortDescription: string;
    longDescription?: string;
    recipe?: string;
    extras: Record<string, MenuItemExtra>;
    features: Array<MenuItemFeature>;
    disabled?: boolean;
}

export type Menu = Record<string, Array<MenuItem>>;

export const menu: Menu = {
    "Food": [
        {
            id: "01908b77-db90-792b-8fde-91b9ea9e06c0",
            name: "Vegetarian stew",
            imageUrl: null,
            shortDescription: "Vegetarian stew",
            longDescription: "Vegetarian stew",
            extras: {
                "checklist": {
                    name: "Checklist",
                    type: "checklist",
                    items: ["1", "2", "3", "4", "5", "6"],
                },
                "radio": {
                    name: "Radio",
                    type: "radio",
                    items: ["1", "2", "3", "4", "5", "6"],
                },
                "checklist2": {
                    name: "Checklist2",
                    type: "checklist",
                    items: ["1", "2", "3", "4", "5", "6"],
                },
            },
            features: ["spicy", "vegetarian"],
        },
        {
            id: "01908b77-db90-792b-8fde-91b9ea9e06c1",
            name: "stew",
            imageUrl: null,
            shortDescription: "Vegetarian stew",
            longDescription: "Vegetarian stew",
            extras: {},
            features: [],
        },
    ],
    "Soft drinks": [],
    "Wine & Beer": [],
    "Mocktails": [
        {
            id: "65aedfcf-73d0-4787-b610-97224b1b1990",
            name: "Shirley temple",
            imageUrl: "/img/cocktails/shirley-temple.webp",
            shortDescription: "Sweet, refreshing non-alcoholic drink",
            longDescription: "ginger ale, lime juice, grenadine",
            recipe: `
150ml ginger ale
25ml lime juice
15ml grenadine
1 maraschino cherry

pour ginger ale and lime juice into glass with ice, slowly add grenadine
top up with extra ale if needed, serve with cherry`,
            extras: {},
            features: [],
        },
        {
            id: "13ca7ed9-d831-4c91-818b-d069d2d1d187",
            name: "Virgin mojito",
            imageUrl: "/img/cocktails/mojito.webp",
            shortDescription: "Signature cocktail for pussies",
            longDescription: "soda water, sugar, lime, mint",
            recipe: `
soda water
1 tbsp sugar
small bunch mint
1/2 lime

mud sugar, lime and mint in glass, put ice and cover with soda, stir`,
            extras: {},
            features: [],
        },
    ],
    "Cocktails": [
        {
            id: "5123d586-b55e-4b7e-89eb-5a9483f06d03",
            name: "Winter whiskey sour",
            imageUrl: "/img/cocktails/winter-whisky-sour.webp",
            shortDescription: "Strong, on the rocks",
            longDescription: "whiskey, lemon juice, orange juice, sugar syrup",
            recipe: `
50ml whiskey
1 tbsp fresh lemon juice
1 tbsp fresh orange juice
½ tbsp sugar syrup
2 slices of oranges

shake, strain, serve over crushed ice`,
            extras: {},
            features: [],
        },
        {
            id: "94247166-0798-4e69-8c31-5c316aa3460e",
            name: "Daiquiri",
            imageUrl: "/img/cocktails/daiquiri.webp",
            shortDescription: "Strong, on the rocks",
            longDescription: "white rum, lime juice, sugar syrup",
            recipe: `
50ml white rum
25ml lime juice
10ml sugar syrup
slice of lime

shake, strain, serve with lime slice on the side`,
            extras: {},
            features: [],
        },
        {
            id: "18b9fc28-3d62-4714-b69f-f1c8c5b62d85",
            name: "Mojito",
            imageUrl: "/img/cocktails/mojito.webp",
            shortDescription: "Long drink",
            longDescription: "soda water, white rum, sugar, lime, mint",
            recipe: `
soda water
60ml white rum
1 tbsp sugar
small bunch mint
1/2 lime

mud sugar, lime and mint in glass, put ice with rum and cover with soda, stir`,
            extras: {},
            features: [],
        },
        {
            id: "0bfeaf87-6ca8-4f51-bfd6-db2489d4a7db",
            name: "Cuba Libre",
            imageUrl: "/img/cocktails/cuba-libre.webp",
            shortDescription: "Long drink",
            longDescription: "white rum, lime, cola",
            recipe: `
15ml lime juice
2 slices of lime
50ml white rum
100ml cola

pour & stir over ice`,
            extras: {},
            features: [],
        },
        {
            id: "3796b2cc-713b-44bc-9ec1-c214c49deee8",
            name: "Piña colada",
            imageUrl: "/img/cocktails/pina-colada.webp",
            shortDescription: "Long drink",
            longDescription: "white rum, pineapple juice, coconut cream",
            recipe: `
120ml pineapple juice
60ml white rum
60ml coconut cream

pour & stir over crushed ice`,
            extras: {},
            features: [],
        },
        {
            id: "b78d1050-0a66-4f88-9de7-6abc4b7df23f",
            name: "Moscow mule",
            imageUrl: "/img/cocktails/moscow-mule.webp",
            shortDescription: "Long drink, my comrade!",
            longDescription: "vodka, ginger beer, proletarian revolution",
            recipe: `
50ml vodka
150-200ml ginger beer
ginger bitters/ginger/ginger powder
mint for garnish
lime/lime juice for squeeze over

pour & stir over ice`,
            extras: {},
            features: [],
        },
        {
            id: "df0f7494-2d89-4066-92b4-b2808ca33dfa",
            name: "Blue lagoon",
            imageUrl: "/img/cocktails/blue-lagoon.webp",
            shortDescription: "Long drink",
            longDescription: "vodka, blue curaçao, lemon juice, soda water",
            recipe: `
30ml blue curaçao
30ml vodka
if soda, 15ml lemon juice
if soda, 10ml sugar sirup
120ml soda water/lemonade

pour & stir over ice`,
            extras: {},
            features: [],
        },
        {
            id: "6e3c5c41-755a-4ee9-89b5-80f30ffde9d9",
            name: "Margarita",
            imageUrl: "/img/cocktails/margarita.webp",
            shortDescription: "Strong, on the rocks",
            longDescription: "vodka, ginger beer, proletarian revolution",
            recipe: `
50ml tequila
25ml lime juice
20ml triple sec
salt on the edge
2 lime slices, one on the edge

put salt on the edge of the glass
shake & strain, put 1 slice of lime into the glass and one on the edge`,
            extras: {},
            features: [],
        },
        {
            id: "1c2c9aa8-2447-4463-b0c5-f0636d6b0bfd",
            name: "Ranch Water",
            imageUrl: "/img/cocktails/ranch-water.webp",
            shortDescription: "Long drink",
            longDescription: "tequila, lime juice, soda water",
            recipe: `
50ml tequila
15ml lime juice
soda water
lime slice for garnish

pour & stir over ice`,
            extras: {},
            features: [],
        },
        {
            id: "060f08d8-f7c9-4880-a052-1e9968e3b2f9",
            name: "Tequila sunrise",
            imageUrl: "/img/cocktails/tequila-sunrise.webp",
            shortDescription: "Long drink",
            longDescription: "tequila, lime juice, soda water",
            recipe: `
50ml tequila
15ml grenadine
10ml triple sec
120ml orange juice
half of slice of orange for garnish

pour grenadine into glass base, add ice
shake everything and strain into glass
add orange slice & ice/orange juice till full`,
            extras: {},
            features: [],
        },
    ],
}

export const menuItems: Record<string, MenuItem> = Object.fromEntries(
    Object.values(menu).flat().map(
        (item) => [item.id, item]
    )
);
