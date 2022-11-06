export interface Activity {
    name: string,
    event: string,
    requirements?: Array<ActivityRequirement>,
    disable_on?: Array<ActivityDisableOn>
}


export interface ActivityRequirement{
    type: string,
    attr?: string,
    value: string
}

export interface ActivityDisableOn {
    type: string,
    value: string
}