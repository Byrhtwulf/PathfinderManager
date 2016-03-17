'use strict';

var MonsterService = angular.module('PathfinderManager.MonsterService');

MonsterService.service('MonsterMigrator', function(){


    this.createMonsterFromDatabase = function(){
        var monsterFromDatabase = this.monstersFromDatabase[0];
        var newMonster = {
            name: monsterFromDatabase.Name,
            type: monsterFromDatabase.Alignment + " " + monsterFromDatabase.Size + " " + monsterFromDatabase.Type + " " + monsterFromDatabase.Subtype,
            initiative: monsterFromDatabase.Initiative,
            senses: monsterFromDatabase.Senses,
            auras: monsterFromDatabase.Auras,
            AC: monsterFromDatabase.AC + " " + monsterFromDatabase.AC_Mods,
            HP: monsterFromDatabase.HP,
            HD: monsterFromDatabase.HD,
            HPmods: monsterFromDatabase.HP_Mods,
            fortitude: monsterFromDatabase.Fort,
            reflex: monsterFromDatabase.Ref,
            will: monsterFromDatabase.Will,
            saveMods: monsterFromDatabase.Save_Mods,
            defenses: monsterFromDatabase.DR + ", Immune: " + monsterFromDatabase.Immune + ", Resist: " + monsterFromDatabase.Resist + ", SR: " + monsterFromDatabase.SR + " " + monsterFromDatabase.Defensive_Abilities,
            defensiveAbilities: monsterFromDatabase.Defensive_Abilities,
            weaknesses: monsterFromDatabase.Weaknesses,
            speed: monsterFromDatabase.Speed + " " + monsterFromDatabase.Speed_Mods,
            space: monsterFromDatabase.Space,
            reach: monsterFromDatabase.Reach,
            attacks: [],
            baseAttack: monsterFromDatabase.Base_Attack,
            CMB: 0,
            CMBMods:"",
            currentCMB: 0,
            currentCMBRoll: 0,
            CMD: monsterFromDatabase.CMD,
            specialAttacks: monsterFromDatabase.Special_Attacks,
            specialQualities: monsterFromDatabase.Special_Qualities,
            abilityScores: monsterFromDatabase.Ability_Scores,
            spellLikeAbilities: [],
            spellsKnown:[],
            spellsPrepared:[],
            specialAbilities:[],
            feats: monsterFromDatabase.Feats,
            skills: monsterFromDatabase.Skills,
            description: monsterFromDatabase.Description,
            additionalNotes: []
        }

        this.generateMonsterAttacks(monsterFromDatabase, newMonster);
        this.generateCMB(monsterFromDatabase, newMonster);


    };

    this.generateSpecialAttacks = function(monsterFromDatabase, newMonster){

    }

    this.generateCMB = function(monsterFromDatabase, newMonster){
        var CMBString = monsterFromDatabase.CMB;
        if (CMBString.charAt(0) == "+"){
            CMBString = CMBString.slice(1);
            if (CMBString.indexOf("(") == -1){
                newMonster.CMB = parseInt(CMBString, 10);
            }else{
                newMonster.CMB = parseInt(CMBString.substring(0, CMBString.indexOf("(")));
                CMBString = CMBString.slice(CMBString.indexOf("("));
                newMonster.CMBMods = CMBString.trim();
            }
        }else{
            newMonster.CMB = parseInt(CMBString, 10);
        }
    }

    this.generateMonsterAttacks = function(monsterFromDatabase, newMonster){
        var rawAttackGroups = monsterFromDatabase.Melee.split(" or ").concat(monsterFromDatabase.Ranged.split(" or "));
        for(var i = 0; i < rawAttackGroups.length; i++){
            var attackGroup = [];
            var attackGroupString = rawAttackGroups[i].trim();
            var groupHeading = "Attack "+(i+1);
            attackGroup.groupName = groupHeading;
            var attacks = attackGroupString.split(", ");
            for(var j = 0; j < attacks.length;j++) {
                var attackCount = 1;
                var attackName = "";
                var attackString = attacks[j].trim();
                var index = 0;
                if (attackString.charAt(0) == "+") {
                    index = this.nth_occurrence(attackString, "+", 2);
                } else if (!isNaN(parseInt(attackString.charAt(0)))){
                    attackCount = parseInt(attackString.charAt(0));
                    attackString = attackString.slice(attackString.indexOf(" ")).trim();
                    index = this.nth_occurrence(attackString, "+", 1);
                }else{
                    index = this.nth_occurrence(attackString, "+", 1);
                }
                attackName = attackString.substring(0, index).trim();
                if (attackName.charAt(0) != "+"){
                    attackName = attackName.charAt(0).toUpperCase() + attackName.slice(1);
                }
                attackString = attackString.slice(index).trim();
                var attackStringWithIteratives = attackString;
                for (var l = 0; l < attackCount; l++) {
                    attackString = angular.copy(attackStringWithIteratives);
                    var iterativeAttacks = attackString.substring(0, attackString.indexOf("("));
                    var iterativeAttacksArray = iterativeAttacks.split("/");
                    attackString = attackString.slice(attackString.indexOf("(")).slice(1);
                    var attackStringWithoutIteratives = attackString;
                    for (var k = 0; k < iterativeAttacksArray.length; k++) {
                        attackString = angular.copy(attackStringWithoutIteratives);
                        var newAttack = {
                            name: "",
                            bonusToHit: 0,
                            diceValue: 6,
                            diceCount: 0,
                            diceBonus: 0,
                            currentRollToHit: 0,
                            currentTotalToHit: 0,
                            currentDamage: 0,
                            lowerCriticalRange: 20,
                            additionalEffects: "",
                            isTouch: false
                        };
                        newAttack.name = attackName;
                        if (iterativeAttacksArray[k].indexOf("touch") != -1){
                            newAttack.isTouch = true;
                            iterativeAttacksArray[k] = iterativeAttacksArray[k].replace("touch", "");
                        }
                        newAttack.bonusToHit = parseInt(iterativeAttacksArray[k].replace("+", ""), 10);
                        var diceCount = parseInt(attackString.substring(0, (attackString.indexOf("d"))));
                        newAttack.diceCount = diceCount;
                        attackString = attackString.slice(attackString.indexOf("d")).slice(1);
                        var diceValue = parseInt(attackString.substring(0, (attackString.indexOf("+"))));
                        newAttack.diceValue = diceValue;
                        attackString = attackString.slice(attackString.indexOf("+")).slice(1);
                        var diceBonus = 0;
                        if (attackString.indexOf("/") != -1) {
                            diceBonus = parseInt(attackString.substring(0, (attackString.indexOf("/"))));
                            newAttack.diceBonus = diceBonus;
                            attackString = attackString.slice(attackString.indexOf("/")).slice(1);
                            var lowerCriticalRange = parseInt(attackString.substring(0, (attackString.indexOf("-"))));
                            newAttack.lowerCriticalRange = lowerCriticalRange;
                            attackString = attackString.slice(attackString.indexOf("0")).slice(1);
                        }
                        if (attackString.indexOf(" ") != 1) {
                            attackString = attackString.slice(attackString.indexOf("plus "));
                            newAttack.additionalEffects = attackString.substring(0, (attackString.indexOf(")")));
                        }
                        attackGroup.push(newAttack);

                    }
                }
            }
            newMonster.attacks.push(attackGroup);
        }
    }

    this.monstersFromDatabase = [
        {
            Name: "Abaddon Gigas",
            Alignment: "NE",
            Size: "Medium",
            Type: "humanoid",
            Subtype: "(evil, extraplanar, giant)",
            Initiative: 8,
            Senses: "darkvision 60 ft., low-light vision; Perception +30",
            Aura: "electricity (5 ft., 1d6 elect.), frightful presence (180 ft., DC 21)",
            AC: "33, touch 9, flat-footed 30",
            AC_Mods: "(+11 armor, +3 Dex, +13 natural, -4 size)",
            HP: 241,
            HD: "(21d8+147)",
            HP_Mods: "regeneration",
            Saves: "Fort +19, Ref +11, Will +15",
            Fort: 19,
            Ref: 11,
            Will: 15,
            Save_Mods: "+2 vs. enchantment spells",
            Defensive_Abilities: "rock catching",
            DR: "10/good",
            Immune: "acid, death effects",
            Resist: "cold 10, electricity 10, fire 10, sonic 10",
            SR: 24,
            Weaknesses: "vulnerability to fire",
            Speed: "45 ft. (60 ft. without armor)",
            Speed_Mods: "",
            Melee: "unarmed +15/+10/+5 (2d10+3/19-20 plus 1d6 electricity) or unarmed flurry of blows +17/+17/+12/+12/+7/+7 (2d10+3/19-20 plus 1d6 electricity) or kama +14/+9/+4 (1d6+3) or kama flurry of blows +16/+16/+11/+11/+6/+6 (1d6+3)",
            Ranged: "mwk handaxe +5 (1d6+3/x3), mwk handaxe +5 (1d6+1/x3) or mwk handaxe +7 (1d6+3/x3)",
            Space: "20 ft.",
            Reach: "20 ft.",
            Special_Attacks: "devour souls, energy drain (2 levels, DC 26), rock throwing (160 ft.), vile weapon",
            Spell_Like_Abilities: "Spell-Like Abilities (CL 14th)  Constant-see invisibility  At Will-dispel magic, greater teleport (self plus 50 lbs. Of objects only), unholy blight (DC 17)  2/day-blasphemy (DC 20), web (DC 15)  1/day-summon (level 5, 1 aeshma 35% or 4d10 dretches 35%)",
            Spells_Known: "Spells Known (CL 15th) 7th (4/day)-greater teleport, power word blind 6th (6/day)-forceful hand, geas, greater dispel magic 5th (7/day)-contact other plane, dominate person (DC 22), mirage arcana, prying eyes 4th (7/day)-charm monster (DC 21), confusion (DC 21), dimensional anchor, locate creature 3rd (7/day)-displacement, heroism, hold person (DC 20), tongues 2nd (7/day)-alter self, detect thoughts (DC 17), locate object, resist energy, see invisibility 1st (8/day)-alarm, charm person (DC 18), protection from evil, shield, ventriloquism 0 (at will)-arcane mark, dancing lights, dispell magic, detect poison, ghost sound (DC 15), mage hand, message, prestidigitation, read magic",
            Spells_Prepared: "Spells Prepared (CL 6th; concentration +9)  3rd-bestow curse (DC 16), searing light, speak with dead  2nd-bull's strength, calm emotions (DC 15), cure moderate wounds, resist energy  1st-comprehend languages, divine favor, remove fear, shield of faith  0-detect magic, guidance, purify food and drink, stabilize",
            Ability_Scores: "Str 42, Dex 19, Con 25, Int 15, Wis 22, Cha 22",
            Base_Attack: 15,
            CMB: "+35 (+37 bull rush, +39 overrun)",
            CMD: "49 (51 vs. bull rush and overrun)",
            Feats: "Awesome Blow, Cleave, Combat Reflexes, Great Cleave, Greater Overrun, Improved Bull Rush, Improved Initiative, Improved Overrun, Iron Will, Power Attack, Stand Still",
            Skills: "Climb +37, Intimidate +30, Knowledge (planes) +12, Perception +30, Sense Motive +17",
            Languages: "Abyssal, Giant, Infernal",
            Special_Qualities: "planar empowerment",
            Special_Abilities: "Devour Souls (Su) As a standard action once every 1d4 rounds, an Abaddon gigas can drain the souls from all living creatures within 60 feet that are not native to Abaddon. Such creatures must succeed at a DC 26 Fortitude save or gain 1d4 negative levels. If even one creature is affected, the Abaddon gigas gains fast healing 15 for 15 rounds. If a creature dies from an Abaddon gigas's energy drain special attack, energy drain spell, or devour souls attack, the Abaddon gigas devours that creature's soul, gaining the benefits of death knell at a caster level equal to the dead creature's HD. Such a creature cannot be raised or resurrected by any means until the Abaddon gigas is slain. The save DC is Charisma-based.  Planar Empowerment (Su) While on the plane of Abaddon, an Abaddon gigas can cast each of the following as a spell-like ability once per day: blasphemy (DC 28), earthquake (DC 29), and unholy aura (DC 29) . If the gigas ventures onto another plane, it can't use these abilities (though its other spell-like abilities remain available). The save DCs for these spell-like abilities are Charisma-based and include a +5 racial bonus.  Vile Weapon (Su) As a swift action, an Abaddon gigas can transform its weapon into a +3 wounding adamantine greatsword, a +5 nullifyingUE adamantine spiked gauntlet, a +5 unholy adamantine quarterstaff, a +3 cruelUE keen scythe, or a +3 weapon of any other kind.",
            Description: "Abaddon gigas are megalithic extraplanar giants that roam Abaddon and embody the same vile energies that permeate that plane. Their cruel forms and unusual powers give them nefarious reputations, and few giant hunters-even among those who traverse the Great Beyond-would willingly seek out one of these monstrosities.  An Abaddon gigas stands over 50 feet tall and weighs 30 tons, not including the weight of its enormous armor.  Ecology  The first known record of an Abaddon gigas dates back to Lamashtu's first struggles with the daemon race, when the Demon Queen captured and murdered two of the Four Horsemen. The putrid remains of the slain Horsemen oozed toward Abaddon's heart, where they merged with the body of a captured Thanatotic titan (and perhaps some of the energy of the fabled Oinodaemon) to create the first gigas on that plane. A hideous and gigantic being of size beyond reason and composed of some of the multiverse's most powerful souls, this mythic gigas soon tore itself into pieces while struggling against its uncompromising quaternary nature. In doing so, this first behemoth created countless children, the beings known in present times as Abaddon gigas.  Abaddon gigas are asexual and incapable of reproducing; the Abaddon gigas in existence are all there ever will be. This fact is a small comfort, though, considering the terrible might of even a single Abaddon gigas. Worse still, whispered rumors among planar scholars say that, when an Abaddon gigas is slain, its power crawls back toward the heart of Abaddon, where the original mythic Abaddon gigas will one day reform once all its offspring have perished.   Habitat & Society  While some Abaddon gigas serve the Four Horsemen- sensing in these demigods some missing piece of their original selves lost long ago-most instead wander the decrepit wastes of Abaddon in a never-ending search for something they cannot define. The daemons and divs believe that Abaddon gigas roam in search of souls to sate their enormous hunger for life. The rare interplanar scholars who travel to Abaddon claim that the gigas carry out nefarious deeds for fell beings such as olethrodaemons or akvans. Only Charon, the eldest of the current Four Horsemen, knows the true source of the Abaddon gigas' wanderlust: they yearn for the Oinodaemon. The Boatman keeps this secret to himself, and keeps a distant watch over the gigas of Abaddon, though it is unclear whether his surveillance is out of curiosity or some ulterior motive.  Known Gigas of Abaddon  While all Abaddon gigas share a special level of infamy, several of these beings have gained reputations (and unusual powers) that extend beyond the fell lore surrounding their kind. Below are descriptions of two such legendary gigas.  Goros: Thought to be a twisted creation of Trelmarixian the Black, the gigas called Goros possesses even less control over its mental faculties than most Abaddon gigas. The monster resembles a towering naked man with dark red skin the texture of granite. The right half of its body has been mutilated beyond comprehension, revealing a mess of blue veins that intermingle with oozing alien organs and pulsing black guts.  Goros wears no armor (reducing its AC to 22 and its flat-footed AC to 19), and flies into a rage if reduced to half its hit points. While in a rage, Goros gains all the same benefits and penalties as a raging 20th-level barbarian (gaining a +8 morale bonus to Strength and Constitution, a -2 penalty to AC, and a +4 morale bonus on Will saves), though the gigas doesn't gain any rage powers.  Mephengitan: Mephengitan the Arch-Giant dwells among the icy wastes of Hoarspan, a borderland of polluted arctic waters and vicious icebergs where the fetid swamps of Plaguemere meet with Charon's Drowning Court. The gigas's eyes are the color of a clear winter sky, and on its frosty breath one can hear the whispers of a thousand souls whose lives were claimed by the Arch-Giant.  Mephengitan emits a 30-foot-radius aura of frigid cold. Any living creature that begins its turn in this area must succeed at a DC 26 Fortitude save or take 4d6 points of cold damage as its core body temperature plummets and its blood begins to freeze. Creatures that don't need water to live are immune to this effect. Creatures with the water subtype take twice as much as damage.",
            Additional_Notes: "Additional Notes Test Text"
        }
    ];

    //Array of monsters
    this.monsters = [
        {
            name:"Hound Archon",
            type:"LG Medium Outsider",
            initiative: 4,
            senses:"Darkvision 60ft, detect evil, low-light vision, scent, Perception+10",
            AC: "19, touch 10, flatfooted 19 (+9 natural; +2 deflection against evil)",
            auras: "Aura of Menace (DC16)",
            HP: 39,
            fortitude: 6,
            reflex: 5,
            will: 5,
            defences: "DR 10/evil, Immune electricity, petrification, SR15",
            speed:"30ft",
            attacks:[
                {groupName:"Using Natural Attacks", groupAttacks: [
                    {name:"Bite", bonusToHit: 8, diceValue: 8, diceCount: 1, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Bleed(1d6)"},
                    {name:"Slam", bonusToHit: 8, diceValue: 8, diceCount: 1, diceBonus:1, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Grab"}
                ]},
                {groupName:"Using Greatsword", groupAttacks: [
                    {name:"Mwk Greatsword", bonusToHit: 9, diceValue: 6, diceCount: 2, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Mwk Greatsword", bonusToHit: 4, diceValue: 6, diceCount: 2, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Bite", bonusToHit: 3, diceValue: 8, diceCount: 1, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""}
                ]},
                {groupName:"Using Natural Attacks w/ Power Attack", groupAttacks: [
                    {name:"Bite", bonusToHit: 6, diceValue: 8, diceCount: 1, diceBonus:9, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Slam", bonusToHit: 6, diceValue: 8, diceCount: 1, diceBonus:5, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""}
                ]},
                {groupName:"Using Greatsword w/Power Attack", groupAttacks: [
                    {name:"Mwk Greatsword", bonusToHit: 7, diceValue: 6, diceCount: 2, diceBonus:9, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Mwk Greatsword", bonusToHit: 7, diceValue: 6, diceCount: 2, diceBonus:9, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Bite", bonusToHit: 1, diceValue: 8, diceCount: 1, diceBonus:6, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""}
                ]}],
            baseAttack: 6,
            CMB: 8,
            currentCMB: 0,
            currentCMBRoll:0,
            CMD: 18,
            feats:"Improved Initiative, Iron Will, Power Attack",
            skills:"Acrobatics + 9, Intimidate + 10, Stealth + 13, Survival + 14",
            additionalNotes:[
                {heading:"Aura of Menace(DC 16)", value:"A righteous aura surrounds archons that fight or get angry. Any " +
                "hostile creature within a 20-foot radius of an archon must succeed on a Will save to resist its effects. " +
                "The save DC varies with the type of archon, is Charisma-based, and includes a +2 racial bonus. Those who fail " +
                "take a -2 penalty on attacks, AC, and saves for 24 hours or until they successfully hit the archon that generated " +
                "the aura. A creature that has resisted or broken the effect cannot be affected again by the same archon's aura for 24 hours."},
                {heading:"Constant Abilities", value: "Detect Evil, Magic Circle Against Evil"},
                {heading:"SLA(Caster Level 6th)", value: "Aid, Continual Flame, Greater Teleport"},
                {heading:"Change Shape:", value:"A hound archon can assume any canine form of Small to Large size, " +
                "as if using beast shape II. While in canine form, the hound archon loses its bite, slam, and greatsword " +
                "attacks, but gains the bite attack of the form it chooses. For the purposes of this ability, canines include " +
                "any dog-like or wolf-like creature of the animal type."}
            ]

        },
        {
            name:"Succubus",
            type:"CE Medium Outsider",
            initiative: 3,
            senses:"darkvision 60 ft., detect good; Perception +21",
            auras: "",
            AC: "20, touch 13, flat-footed 17 (+3 Dex, +7 natural)",
            HP: 84,
            fortitude: 7,
            reflex: 9,
            will: 10,
            defences: "DR 10/cold iron or good; Immune electricity, fire, poison; Resist acid 10, cold 10; SR 18",
            speed:"30 ft, fly 50ft",
            attacks:[
                {groupName:"Using Natural Attacks", groupAttacks: [
                    {name:"Claw", bonusToHit: 11, diceValue: 6, diceCount: 1, diceBonus:1, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Bleed(1d6)"},
                    {name:"Claw", bonusToHit: 11, diceValue: 6, diceCount: 1, diceBonus:1, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Grab"}
                ]}
            ],
            baseAttack: 8,
            CMB: 11,
            currentCMB: 0,
            currentCMBRoll:0,
            CMD: 22,
            feats:"Agile Maneuvers, Combat Reflexes, Iron Will, Weapon Finesse",
            skills:"Bluff +27, Diplomacy +19, Disguise +19, Escape Artist +11, Fly +14, Intimidate +16, Knowledge (local) +15, Perception +21, Sense Motive +13, Stealth +14; Racial Modifiers +8 Bluff, +8 Perception",
            additionalNotes:[
                {heading:"Energy Drain (Su)", value:"A succubus drains energy from a mortal she lures into an act of passion, such as a kiss. An unwilling victim must be grappled before the succubus can use this ability. The succubus's kiss bestows one negative level. The kiss also has the effect of a suggestion spell, asking the victim to accept another act of passion from the succubus. The victim must succeed on a DC 22 Will save to negate the suggestion. The DC is 22 for the Fortitude save to remove a negative level. These save DCs are Charisma-based."},
                {heading:"Profane Gift (Su)", value: "Once per day as a full-round action, a succubus may grant a profane gift to a willing humanoid creature by touching it for 1 full round. The target gains a +2 profane bonus to an ability score of his choice. A single creature may have no more than one profane gift from a succubus at a time. As long as the profane gift persists, the succubus can communicate telepathically with the target across any distance (and may use her suggestion spell-like ability through it). A profane gift is removed by dispel evil or dispel chaos. The succubus can remove it as well as a free action (causing 2d6 Charisma drain to the victim, no save)."}
            ],
            rollCMB: function(){
                this.currentCMB = Math.floor(Math.random() * 20) + 1 + this.CMB;
            },
            rollAttack: function(group){
                angular.forEach(group.groupAttacks, function(attack) {
                    var total = 0;
                    attack.currentRollToHit = Math.floor(Math.random() * 20) + 1;
                    attack.currentTotalToHit = attack.currentRollToHit + attack.bonusToHit;
                    for (var i = 0; i < attack.diceCount; i++) {

                        var currentRoll = Math.floor(Math.random() * attack.diceValue) + 1;
                        total += currentRoll;
                    }
                    attack.currentDamage = total + attack.diceBonus;
                });
            }
        }
    ];


    this.nth_occurrence = function(string, char, nth){
        var first_index = string.indexOf(char);
        var length_up_to_first_index = first_index + 1;

        if (nth == 1) {
            return first_index;
        } else {
            var string_after_first_occurrence = string.slice(length_up_to_first_index);
            var next_occurrence = this.nth_occurrence(string_after_first_occurrence, char, nth - 1);

            if (next_occurrence === -1) {
                return -1;
            } else {
                return length_up_to_first_index + next_occurrence;
            }
        }
    }
});