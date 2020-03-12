const jwt = require('jsonwebtoken');

const keys = require('../Config/Constants');
const User = require('../Models/User');

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, keys.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          status: false, data: {}, error: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: false, data: {}, error: 'Auth token is not supplied'
    });
  }
};

const authorisedUser = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, keys.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          status: false, data: {}, token: 'invalid', error: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;

        let userId = req.decoded.id;

        User.findByPk(userId).then(response => {
          if (response === null) {
            console.log(`User not found`);
            return res.send({ status: false, data: {}, error: 'User not found' })
          } else {
            console.log(`User is found`);
            req.user = response;
            req.token = token;
            // return res.send({ status: true, data: response, token: token, error: '' })
            next();
          }
        }).catch(error => {
          console.log(error)
          return res.send({ status: false, data: {}, error: error })
        })
      }
    });
  } else {
    return res.json({
      status: false, data: {}, error: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken,
  authorisedUser: authorisedUser
}