import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { EventManager } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GameActivitiesService } from './activities/gacts.service';
import { Glog } from './home/gamelog/glog';
import { GameLogsService } from './home/gamelog/glogs.service';
import { GameStatsService } from './home/gamestats/gstats.service';
import { UniverseData } from './datainterfaces/universe_data';

@Injectable({
  providedIn: 'root'
})
export class GamemanagerService {

  private universe_data: UniverseData;
  private next_event: string;
  private current_event: string;
  private previous_event: string;
  private game_data: {[name: string]: any};

  public isDead: boolean;

  constructor(private activityService: GameActivitiesService,
              private logService: GameLogsService,
              private statService: GameStatsService,
              private http: HttpClient,)
  {
    this.universe_data = {
      "name": "Example",
      "attrs": {},
      "starting_event": "",
      "activities": [],
      "event_groups": {}
    };
    this.next_event = "";
    this.current_event = "";
    this.previous_event = "";
    this.game_data = {};
    this.isDead = false;
  }

  init_universe(universe_data: UniverseData){
    this.universe_data = universe_data;

    // init attributes
    let attrs = this.universe_data["attrs"];

    let k: keyof typeof attrs;
    for (k in attrs) {
      const stat = attrs[k];
      this.statService.addStat(stat.min, stat.max, stat.val, k, stat.visible);
    }

    this.next_event = this.universe_data["starting_event"];
    this.current_event = "";
    this.previous_event = "";
    this.game_data = {}
    this.logService.getGlogs().splice(0);
  }

  get_next_event() {
    return this.next_event;
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
                var value: number = this.getAttr(dynamic_weight.determinant.attr as string)
                if ((!dynamic_weight.hasOwnProperty("max_value") || value <= (dynamic_weight.max_value as number)) && (!dynamic_weight.hasOwnProperty("min_value") || value >= (dynamic_weight.min_value as number))){
                    determinant = value*dynamic_weight.multiplier + dynamic_weight.additive
                }
            }
            else if (dynamic_weight.determinant.type == "attr_diff") {
                var value: number = this.getAttr(dynamic_weight.determinant.first_attr as string) - this.getAttr(dynamic_weight.determinant.second_attr as string)
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
    //console.log("getting attribute: " + attr);
    if (attr.startsWith("player.")){
      return this.statService.getStat(attr.substring(7)).value;
    } else if (attr.startsWith("game.")){
      //console.log(this.game_data)
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
    //console.log("setting attribute: " + attr + " to: " + setValue)
    if (attr.startsWith("player.")){
      this.statService.setStat(attr.substring(7), setValue);
    } else if (attr.startsWith("game.")){
      this.game_data[attr.substring(5)] = setValue
    } else {
      console.error("Encountered an attribute without a prefix: " + attr);
    }
  }


  runEvent(event: string) {
    console.log("next: ", this.next_event);
    console.log("previous: ", this.previous_event);
    this.current_event = this.next_event;
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

        if (event == undefined){
          console.warn(event_group)
          console.warn(valid_events)
        }

        if (event.hasOwnProperty("event_type") && event.event_type == "dynamic_event"){
            var option = event.dynamic_options[Math.floor(Math.random() * event.dynamic_options.length)]
            Object.keys(option).forEach(key => {
                this.setAttr(key, option[key]);
            })
        }

        var replacements: {[name: string]: string} = {}

        Object.keys(this.game_data).forEach(key => {
            replacements["%game." + key + "%"] = String(this.game_data[key])
        })

        Object.keys(this.statService.getGameStats).forEach(key => {
            replacements["%player." + key + "%"] = String(this.statService.getStat(key))
        })

        var message = event.message;
        Object.keys(replacements).forEach(key => {
          message = message.replace("%" + key + "%", replacements[key]);
        })
        var message = event.message.replace(/%(\w|.)+%/, function(all: any) {
            return replacements[all] || all;
          });
        this.logService.addGlog(message, event.hasOwnProperty("bold") ? event.bold : false);
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

        // default to true
        if (event.hasOwnProperty("valid_previous") && !event.valid_previous) {
          this.current_event = this.previous_event;
        }

        if (this.getAttr("player.health") <= 0) {
          this.next_event = "dead";
          this.logService.addGlog("You have deceased", true);
          this.isDead = true;
          const collection = document.getElementsByClassName("game-button");
          for (let i = 0; i < collection.length; i++) {
            (collection[i] as HTMLInputElement).disabled = true;
          }
        }
    } else {
        console.error("Invalid event type " + this.current_event)
    }
  }
}
