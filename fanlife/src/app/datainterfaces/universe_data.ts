import { Activity } from './activity';
import {PlayerAttribute} from './player_attribute'

export interface UniverseData {
    name: string;
    attrs: {[key: string]: PlayerAttribute};
    starting_event: string;
    activities: Array<Activity>
    event_groups: {[key: string]: any}
}