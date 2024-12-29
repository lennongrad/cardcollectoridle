f = open("card.csv", "w")


base_set = "---,Base Set,base,5"
meta_set = "---,Metamorphosis,metamorphosis,5"
surv_set = "---,Survival,survival,5"
dom_set = "---,Domination,domination,5"

m = open("monster.csv", "r")
last_name = "" 
evolution_chain = 0

for line in m:
    icon, name, evolution, element, base, meta, surv, dom, _, _, _ = line.split(",")
    
    evolution_chain += 1
    if last_name != evolution:
        evolution_chain = 0
    last_name = name
    cost = 1 + evolution_chain
    rarity = ["Common", "Uncommon", "Rare", "Mystic"][evolution_chain]
    
    new_line = f"\n{name},Companion,{evolution},{cost},{element},{cost+1},{rarity},{icon}"
    
    if base:
        base_set += new_line
    if meta:
        meta_set += new_line
    if surv:
        surv_set += new_line
    if dom:
        dom_set += new_line
    
f.write(base_set + "\n")
f.write(meta_set + "\n")
f.write(surv_set + "\n")
f.write(dom_set )


