
export type UserAlert = {
    userId: string,
    matches: Match[]
}

export type Match = {
    link: string;
    provider: string;
    timeToStart: string;
}