
// Displaying bonuses on screen
export interface Position {
    x: number,
    y: number
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

// Managing viewable windows
export type WindowType = "Labor" | "Store" | "Collection" | "Achievements" | "Settings";

export interface WindowOption {
    title: WindowType,
    image: string
}