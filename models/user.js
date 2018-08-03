var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
	// username: {type: String, required: true, unique: true},
	// email: {type: String, required: true, unique: true},
	// password: {type: String, required: true},
	username: {type: String},
	email: {type: String},
	password: {type: String},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
});

var noop = function(){};

userSchema.pre("save", function(done){
	var user = this;

	if(!user.isModified("password")){
		return done();
	}

bcrypt.genSalt(SALT_FACTOR, function(err, salt){
	if (err) {return done(err);}

	bcrypt.hash(user.password, salt, noop, function(err, hashedPassowrd){
		if (err) {return done(err);}

		user.password = hashedPassowrd;
		done();
	});
});


});

userSchema.methods.checkPassword = function(guess, done){
	bcrypt.compare(guess, this.passowrd, function(err, isMatch){
		if (err) {return done(err);}
		done(null, isMatch);
	});
};

userSchema.methods.name = function(){
	return this.username;
};

var  User = mongoose.model("User", userSchema);

module.exports = User;