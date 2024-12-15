f = open("data.ts", "w")
f.write('import { AchievementData } from "./interfaces"')
f.write("\n\nexport var achievementData: Array<AchievementData> = [")
   
def blankGoal(difficulty, _):
    return "{}"
    
def blankTrigger(difficulty, _):
    return "{}"
    
def haveMoneyGoal(difficulty, _):
    val = pow(10, difficulty + 1)
    return "{haveMoney: " + str(val) + "}"
    
def ownCardsGoal(difficulty, adjuster):
    val = pow(10, difficulty + 1)
    return "{ownCards" + adjuster + ": " + str(val) + "}"
    
def ownUniqueGoal(difficulty, adjuster):
    val = pow(5, difficulty + 1)
    return "{ownCards" + adjuster + ": " + str(val) + "}"
   
def clickButtonTrigger(difficulty, _): 
    val = pow(10, difficulty)
    return "{clickButton: " + str(val) + "}"

def earnMoneyTrigger(difficulty, _):
    val = pow(10, difficulty)
    return "{earnMoney: " + str(val) + "}"
    
def buyPackTrigger(difficulty, adjuster):
    val = pow(10, difficulty)
    return "{buyPack" + adjuster + ": " + str(val) + "}"
   
types = [
    ("Click Button", "button", "", 1, 6, 1, 0, blankGoal, clickButtonTrigger, ""),
    ("Earn Money", "cash", "", 1, 6, 1, 0, blankGoal, earnMoneyTrigger, ""),
    ("Have Money", "bag", "", 1, 6, 1, 0, haveMoneyGoal, blankTrigger, ""),
    ("Buy Packs", "packs", "", 1, 6, 1, 0, blankGoal, buyPackTrigger, ""),
    ("Buy Premium Packs", "packspremium", "", 1, 6, 1, -1, blankGoal, buyPackTrigger, "Premium"),
    ("Buy Deluxe Packs", "packsdeluxe", "", 1, 6, 1, -1, blankGoal, buyPackTrigger, "Deluxe"),
    # base
    ("Own Cards", "card", "",                    1, 6, 1, 0, ownCardsGoal, blankTrigger, ""),
    ("Own Unique Cards", "book3", "",            1, 3, 1, -1, ownUniqueGoal, blankTrigger, "Unique"),
    ("Own 10x Cards", "book2", "",               1, 3, 1, -1, ownUniqueGoal, blankTrigger, "10x"),
    ("Own 100x Cards", "book", "",               1, 3, 1, -1, ownUniqueGoal, blankTrigger, "100x"),
    ("Own Foil Cards", "gem", "",                2, 7, 1, -1, ownCardsGoal, blankTrigger, "Foil"),
    ("Own Unique Foil Cards", "gem2", "",        2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueFoil"),
    ("Own 10x Foil Cards", "gem3", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xFoil"),
    ("Own 100x Foil Cards", "gem4", "",          2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xFoil"),
    # vanilla
    ("Own Vanilla Cards", "vanilla", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Vanilla"),
    ("Own Unique Vanilla Cards", "vanilla2", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueVanilla"),
    ("Own 10x Vanilla Cards", "vanilla3", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xVanilla"),
    ("Own 100x Vanilla Cards", "vanilla4", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xVanilla"),
    ("Own Foil Vanilla Cards", "vanilla5", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilVanilla"),
    ("Own Unique Foil Vanilla Cards", "vanilla6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilVanilla"),
    ("Own 10x Foil Vanilla Cards", "vanilla7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilVanilla"),
    ("Own 100x Foil Vanilla Cards", "vanilla8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilVanilla"),
    # fire
    ("Own Fire Cards", "fire2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Fire"),
    ("Own Unique Fire Cards", "fire3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueFire"),
    ("Own 10x Fire Cards", "fire", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xFire"),
    ("Own 100x Fire Cards", "fire5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xFire"),
    ("Own Foil Fire Cards", "fire4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilFire"),
    ("Own Unique Foil Fire Cards", "fire6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilFire"),
    ("Own 10x Foil Fire Cards", "fire7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilFire"),
    ("Own 100x Foil Fire Cards", "fire8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilFire"),
    # water
    ("Own Water Cards", "water2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Water"),
    ("Own Unique Water Cards", "water3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueWater"),
    ("Own 10x Water Cards", "water", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xWater"),
    ("Own 100x Water Cards", "water5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xWater"),
    ("Own Foil Water Cards", "water4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilWater"),
    ("Own Unique Foil Water Cards", "water6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilWater"),
    ("Own 10x Foil Water Cards", "water7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilWater"),
    ("Own 100x Foil Water Cards", "water8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilWater"),
    # earth
    ("Own Earth Cards", "earth2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Earth"),
    ("Own Unique Earth Cards", "earth3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueEarth"),
    ("Own 10x Earth Cards", "earth", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xEarth"),
    ("Own 100x Earth Cards", "earth5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xEarth"),
    ("Own Foil Earth Cards", "earth4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilEarth"),
    ("Own Unique Foil Earth Cards", "earth6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilEarth"),
    ("Own 10x Foil Earth Cards", "earth7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilEarth"),
    ("Own 100x Foil Earth Cards", "earth8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilEarth"),
    # wind
    ("Own Wind Cards", "wind2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Wind"),
    ("Own Unique Wind Cards", "wind3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueWind"),
    ("Own 10x Wind Cards", "wind", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xWind"),
    ("Own 100x Wind Cards", "wind5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xWind"),
    ("Own Foil Wind Cards", "wind4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilWind"),
    ("Own Unique Foil Wind Cards", "wind6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilWind"),
    ("Own 10x Foil Wind Cards", "wind7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilWind"),
    ("Own 100x Foil Wind Cards", "wind8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilWind"),
    # companion
    ("Own Companion Cards", "companion2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Companion"),
    ("Own Unique Companion Cards", "companion3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueCompanion"),
    ("Own 10x Companion Cards", "companion", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xCompanion"),
    ("Own 100x Companion Cards", "companion5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xCompanion"),
    ("Own Foil Companion Cards", "companion4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilCompanion"),
    ("Own Unique Foil Companion Cards", "companion6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilCompanion"),
    ("Own 10x Foil Companion Cards", "companion7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilCompanion"),
    ("Own 100x Foil Companion Cards", "companion8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilCompanion"),
    # territory
    ("Own Territory Cards", "territory2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Territory"),
    ("Own Unique Territory Cards", "territory3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueTerritory"),
    ("Own 10x Territory Cards", "territory", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xTerritory"),
    ("Own 100x Territory Cards", "territory5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xTerritory"),
    ("Own Foil Territory Cards", "territory4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilTerritory"),
    ("Own Unique Foil Territory Cards", "territory6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilTerritory"),
    ("Own 10x Foil Territory Cards", "territory7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilTerritory"),
    ("Own 100x Foil Territory Cards", "territory8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilTerritory"),
    # skill
    ("Own Skill Cards", "skill2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Skill"),
    ("Own Unique Skill Cards", "skill3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueSkill"),
    ("Own 10x Skill Cards", "skill", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xSkill"),
    ("Own 100x Skill Cards", "skill5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xSkill"),
    ("Own Foil Skill Cards", "skill4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilSkill"),
    ("Own Unique Foil Skill Cards", "skill6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilSkill"),
    ("Own 10x Foil Skill Cards", "skill7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilSkill"),
    ("Own 100x Foil Skill Cards", "skill8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilSkill"),
]
   
id = 0
for index, type in enumerate(types):
    name, icon, text, start, end, change, deviation, goalFunction, triggerFunction, adjuster = type
    
    for d_index, difficulty in enumerate(range(start, end, change)):
        f.write("\n    {")
        f.write(f"\n        id: {id}, name: '{name} ({d_index+1})', icon: '{icon}', text: '{text}', difficulty: {difficulty},")
        f.write(f"\n        completionGoals: {goalFunction(difficulty + deviation, adjuster)}, completionTriggers: {triggerFunction(difficulty + deviation, adjuster)},")
        f.write("\n    },")
    
        id += 1
    
f.write("\n]")