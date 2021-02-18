const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'roddi-dev-91fcb';
const userAuth = {uid: "user_abc", email: "abc@xyz.com"}
const adminAuth = {uid: "admin_abc", email: "admin@admin.com"}

// Runs firebase test app against 
function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

// Bypass rules
function getAdminFirestore() {
    return firebase.initializeAdminApp({projectId: MY_PROJECT_ID}).firestore();
}

// Clear database before new test
beforeEach(async()=>{
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID})
});

describe("roddi_dev", () =>{
    it("Admin can add item to dodsbo", async() => {
        // Populate dummy data 
        const dodsboId = "min_dodsbo"
        const admin = getAdminFirestore();
        await admin.collection('dodsbo').doc(dodsboId).set({title: "MIN BOD", description: "JAAAA", admins: [adminAuth.uid], members: [userAuth.uid]})

        // Testing
        const db = getFirestore(adminAuth);
        const testDoc = db.collection('dodsbo').doc(dodsboId).collection('objects');
        await firebase.assertSucceeds(testDoc.add({title:"Yas", description:"Meow"}))
    });

    it("User can't add item to dodsbo", async() => {
        // Populate dummy data 
        const dodsboId = "min_dodsbo"
        const admin = getAdminFirestore();
        await admin.collection('dodsbo').doc(dodsboId).set({title: "MIN BOD", description: "JAAAA", admins: [adminAuth.uid], members: [userAuth.uid]})

        // Testing
        const db = getFirestore(userAuth);
        const testDoc = db.collection('dodsbo').doc(dodsboId).collection('objects');
        await firebase.assertFails(testDoc.add({title:"Yas", description:"Meow"}))
    });

    // it("User can create dodsbo", async() => {
    //     // Populate dummy data 
    //     const admin = getAdminFirestore();
    //     await admin.collection('user').add(userAuth);

    //     // Testing
    //     const db = getFirestore();
    //     const testDoc = db.collection('dodsbo');
    //     await firebase.assertSucceeds(testDoc.add({title: "", description: "", admins: [], members: []}))

    // });

    it("User can create profile", async() => {
        // Populate dummy data 
        

        // Testing
        
    });
});

// Clear database after test is done
after(async()=>{
    await firebase.clearFirestoreData({projectId: MY_PROJECT_ID})
});
    // it("User can create a profile", async() => {
    //     const data = {
    //         date_of_birth: '12/01/1998',
    //         email_adress: 'lala@gmail.com',
    //         first_name: 'Nicolas',
    //         last_name: 'Wong'
    //       };
    //     const db = getAdminFirestore()
    //     const testDoc = db.collection('user');
    //     await firebase.assertSucceeds(testDoc.add(data));
    // });
    // it("Deny user to create a profile false value", async() => {
    //     const data = {
    //         date_of_birth: '12/01/1998',
    //         email_adress: 2,
    //         first_name: 'Nicolas',
    //         last_name: 'Wong'
    //       };
    //     const db = getAdminFirestore()
    //     const testDoc = db.collection('user');
    //     await firebase.assertFails(testDoc.add(data));
    // });
    // it("Admin can add items to dodsbo", async() => {
    //     const admin = getAdminFirestore();
    //     const dodsbo_id = "Dødsbo_id_1";
    //     const setupdoc = admin.collection("dodsbo").doc(dodsbo_id);
    //     await setupdoc.set({admins: ['vlad'], members: ['cad'],
    //         title: "Dodsbo1", description: "Cool dodsbo1"});
    //     const db = getFirestore(myAuth);
    //     const testDoc = db.collection('dodsbo').doc(dodsbo_id).collection('objects').doc('dmeuXWgXG2HQ7DFZKQxX');
    //     await firebase.assertSucceeds(testDoc.get());
    // });