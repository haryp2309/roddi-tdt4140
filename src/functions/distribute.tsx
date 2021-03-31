import userDecisions from "./userDecision.json"
import { DodsboObject } from "../services/DodsboObjectResource";
import UserDecisionResource, { UserDecisions } from "../services/UserDecisionResource";

//Uses Classes
function distribute(userDecisions: UserDecisions[]) { // Worst case time complexity O(k*(n + n)), n = (all objects), k = (all unique objects)
    let userMoneySpent: any = {}
    let userObjectsAquired: any = {}
    let completedObjects: String[] = []

    //Intializing
    userDecisions.map(user => {
        userMoneySpent[user.userID] = 0
        userObjectsAquired[user.userID] = []
    })

    let done: boolean = false;

    while (!done) {
        let noNewObjects: boolean = true;
        let selectedObject: String = ""
        let selectedPrice: number = 0;
        let objectUser: any = {};
        let priCounter: number = 1

        //Selects new highest prioritized object
        while (selectedObject == "") {
            let itemsLeft: boolean = false
            userDecisions.map(user => {
                let username: any = user.userID
                let userObjects: Map<number, DodsboObject> = user.objects

                if (userObjects.get(priCounter) != undefined) {
                    itemsLeft = true
                    let objectID: String | undefined = userObjects.get(priCounter)?.id

                    //Check if objectName already distributed
                    if (selectedObject == "" && !completedObjects.includes(objectID!)) {
                        noNewObjects = false;
                        selectedObject = objectID!
                        selectedPrice = userObjects?.get(priCounter)?.value!

                        objectUser.id = username
                        objectUser.priority = priCounter
                        objectUser.itemsLeft = userObjects.size
                    }

                }
            })
            priCounter += 1
            //All items are completed
            if (!itemsLeft) {
                break
            }
        }

        //Check if another user should get selectedObject
        userDecisions.map(user => {
            user.objects.forEach((value: DodsboObject, key: number) => {
                let currentUserID: any = user.userID
                let objectID: String = value.id

                if (objectID == selectedObject && currentUserID != objectUser.id) {
                    //User has spent less money 
                    if (userMoneySpent[currentUserID] < userMoneySpent[objectUser.id]) {
                        objectUser.id = currentUserID
                        objectUser.priority = priCounter
                        objectUser.itemsLeft = user.objects.size
                    }
                    //Users have spent the same amount of money, and have prioritized object the equally
                    else if (key == objectUser.priority && userMoneySpent[currentUserID] == userMoneySpent[objectUser.id]) {
                        let firstUserItemsLeft: number = objectUser.itemsLeft - userObjectsAquired[objectUser.id].length
                        let currentUserItemsLeft: number = user.objects.size - userObjectsAquired[currentUserID].length

                        //The user with less available items left gets the item 
                        if (currentUserItemsLeft < firstUserItemsLeft) {
                            objectUser.id = currentUserID
                            objectUser.priority = priCounter
                            objectUser.itemsLeft = Object.keys(user).length
                        }
                        //The are equally entitled to get the item
                        else if (currentUserItemsLeft == firstUserItemsLeft) {
                            let randInt: number = Math.floor(Math.random() * 2); // 0 or 1
                            if (randInt) { // 1 == true
                                objectUser.id = currentUserID
                                objectUser.priority = key
                                objectUser.itemsLeft = Object.keys(user).length
                            }
                        }
                    }
                }
            })
        })

        if (selectedObject != "") { //Iteration is done, user who gets object has been choosen
            userMoneySpent[objectUser.id] += selectedPrice
            completedObjects.push(selectedObject)
            userObjectsAquired[objectUser.id].push(selectedObject)
        }
        if (noNewObjects) { //All objects are completed
            console.log("Alogrithm done")
            console.log("Completed Objects: ", completedObjects)
            console.log("User money spent: ", userMoneySpent)
            console.log("User objects aquired: ", userObjectsAquired)
            done = true
        }
    }
}
export { distribute };
