const mongoose = require('mongoose');
const debug = require('debug')('connect');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/kurban';
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  userName: String,
  botId: {
    unique: true,
    type: Number,
    required: true,
  },
});

exports.users = mongoose.model('users', UserSchema);

exports.connect = async () => {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
  });
  
  debug('connected to mongo');
};
