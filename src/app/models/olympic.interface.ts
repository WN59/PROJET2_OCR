import { Participation } from "./participation.interface";

export interface Olympic {
    id: number;
    country: string;
    participations: Participation[];
}