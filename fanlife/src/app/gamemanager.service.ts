import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameActivitiesService } from './activities/gacts.service';
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

  constructor(private activityService: GameActivitiesService,
              private logService: GameLogsService,
              private statService: GameStatsService,
              private http: HttpClient)
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
      "event_groups": {
        "randomizer": [
          {
            "weight": 20,
            "message": "You are a sith apprentice",
            "next_event": "sith_apprentice"
          },
          {
            "weight": 20,
            "message": "You are a jedi padawan",
            "next_event": "jedi_padawan"
          }
        ],
        "jedi_padawan": [
          {
            "weight": 5,
            "message": "You go for a training session with your master",
            "next_event": "train"
          }
        ],
        "train": [
          {
            "weight": 15,
            "message": "You get slightly stronger",
            "effects": [
              {
                "attr": "skill",
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
                "attr": "skill",
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
                "attr": "skill",
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
                "attr": "skill",
                "mod": -20
              },
              {
                "attr": "health",
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
            "message": "You and your master come across the jedi %enemy_name% in your travels",
            "next_event": "sith_apprentice_jedi_encounter",
            "dynamic_options": [
              {
                "enemy_name": "Anakin Skywalker",
                "enemy_skill": 80
              },
              {
                "enemy_name": "Obi-Wan Kenobi",
                "enemy_skill": 70
              },
              {
                "enemy_name": "Ahsoka Tano",
                "enemy_skill": 60
              },
              {
                "enemy_name": "Mace Windu",
                "enemy_skill": 60
              },
              {
                "enemy_name": "Plo Koon",
                "enemy_skill": 40
              },
              {
                "enemy_name": "Yoda",
                "enemy_skill": 100
              },
              {
                "enemy_name": "Ki-Adi-Mundi",
                "enemy_skill": 20
              },
              {
                "enemy_name": "Kit Fisto",
                "enemy_skill": 30
              },
              {
                "enemy_name": "Agen Kolar",
                "enemy_skill": 10
              },
              {
                "enemy_name": "Shaak Ti",
                "enemy_skill": 30
              }
            ]
          },
          {
            "weight": 0,
            "message": "You feel compelled by the light and become a padawan",
            "next_event": "jedi_padawan"
          }
        ],
        "sith_apprentice_jedi_encounter": [
          {
            "message": "You and your master defeat the jedi with ease",
            "dynamic_weights": [
              {
                "determinant": {"type": "attr_diff", "first_attr": "skill", "second_attr": "enemy_skill"},
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
              {"attr": "health", "mod": -20}
            ],
            "next_event": "sith_apprentice"
          },
          {
            "message": "You defeat the jedi, but your master dies in the process and you advance to master status",
            "dynamic_weights": [
              {
                "determinant": {"type": "attr", "attr": "skill"},
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
                "determinant": {"type": "attr_diff", "first_attr": "skill", "second_attr": "enemy_skill"},
                "max_value": -5,
                "additive":0,
                "multiplier": -1 
              }
            ]
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

    this.nextEvent();
  }
  
  nextEvent() {
    
  }
}
