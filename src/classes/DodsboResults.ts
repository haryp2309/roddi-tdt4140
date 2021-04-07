export class DodsboResults {
    timestamp: Date;
    distributionResults: Map<string, string[]>
    throwObjects: string[]
    giveAwayObjects: string[]


    constructor() {
        this.timestamp = new Date()
        this.distributionResults = new Map<string, string[]>()
        this.throwObjects = []
        this.giveAwayObjects = []
    }

    addResult(userId: string, objectId: string) {
        const objectIds = this.distributionResults.get(userId)
        if (objectIds) {
            objectIds.push(objectId)
            this.distributionResults.set(userId, objectIds)
        } else {
            this.distributionResults.set(userId, [objectId])
        }
    }

    addThrowObject(objectId: string) {
        this.throwObjects.push(objectId)
    }

    addGiveAwayObject(objectId: string) {
        this.giveAwayObjects.push(objectId)
    }

    get(userId: string) {
        const returnValue = this.distributionResults.get(userId)
        return returnValue ? returnValue : []
    }

    toJSON() {
        return ({
            timestamp: this.timestamp,
            results: Object.fromEntries(this.distributionResults),
            throwObjects: this.throwObjects,
            giveAwayObjects: this.giveAwayObjects,
        })
    }

    static fromJSON(data: any) {
        const result: DodsboResults = new DodsboResults();
        result.timestamp = data.timestamp as Date;
        result.distributionResults = new Map(Object.entries(data.results));
        result.throwObjects = data.throwObjects;
        result.giveAwayObjects = data.giveAwayObjects;
        return result;
    }
}