var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');

const serviceAccount = require('./adi-personal-test-91d131b7888e.json');


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});




const db = admin.firestore();


//LOGIDATABASERN
const docRef = db.collection('nodejstest').doc('lovelace');
const loginDbColl = db.collection('loginDetails');

async function setTest() {

	await docRef.set({
		first: 'Ada',
		last: 'Lovelace',
		born: 1815
	}).then(() => {
		console.log("Done!")
	});

}

/* GET users listing. */
router.get('/Test', function(req, res, next) {

	setTest();

	res.send('respond with a resource');
});


router.post('/login', async function(req, res, next) {
	console.log("CreateUer")

	let phoneNumber = req.body.username

	const querySnapshot = await loginDbColl.where('phoneNumber', '==', phoneNumber).get();

	if (querySnapshot.empty) {
		console.log("Emty")
		res.send(false)
	} else {
		res.send({ "mutualDocs": ["RES"] })
	}

});

router.post('/mutualcontacts', async function(req, res, next) {
	console.log("CreateUer")

	let phoneNumber = req.body.username;
	let returnArray = []
	for (let i of req.body.phoneNums) {
		console.log(typeof i)




		await db.collection("loginDetails").where("phoneNumber", "==", i)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());


					db.collection(doc.data().phoneNumber).where("phN", "array-contains", phoneNumber)
						.get()
						.then((mquerySnapshot) => {
							mquerySnapshot.forEach((mdoc) => {
								// doc.data() is never undefined for query doc snapshots
								console.log(mdoc.id, " => ", mdoc.data());



								console.log("Mutual Contacts:" + doc.data().phoneNumber)

								returnArray.push(doc.data().phoneNumber)

							});
						})
						.catch((error) => {
							console.log("Error getting m documents: ", error);
						});

				});
			})
			.catch((error) => {
				console.log("Error getting documents: ", error);
			});
		//
		// let mq = query(collection(db, "cities"), where("username", "==", i));
		//
		// let mquerySnapshot = await getDocs(mq);
		// mquerySnapshot.forEach((doc) => {
		// 	// doc.data() is never undefined for query doc snapshots
		// 	console.log(doc.id, " => ", doc.data());
		//
		// });

		// });
		//
		// await db.collection('loginDetails').where("username", "==", i).get().then(docs => {
		//
		// 	console.log("DOCS" + docs.docs)
		// 	if (!docs.docs.empty) {
		// 		for (let j in docs.docs) {
		// 			console.log(j)
		// 			mutualQueryCheck = db.collection(i).where("phN", "array-contains", j.phoneNumber.toString()).get().then(mDocs => {
		// 				console.log(mDocs + " +" + mDocs.val)
		// 				returnArray.push(mDocs.val);
		// 			})
		//
		// 		}
		// 	} else {
		// 		console.log("Contact Does Not Exist!");
		//
		// 	}
		// })


	}

	console.log("This is Return Arrray" + returnArray)

	res.send({ "mutualDocs": returnArray })

});



+
	router.post('/register', async function(req, res, next) {

		console.log("CreateUer")

		let phoneNumber = req.body.username
		let password = req.body.password
		// let name = req.body.name

		let name = "HardCodedTest"
		let regRef = loginDbColl.doc(phoneNumber)


		console.log(phoneNumber + "// " + password + " //" + name);


		await regRef.set({
			name: name,
			password: password,
			phoneNumber: phoneNumber
		}).then(() => {
			console.log("registration  Request Sent")
		})


		res.send('respond with a resource');
	});



module.exports = router;
