import UserResource from "./UserResource"

export default class DodsboResource {
    queryResult: any;

    public constructor(queryResult: any) {
        this.queryResult = queryResult;
    }

    public getTitle(): String {
        return this.queryResult.data().title
    }
    
    public getAdmins(): UserResource[] {
        const result: UserResource[] = []
        const admins = this.queryResult.data().admins
        for(var i = 0; i < admins.length; i++) {
            var adminId = admins[i];
            result.push(new UserResource(adminId))
        }
        return result
    }

    public getMembers(): UserResource[] {
        const result: UserResource[] = []
        const members = this.queryResult.data().members
        for(var i = 0; i < members.length; i++) {
            var membersId = members[i];
            result.push(new UserResource(membersId))
        }
        return result
    }

    public getDescription(): String {
        return this.queryResult.data().description
    }

}