const firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "./coffeshoop-1fa82302d55c.json",
    databaseURL: "https://coffeshoop-c4e75.firebaseio.com/"
})

module.exports = {
    getData(path) {
        return firebase.database().ref(path).once('value', function (snapshot) {
            return (snapshot.val() === null) ? {} : snapshot.val();
        })
    },
    pushData(path, data) {
        return firebase.database().ref(path).push(data).then(data => {
            return (data.path.pieces_)
        });
    },
    setData(path, data) {
        firebase.database().ref(path).set(data)
    },
    updateData(path, data) {
        firebase.database().ref(path).update(data)
    },
    removeData(path) {
        firebase.database().ref(path).remove()
    }
    // getAllData(){
    //
    // },
}