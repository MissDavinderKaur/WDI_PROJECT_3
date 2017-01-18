module.exports = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/makemynight',
  secret: process.env.SECRET || 'makemynightsecret'
};
