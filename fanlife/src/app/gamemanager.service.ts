import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameActivitiesService } from './activities/gacts.service';
import { Glog } from './home/gamelog/glog';
import { GameLogsService } from './home/gamelog/glogs.service';
import { GameStatsService } from './home/gamestats/gstats.service';

@Injectable({
  providedIn: 'root'
})
export class GamemanagerService {

  private universe_data;
  private next_event: string;
  private current_event: string;
  private previous_event: string;
  private game_data: {[name: string]: any};

  constructor(private activityService: GameActivitiesService,
              private logService: GameLogsService,
              private statService: GameStatsService,
              private http: HttpClient,)
  {
    // initialize variables
    this.universe_data = {
      "name" : "Star Wars",
      "attrs": {
        "health": {
          "min": 0,
          "max": 100,
          "val": 100,
          "visible": true
        },
        "skill": {
          "min": 0,
          "max": 100,
          "val": 50,
          "visible": true
        }
      },
      "starting_event": "randomizer",
      "activities": [
        {
          "name": "Leave Jedi Order",
          "requirements": [
            {
              "type": "attr",
              "attr": "game.affiliation",
              "value": "jedi_order"
            }
          ],
          "event": "leave_jedi"
        },
        {
          "name": "Defect to Sith",
          "requirements": [
            {
              "type": "attr",
              "attr": "game.affiliation",
              "value": "jedi_order"
            }
          ],
          "event": "defect_to_sith"
        },
        {
          "name": "Leave Sith Order",
          "requirements": [
            {
              "type": "attr",
              "attr": "game.affiliation",
              "value": "sith"
            }
          ],
          "event": "leave_sith"
        },
        {
          "name": "Defect to Jedi Order",
          "requirements": [
            {
              "type": "attr",
              "attr": "game.affiliation",
              "value": "sith"
            }
          ],
          "event": "defect_to_jedi"
        },
        {
          "name": "Join Sith Order",
          "requirements": [
            {
              "type": "attr",
              "attr": "game.affiliation",
              "value": "unaffiliated"
            }
          ],
          "event": "join_sith"
        },
        {
          "name": "Defect to Jedi Order",
          "requirements": [
            {
              "type": "attr",
              "attr": "game.affiliation",
              "value": "unaffiliated"
            }
          ],
          "event": "join_jedi"
        },
        {
          "name": "Train",
          "event": "train_activity"
        },
        {
          "name": "Kill your master",
          "requirements": [
            {
              "type": "attr",
              "attr": "game.affiliation",
              "value": "sith"
            },
            {
              "type": "attr",
              "attr": "game.rank",
              "value": "apprentice"
            }
          ],
          "event": "kill_master"
        }
      ],
      "event_groups": {
        "randomizer": [
          {
            "weight": 20,
            "message": "You are a sith apprentice",
            "next_event": "sith_apprentice",
            "effects": [
              {
                "attr": "game.affiliation",
                "val": "sith"
              },
              {
                "attr": "game.role",
                "val": "apprentice"
              }
            ]
          },
          {
            "weight": 20,
            "message": "You are a jedi padawan",
            "next_event": "jedi_padawan",
            "effects": [
              {
                "attr": "game.affiliation",
                "val": "jedi"
              },
              {
                "attr": "game.role",
                "val": "padawan"
              }
            ]
          }
        ],
        "jedi_padawan": [
          {
            "weight": 5,
            "message": "You go for a training session with your master",
            "next_event": "train"
          },
          {
            "weight": 15,
            "event_type": "dynamic_event",
            "message": "You and your master come across %game.enemy_name% in your travels",
            "next_event": "jedi_padawan_encounter",
            "dynamic_options": [
              {
                "game.enemy_name": "Darth Maul",
                "game.enemy_skill": 80
              },
              {
                "game.enemy_name": "Count Dooku",
                "game.enemy_skill": 80
              },
              {
                "game.enemy_name": "General Grievous",
                "game.enemy_skill": 60
              },
              {
                "game.enemy_name": "Darth Sidious",
                "game.enemy_skill": 100
              },
              {
                "game.enemy_name": "Jango Fett",
                "game.enemy_skill": 40
              },
              {
                "game.enemy_name": "Zam Wesell",
                "game.enemy_skill": 20
              }
            ]
          }
        ],
        "train": [
          {
            "weight": 15,
            "message": "You get slightly stronger",
            "effects": [
              {
                "attr": "player.skill",
                "mod": 5
              }
            ],
            "next_event": "$back"
          },
          {
            "weight": 10,
            "message": "You get much stronger",
            "effects": [
              {
                "attr": "player.skill",
                "mod": 10
              }
            ],
            "next_event": "$back"
          },
          {
            "weight": 5,
            "message": "Somehow, you get weaker",
            "effects": [
              {
                "attr": "player.skill",
                "mod": -5
              }
            ],
            "next_event": "$back"
          },
          {
            "weight": 1,
            "message": "While training, you get injured",
            "effects": [
              {
                "attr": "player.skill",
                "mod": -20
              },
              {
                "attr": "player.health",
                "mod": -10
              }
            ],
            "next_event": "$back"
          }
        ],
        "sith_apprentice": [
          {
            "weight": 15,
            "message": "You go for a training session with your master",
            "next_event": "train"
          },
          {
            "weight": 15,
            "event_type": "dynamic_event",
            "message": "You and your master come across the jedi %game.enemy_name% in your travels",
            "next_event": "sith_apprentice_jedi_encounter",
            "dynamic_options": [
              {
                "game.enemy_name": "Anakin Skywalker",
                "game.enemy_skill": 80
              },
              {
                "game.enemy_name": "Obi-Wan Kenobi",
                "game.enemy_skill": 70
              },
              {
                "game.enemy_name": "Ahsoka Tano",
                "game.enemy_skill": 60
              },
              {
                "game.enemy_name": "Mace Windu",
                "game.enemy_skill": 60
              },
              {
                "game.enemy_name": "Plo Koon",
                "game.enemy_skill": 40
              },
              {
                "game.enemy_name": "Yoda",
                "game.enemy_skill": 100
              },
              {
                "game.enemy_name": "Ki-Adi-Mundi",
                "game.enemy_skill": 20
              },
              {
                "game.enemy_name": "Kit Fisto",
                "game.enemy_skill": 30
              },
              {
                "game.enemy_name": "Agen Kolar",
                "game.enemy_skill": 10
              },
              {
                "game.enemy_name": "Shaak Ti",
                "game.enemy_skill": 30
              }
            ]
          }
        ],
        "sith_apprentice_jedi_encounter": [
          {
            "event_type": "dynamic_event_picker",
            "dynamic_options": [
              {
                "message": "You and your master defeat the jedi with ease",
                "dynamic_weights": [
                  {
                    "determinant": {"type": "attr_diff", "first_attr": "player.skill", "second_attr": "game.enemy_skill"},
                    "min_value": 5,
                    "additive":0,
                    "multiplier": 1 
                  }
                ],
                "next_event": "sith_apprentice"
              },
              {
                "message": "You and your master defeat the jedi, but you get hurt in the process",
                "weight": 5,
                "effects": [
                  {"attr": "player.health", "mod": -20}
                ],
                "next_event": "sith_apprentice"
              },
              {
                "message": "You defeat the jedi, but your master dies in the process and you advance to master status",
                "dynamic_weights": [
                  {
                    "determinant": {"type": "attr", "attr": "player.skill"},
                    "min_value": 80,
                    "additive": 15,
                    "multiplier": 1
                  }
                ],
                "next_event": "sith_master"
              },
              {
                "message": "You and your master fight valiantly, but are defeated.",
                "dynamic_weights": [
                  {
                    "determinant": {"type": "attr_diff", "first_attr": "player.skill", "second_attr": "game.enemy_skill"},
                    "max_value": -5,
                    "additive":0,
                    "multiplier": -1 
                  }
                ]
              }
            ]
          }
        ],
        "jedi_padawan_encounter": [
          {
            "message": "You and your master defeat %game.enemy_name% with ease",
            "dynamic_weights": [
              {
                "determinant": {"type": "attr_diff", "first_attr": "player.skill", "second_attr": "game.enemy_skill"},
                "min_value": 5,
                "additive":0,
                "multiplier": 1 
              }
            ],
            "next_event": "sith_apprentice"
          },
          {
            "message": "You and your master defeat %game.enemy_name%, but you get hurt in the process",
            "weight": 5,
            "effects": [
              {"attr": "player.health", "mod": -20}
            ],
            "next_event": "sith_apprentice"
          },
          {
            "message": "You defeat %game.enemy_name%, but your master dies in the process and you advance to knight status",
            "dynamic_weights": [
              {
                "determinant": {"type": "attr", "attr": "player.skill"},
                "min_value": 80,
                "additive": 15,
                "multiplier": 1
              }
            ],
            "next_event": "jedi_knight"
          },
          {
            "message": "You and your master fight valiantly, but are defeated.",
            "dynamic_weights": [
              {
                "determinant": {"type": "attr_diff", "first_attr": "player.skill", "second_attr": "game.enemy_skill"},
                "max_value": -5,
                "additive":0,
                "multiplier": -1 
              }
            ]
          }
        ],
        "leave_jedi": [
          {
            "weight": 1,
            "message": "You left the jedi order, dissapointing your master",
            "effects": [
              {
                "attr": "game.affiliation",
                "set": "unaffiliated"
              },
              {
                "attr": "game.rank",
                "set": "none"
              }
            ],
            "next_event": "unaffiliated"
          }
        ],
        "defect_to_sith": [
          {
            "weight": 1,
            "message": "You defected to the sith, dissapointing the whole jedi order",
            "effects": [
              {
                "attr": "game.affiliation",
                "set": "sith"
              },
              {
                "attr": "game.rank",
                "set": "apprentice"
              }
            ],
            "next_event": "sith_apprentice"
          }
        ],
        "leave_sith": [
          {
            "weight": 1,
            "message": "You left the sith order",
            "effects": [
              {
                "attr": "game.affiliation",
                "set": "unaffiliated"
              },
              {
                "attr": "game.rank",
                "set": "none"
              }
            ],
            "next_event": "unaffiliated"
          }
        ],
        "defect_to_jedi": [
          {
            "weight": 1,
            "message": "You defected to the jedi order, although they are still slightly suspicious of you",
            "effects": [
              {
                "attr": "game.affiliation",
                "set": "jedi_order"
              },
              {
                "attr": "game.rank",
                "set": "padawan"
              }
            ],
            "next_event": "jedi_padawan"
          }
        ],
        "join_jedi": [
          {
            "weight": 1,
            "message": "You chose to join the jedi order, and they welcomed you with open arms",
            "effects": [
              {
                "attr": "game.affiliation",
                "set": "jedi_order"
              },
              {
                "attr": "game.rank",
                "set": "padawan"
              }
            ],
            "next_event": "jedi_padawan"
          }
        ],
        "join_sith": [
          {
            "weight": 1,
            "message": "After many trials, you were taken in as a sith apprentice",
            "effects": [
              {
                "attr": "game.affiliation",
                "set": "sith"
              },
              {
                "attr": "game.rank",
                "set": "apprentice"
              }
            ],
            "next_event": "sith_apprentice"
          }
        ],
        "kill_master": [
          {
            "dynamic_weights": [
              {
                "determinant": {"type": "attr", "attr": "player.skill"},
                "min_value": 80,
                "additive": 1,
                "multiplier": 2
              }
            ],
            "message": "You snuck into your master's chambers at night and killed them, you are now the lord of the sith",
            "effects": [
              {
                "attr": "game.affiliation",
                "set": "sith"
              },
              {
                "attr": "game.rank",
                "set": "lord"
              }
            ],
            "next_event": "sith_lord"
          },
          {
            "weight": 5,
            "message": "You tried to surprise your master and kill them, but you were too weak and were killed",
            "effects": [
              {
                "attr": "player.health",
                "set": "0"
              }
            ]
          }
        ],
        "unaffiliated": [
          {
            "weight": 5,
            "message": "You decide to go train by yourself",
            "next_event": "train"
          },
          {
            "weight": 5, 
            "message": "In your travels, you encounter %person_name% but decide to part peacefully",
            "event_type": "dynamic_event",
            "dynamic_options": [
              {
                "encounter_name": "Jango Fett"
              },
              {
                "encounter_name": "Zam Wesell"
              },
              {
                "encounter_name": "Anakin Skywalker"
              },
              {
                "encounter_name": "Obi-Wan Kenobi"
              },
              {
                "encounter_name": "Jango Fett"
              }
            ],
            "next_event": "unaffiliated"
          }
        ],
        "train_activity": [
          {
            "weight": 1,
            "message": "You decide to go train for a bit",
            "next_event": "train"
          }
        ]
      }
    }
    

    // init attributes
    let attrs = this.universe_data["attrs"];

    let k: keyof typeof attrs;
    for (k in attrs) {
      const stat = attrs[k];
      statService.addStat(stat.min, stat.max, stat.val, k, stat.visible);
    }

    this.next_event = this.universe_data["starting_event"];
    this.current_event = "";
    this.previous_event = "";
    this.game_data = {}

    this.nextEvent();
  }
  
  getUniverseData() {
    return this.universe_data;
  }

  get_event_weight(event: any) {
    var weight = 0
    if (event.hasOwnProperty("weight")){
        weight += event.weight;
    }
    if (event.hasOwnProperty("dynamic_weights")) {
        event.dynamic_weights.forEach((dynamic_weight: {determinant: {type: string, attr?: string, first_attr?: string, second_attr?: string}, max_value?: number, min_value?: number, additive: number, multiplier: number}) => {
            var determinant = null;
            if (dynamic_weight.determinant.type == "attr") {
                var value: number = this.getAttr(dynamic_weight.determinant.attr as string).value
                if ((!dynamic_weight.hasOwnProperty("max_value") || value <= (dynamic_weight.max_value as number)) && (!dynamic_weight.hasOwnProperty("min_value") || value >= (dynamic_weight.min_value as number))){
                    determinant = value*dynamic_weight.multiplier + dynamic_weight.additive
                }
            }
            else if (dynamic_weight.determinant.type == "attr_diff") {
                var value: number = this.getAttr(dynamic_weight.determinant.first_attr as string).value - this.getAttr(dynamic_weight.determinant.second_attr as string).value
                if ((!dynamic_weight.hasOwnProperty("max_value") || value <= (dynamic_weight.max_value as number)) && (!dynamic_weight.hasOwnProperty("min_value") || value >= (dynamic_weight.min_value as number))){
                    determinant = value*dynamic_weight.multiplier + dynamic_weight.additive
                }
            }
            if (determinant != null){
                weight += determinant
            }
        })
    }
    return weight;
}

  
  getAttr(attr: string){
    console.log("getting attribute: " + attr);
    if (attr.startsWith("player.")){
      return this.statService.getStat(attr.substring(7));
    } else if (attr.startsWith("game.")){
      return this.game_data[attr.substring(5)];
    } else {
      console.error("Encountered an attribute without a prefix: " + attr);
    }
  }

  
  modAttr(attr: string, modAmount: number){
    if (attr.startsWith("player.")){
      this.statService.modStat(attr.substring(7), modAmount);
    } else if (attr.startsWith("game.")){
      if ((typeof this.game_data[attr.substring(5)]) === "number"){
        this.game_data[attr.substring(5)] = this.game_data[attr.substring(5)] + modAmount
      } else {
        console.error("Cannot modify a non-numeric attribute")
      }
    } else {
      console.error("Encountered an attribute without a prefix: " + attr);
    }
  }

  
  setAttr(attr: string, setValue: any){
    if (attr.startsWith("player.")){
      this.statService.setStat(attr.substring(7), setValue);
    } else if (attr.startsWith("game.")){
      this.game_data[attr.substring(5)] = setValue
    } else {
      console.error("Encountered an attribute without a prefix: " + attr);
    }
  }

  
  runEvent(event: string) {
    //let heldEvent = this.next_event;
    this.next_event = event;
    this.nextEvent();
  }


  nextEvent() {
    this.previous_event = this.current_event
    this.current_event = this.next_event
    if (this.universe_data.event_groups.hasOwnProperty(this.current_event)) {
        var event_group: any[] = this.universe_data.event_groups[this.current_event as keyof typeof this.universe_data.event_groups];
        var valid_events: any[] = []
        var total_weight = 0
        event_group.forEach(event => {
            var weight = this.get_event_weight(event)
            if (weight > 0) {
                valid_events.push(event);
                total_weight += weight;
            }
        })

        var random_weight = Math.random()*total_weight;
        var event;
        while (random_weight > 0) {
            event = valid_events.pop();
            random_weight -= this.get_event_weight(event);
        }

        if (event.hasOwnProperty("event_type") && event.event_type == "dynamic_event"){
            var option = event.dynamic_options[Math.floor(Math.random() * event.dynamic_options.length)]
            Object.keys(option).forEach(key => {
                this.setAttr(key, option[key]);
            })
        }

        var replacements: {[name: string]: string} = {}

        Object.keys(this.game_data).forEach(key => {
          console.log(key);
            replacements["%game." + key + "%"] = String(this.game_data[key])
        })

        Object.keys(this.statService.getGameStats).forEach(key => {
            replacements["%player." + key + "%"] = String(this.statService.getStat(key))
        })

        var message = event.message.replace(/%(\w|.)+%/g, function(all: any) {
            return replacements[all] || all;
          });
        this.logService.addGlog(message, false)
        if (event.hasOwnProperty("effects")) {
            event.effects.forEach((effect: {attr: string, mod?: number, set?: number}) => {
                if (effect.hasOwnProperty("mod")){
                    this.modAttr(effect.attr, effect.mod as number)
                } else if (effect.hasOwnProperty("set")) {
                    this.setAttr(effect.attr, effect.set)
                }
            })
        }
        if (event.hasOwnProperty("next_event")) {
            this.next_event = event.next_event
            if (this.next_event === "$back") {
                this.next_event = this.previous_event;
            }
        }
    } else {
        console.error("Invalid event type " + this.current_event)
    }
  }
}
