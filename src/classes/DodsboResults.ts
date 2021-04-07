export class DodsboResults {
    timestamp: Date;
    results: Map<string, string[]>

    constructor() {
        this.timestamp = new Date()
        this.results = new Map<string, string[]>()
    }

    addResult(userId: string, objectId: string) {
        const objectIds = this.results.get(userId)
        if (objectIds) {
            objectIds.push(objectId)
            this.results.set(userId, objectIds)
        } else {
            this.results.set(userId, [objectId])
        }
    }

    get(userId: string) {
        const returnValue = this.results.get(userId)
        return returnValue ? returnValue : []
    }

    toJSON() {
        return ({
                timestamp: this.timestamp,
                results: Object.fromEntries(this.results),
            })
    }

    static fromJSON(data: any) {
        const result: DodsboResults = new DodsboResults();
        result.timestamp = data.timestamp as Date;
        result.results = new Map(Object.entries(data.results));
        return result;
    }
}