// Displaying bonuses on screen
export interface Position {
    x: number,
    y: number
}

export interface ProductionOutput {
    index: number,
    value: number
}

export interface Bonus {
    x: number,
    y: number,
    timer: number,
    value: string
}

// Managing production
export interface ProductionType {
    id: number,
    title: string,
    icon: string,
    power: number
}

export interface ProductionDetail {
    productionType: ProductionType,
    currentProgress: number,
    levelClick: number,
    levelTime: number,
    levelValue: number
}

export interface SavedProductionDetail {
    currentProgress: number,
    levelClick: number,
    levelTime: number,
    levelValue: number
}

// Managing cards
export type CardElement = "Vanilla" | "Fire" | "Water" | "Earth" | "Wind";
export type CardSubtype = "Companion" | "Skill" | "Territory";
export type CardRarity = "Common" | "Uncommon" | "Rare" | "Mystic";

export interface CardSet {
    id: number,
    title: string,
    icon: string,
    cost: number,
    cards: Array<CardType>
}

export interface CardSetDetail {
    cardSet: CardSet,
    cards: Array<CardDetail>,
    byRarity: Record<CardRarity, Array<CardDetail>>,
    cardPacks: Array<PackType>
}

export interface CardType {
    id: string,
    title: string,
    icon: number,
    subtype: CardSubtype,
    cost: number,
    element: CardElement,
    stars: number
    rarity: CardRarity,
    evolvesFrom: string,
    set: CardSet
}

export interface CardDetail {
    cardType: CardType,
    count: number,
    foilCount: number,
    maxCount: number,
    maxFoilCount: number
}

export interface SavedSetDetail { 
}

export interface SavedCardDetail {
    id: string,
    count: number,
    foilCount: number
    maxCount: number,
    maxFoilCount: number
}

// Managing packs
export interface PackType {
    set: CardSetDetail,
    cardCount: number,
    foilBoost: number,
    texture: string,
    adjustment: string,
    alternateMax: number,
    currentAlternate: number,
    baseCost: number
}

export interface CardPackCard {
    card: CardDetail,
    count: number,
    foilCount: number
}

// Managing viewable windows
export type WindowType = "Store" | "Binder" | "Achievements" | "Settings";

export interface WindowOption {
    title: WindowType,
    image: string
}