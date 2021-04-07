import {possibleUserDecisions} from "../services/UserDecisionResource";

export class DodsboResultsPreview {
    name: string;
    price: number;
    description: string;
    decision: possibleUserDecisions;
    ownerId: string | null;

    constructor(
        name: string,
        price: number,
        description: string,
        decision: possibleUserDecisions,
        ownerId: string | null
    ) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.decision = decision;
        this.ownerId = ownerId;
    }
}