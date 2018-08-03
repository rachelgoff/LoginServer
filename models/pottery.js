var mongoose = require("mongoose");

var potterySchema = mongoose.Schema({
	user_id: {type: String, required: true},
	potteryName: {type: String},
	clayType: {type: String},
	createdAt: {type: Date, default: Date.now}
	//updatedAt: {type: Date}
});

var Pottery = mongoose.model("Pottery", potterySchema);
module.exports = Pottery;