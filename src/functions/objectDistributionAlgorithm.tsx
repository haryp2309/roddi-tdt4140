import userDecisions from "./userDecision.json"

//Uses json
function objectDistributionAlgorithm() { // Worst case time complexity O(k*(n + n)), n = (all objects), k = (all unique objects)
    let userMoneySpent: any = {}
    let userObjectsAquired: any = {}
    let completedObjects: String[] = []

    //Intializing
    userDecisions.map(user => {
        userMoneySpent[user.id] = 0
        userObjectsAquired[user.id] = []
    })

    let done: boolean = false;

    while (!done) {
        let noNewObjects: boolean = true;
        let selectedObject: String = ""
        let selectedPrice: number = 0;
        let objectPrio: any = {};
        let priCounter: number = 1

        //Selects new highest prioritized object
        while (selectedObject == "") {
            let itemsLeft: boolean = false
            userDecisions.map(user => {
                let username: any = user.id
                let tempUser: any = user

                if (tempUser[priCounter] != undefined) {
                    itemsLeft = true
                    let objectName: String = tempUser[priCounter].name

                    //Check if objectName already distributed
                    if (selectedObject == "" && !completedObjects.includes(objectName)) {
                        noNewObjects = false;
                        selectedObject = objectName
                        selectedPrice = tempUser[priCounter].price

                        objectPrio.name = username
                        objectPrio.priority = priCounter
                        objectPrio.itemsLeft = Object.keys(user).length
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
            for (var pri in user) {
                let username: any = user.id
                let tempUser: any = user
                let objectName: String = tempUser[pri].name

                if (objectName == selectedObject && pri != "id" && username != objectPrio.name) {
                    //User has spent less money 
                    if (userMoneySpent[username] < userMoneySpent[objectPrio.name]) {
                        objectPrio.name = username
                        objectPrio.priority = priCounter
                        objectPrio.itemsLeft = Object.keys(user).length
                    }
                    //Users have spent the same amount of money, and have prioritized object the equally
                    else if (parseInt(pri) == objectPrio.priority && userMoneySpent[username] == userMoneySpent[objectPrio.name]) {
                        let firstUserItemsLeft: number = objectPrio.itemsLeft - userObjectsAquired[objectPrio.name].length
                        let currentUserItemsLeft: number = Object.keys(user).length - userObjectsAquired[username].length

                        //The user with less available items left gets the item 
                        if (currentUserItemsLeft < firstUserItemsLeft) {
                            objectPrio.name = username
                            objectPrio.priority = priCounter
                            objectPrio.itemsLeft = Object.keys(user).length
                        }
                        //The are equally entitled to get the item
                        else if (currentUserItemsLeft == firstUserItemsLeft){
                            let randInt: number = Math.floor(Math.random() * 2); // 0 or 1
                            if (randInt) { // 1 == true
                                objectPrio.name = username
                                objectPrio.priority = parseInt(pri)
                                objectPrio.itemsLeft = Object.keys(user).length
                            }
                        }

                    }
                }
            }
        })

        if (selectedObject != "") { //Itteration is done, user who gets object has been choosen
            userMoneySpent[objectPrio.name] += selectedPrice
            completedObjects.push(selectedObject)
            userObjectsAquired[objectPrio.name].push(selectedObject)
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
export { objectDistributionAlgorithm };
