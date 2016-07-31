// functional js programming
// https://www.youtube.com/watch?v=kA4-b7hvWhg&list=PLY5epGsMzzw_DIH5qQqI5nDtuiHpM3H6t&index=30
// ==============================

// Example 1: non functional way
// lots of duplicated code

function addUser(user) {
	try {
		var db = connectToDatabase(credentials());
		execute(db, asSqlInsert(user));
	} catch (e) {
		handleDatabaseError(e);
	}
}

function addTrack(track) {
	try {
		var db = connectToDatabase(credentials());
		execute(db, asSqlInsert(track));
	} catch (e) {
		handleDatabaseError(e);
	}
}

/*
 * Example 1: The functional way
 */

// 2. then refactor our functions
function addUser(db, user) {
	execute(db, asSqlInsert(user));
}
function addTrack(db, track) {
	execute(db, asSqlInsert(track));
}


// 1. extract what's common. extract the protocol/interaction from what's actually being done.
// in this case connecting to the database
function executeWithConnection(funcToExecute, argument) {
	try {
		var db = connectToDatabase(credentials());
		funcToExecute(db, argument);
	} catch(e) {
		handleDatabaseError(e);
	}
}

// 3. and then we invoke the operation as this
executeWithConnection(addUser, {'name': 'phil'});
executeWithConnection(addTrack, {'title': 'The JavaScripts'});

// in an OO design you often pass objects around
// in a functional design you pass functions around



// Example 2: closures not only for objects
// -----------------------------

// this is a pure function as its returning the counter. there is no state saved.
// this is great except we have to manually keep the counter somewhere. See counter var
function writeComment(count, author, text) {
	if (count > 3) {
		throw new Error(author + " executed too many actions!");
	}
	saveComment(author, text);
	return count + 1;
}
var counter = 0
counter = writeComment(counter, 'Tom', "Check it out");
counter = writeComment(counter, 'Tom', "Check it out");
counter = writeComment(counter, 'Tom', "Check it out");
counter = writeComment(counter, 'Tom', "Check it out");
counter = writeComment(counter, 'Tom', "Check it out");
// >> error Tom executed too many actions!


// Example 2: this method would be better

// leave writeComment alone
function writeComment(count, author, text) {
	if (count > 3) {
		throw new Error(author + " executed too many actions!");
	}
	saveComment(author, text);
	return count + 1;
}


// this function keeps 2 closures.
// 1 closure is immutable for the author
// 1 closure is mutable for the counter
// the returned function is bound to the counter
function makeWriteCommentFunction(author) {
	var counter = 0
	return function(text) {
		counter = writeComment(counter, author, text);
	}
}

var currentUserWritesComment = makeWriteCommentFunction("dave");
currentUserWritesComment("check this out");
currentUserWritesComment("check this out");
currentUserWritesComment("check this out");
currentUserWritesComment("check this out");
currentUserWritesComment("check this out");
// >> error dave has executed too many actions


// Example 3: TODO 31:56
// -------------------------
