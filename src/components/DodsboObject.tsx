import UserObject from "./UserObject"

export default class DodsboObject {
    queryResult: any;

    public constructor(queryResult: any) {
        this.queryResult = queryResult;
    }

    public getTitle(): String {
        return this.queryResult.data().title
    }
    
    public getAdmins(): UserObject[] {
        const result: UserObject[] = []
        const admins = this.queryResult.data().admins
        for(var i = 0; i < admins.length; i++) {
            var adminId = admins[i];
            result.push(new UserObject(adminId))
        }
        return result
    }

    public getMembers(): UserObject[] {
        const result: UserObject[] = []
        const members = this.queryResult.data().members
        for(var i = 0; i < members.length; i++) {
            var membersId = members[i];
            result.push(new UserObject(membersId))
        }
        return result
    }

    public getDescription(): String {
        return this.queryResult.data().description
    }

}