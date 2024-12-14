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
    # fire
    ("Own Fire Cards", "fire2", "",              2, 7, 1, -1, ownCardsGoal, blankTrigger, "Fire"),
    ("Own Unique Fire Cards", "fire3", "",       2, 4, 1, -2, ownUniqueGoal, blankTrigger, "UniqueFire"),
    ("Own 10x Fire Cards", "fire", "",           2, 4, 1, -2, ownUniqueGoal, blankTrigger, "10xFire"),
    ("Own 100x Fire Cards", "fire5", "",         2, 4, 1, -2, ownUniqueGoal, blankTrigger, "100xFire"),
    ("Own Foil Fire Cards", "fire4", "",         3, 8, 1, -2, ownCardsGoal, blankTrigger, "FoilFire"),
    ("Own Unique Foil Fire Cards", "fire6", "",  3, 5, 1, -3, ownUniqueGoal, blankTrigger, "UniqueFoilFire"),
    ("Own 10x Foil Fire Cards", "fire7", "",     3, 5, 1, -3, ownUniqueGoal, blankTrigger, "10xFoilFire"),
    ("Own 100x Foil Fire Cards", "fire8", "",    3, 5, 1, -3, ownUniqueGoal, blankTrigger, "100xFoilFire"),
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