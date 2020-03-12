const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const passport = require('passport');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sequelize = require('./Config/Database');
const Catalogue = require('./Models/Catalogue');
const User = require('./Models/User');
const keys = require('./Config/Constants');

const middleware = require('./Middleware/Middleware');

const app = express()
const Op = Sequelize.Op

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./Config/Passport')(passport);

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'youremail@gmail.com',
//         pass: 'yourpassword'
//     }
// });

sequelize.sync({ force: false });

const getTimeStampConsole = () => {
    var datetime = Date();
    console.log(chalk.bold.cyan('=============================================================================================='));
    console.log(chalk.bold.cyan('================= ' + datetime + ' ===================='));
    console.log(chalk.bold.cyan('=============================================================================================='));
}

app.get('/', (req, res) => {
    getTimeStampConsole();
    console.log('Home Run');
    res.send('Home Run')
})

// Check if email exists 
app.get('/user/email', (req, res) => {
    getTimeStampConsole();
    console.log('/user/email: ');
    let email = req.query.email

    User.findOne({
        attributes: ['id'],
        where: { email: email }
    }).then(user => {
        console.log('All user:', JSON.stringify(user));
        let response;
        if (user) {
            response = true
        } else {
            response = false
        }
        return res.send(response)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Check if email exists
app.get('/user/forgot-password', (req, res) => {
    getTimeStampConsole();
    console.log('/user/forgot-password: ');

    const email = req.query.email;
    let response;

    User.findOne({
        attributes: ['id', 'resetToken', 'tokenExpiry'],
        where: { email: email }
    }).then(user => {
        console.log('All user:', JSON.stringify(user));
        if (user) {

            let userId = user.id;
            let resetToken = user.resetToken;
            let tokenExpiry = user.tokenExpiry;

            const currentDate = moment().add(5.5, 'hours');
            const randomNum = Math.random().toString();

            console.log("tokenExpiry: ", tokenExpiry)
            console.log("currentDate: ", currentDate.toDate())

            let currentDateString = currentDate.valueOf().toString();
            let hashString = crypto.createHash('sha1').update(currentDateString + randomNum).digest('hex');
            let tokenExpiryNew = currentDate.add(2, 'hours').toDate();

            if (resetToken == null || tokenExpiry == null) {
                resetToken = hashString;
                tokenExpiry = tokenExpiryNew
            } else if (tokenExpiry != null && tokenExpiry > currentDate.toDate()) {
                resetToken = hashString;
                tokenExpiry = tokenExpiryNew
            } else {
                // Do not update token
            }

            User.update({ resetToken: resetToken, tokenExpiry: tokenExpiry }, {
                where: {
                    id: userId
                }
            }).then(response => {
                response = { type: 'success', value: 'We have sent you password reset email.' };
            }).catch(err => {
                response = { type: 'danger', value: 'We have sent you password reset email.' };
            });

            // var mailOptions = {
            //     from: 'youremail@gmail.com',
            //     to: 'myfriend@yahoo.com',
            //     subject: 'Sending Email using Node.js',
            //     text: 'That was easy!'
            // };
            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            // response = { type: 'danger', value: 'Email send error.' };
            //     } else {
            //         console.log('Email sent: ' + info.response);
            response = { type: 'success', value: 'We have sent you password reset email.' };
            //     }
            // });
        } else {
            response = { type: 'danger', value: 'Email does not found.' }
        }
        return res.send(response)
    }).catch(err => {
        console.log(err);
        response = { type: 'danger', value: 'Something went wrong.' }
        return res.send(response)
    });
})

// Check if token exists
app.get('/user/token', (req, res) => {
    getTimeStampConsole();
    console.log('/user/token: ');

    const token = req.query.token;
    let response;

    User.findOne({
        attributes: ['id', 'resetToken', 'tokenExpiry'],
        where: { reset_token: token }
    }).then(user => {
        console.log('All user:', JSON.stringify(user));
        if (user) {

            let userId = user.id;
            let resetToken = user.resetToken;
            let tokenExpiry = user.tokenExpiry;

            const currentDate = moment().add(5.5, 'hours');

            console.log("tokenExpiry: ", tokenExpiry)
            console.log("currentDate: ", currentDate.toDate())

            if (tokenExpiry != null && tokenExpiry < currentDate.toDate()) {
                response = { type: 'danger', value: 'Token is expired' }
            } else {
                response = { type: 'success', value: 'OK' };
            }
        } else {
            response = { type: 'danger', value: 'Token is invalid, Please try sending reset password email again.' }
        }
        return res.send(response)
    }).catch(err => {
        console.log(err);
        response = { type: 'danger', value: 'Something went wrong.' }
        return res.send(response)
    });
})

// Find all users
app.get('/users', (req, res) => {
    getTimeStampConsole();
    console.log('/catalogue/page-search: ');
    let offsetRecords = req.query.per_page * (req.query.current_page - 1)
    let limitRecords = parseInt(req.query.per_page)

    User.findAndCountAll({
        limit: limitRecords,
        offset: offsetRecords
    }).then(users => {
        console.log('All users:', JSON.stringify(users, null, 4));
        return res.send(users)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Create a new user
app.post('/user/register', (req, res) => {

    getTimeStampConsole();

    console.log('req.body: ', req.body)
    const { name, email, password } = req.body

    User.create({ name: name, email: email, password: password }).then(user => {
        console.log(`${name}'s auto-generated ID:`, user.id);
        return res.send(user)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Update reset password in user row
app.post('/user/reset-password', (req, res) => {
    getTimeStampConsole();

    const { token, password, re_password } = req.body

    User.findOne({
        attributes: ['id', 'name'],
        where: { resetToken: token }
    }).then(user => {
        console.log('All user:', JSON.stringify(user));
        if (user) {
            user.update({
                password: password,
                resetToken: null,
                tokenExpiry: null
            }).then(response => {
                console.log(`Password updated successfully! for ${user.name}`);
                return res.send(true)
            }).catch(err => {
                console.log('update failed ! - ', err);
                return res.send(err)
            });

        }
    }).catch(error => {
        console.log(error)
    })
})

// User login
app.post('/user/login', (req, res) => {

    getTimeStampConsole();

    const { email, password } = req.body

    User.findOne({
        where: { email: email }
    }).then(response => {

        if (response === null) {
            return res.send({ status: false, data: {}, error: 'Please enter correct email address' })
        } else {
            console.log(`${email} is found`);
            if (response.correctPassword(password) === true) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: response.id,
                    name: response.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.JWT_SECRET,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                        // expiresIn: '1h'
                    },
                    (err, token) => {
                        console.log('jwt.sign error: ', err)
                        return res.json({ status: true, data: response, token: token, error: '' })
                    }
                );
            } else {
                console.log('Password is incorrect');
                return res.send({ status: false, data: {}, error: 'Password is incorrect' })
            }
        }
    }).catch(error => {
        console.log(error)
        return res.send(error)
    })
})

// Get user profile from token
app.post('/user/token', middleware.checkToken, (req, res) => {

    getTimeStampConsole();

    let userId = req.decoded.id;

    User.findByPk(userId).then(response => {
        if (response === null) {
            return res.send({ status: false, data: {}, error: 'User not found' })
        } else {
            console.log(`User is found`);
            return res.send({ status: false, data: response, error: '' })
        }
    }).catch(error => {
        console.log(error)
        return res.send(error)
    })
})

// check if user is authorised
app.get('/user/profile', middleware.authorisedUser, (req, res) => {

    getTimeStampConsole();

    return res.send({ status: true, data: req.user, token: req.token, error: '' })
})

// Create an User
app.post('/user', (req, res) => {
    getTimeStampConsole();
    const { name, email, password } = req.body

    User.create({ name: name, email: email, password: password }).then(user => {
        console.log(`${user}'s auto-generated ID:`, user.id);
        return res.send(user)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Update an User
app.patch('/user', (req, res) => {
    getTimeStampConsole();
    const { name, email, password } = req.body

    let updateData = {
        name: name,
        email: email,
    }

    if (password != "") {
        updateData.password = password;
    }

    // User.update(updateData, {
    //     where: {
    //         id: req.body.id
    //     }
    // }).then(response => {
    //     console.log(`Item with id = ${req.body.id} updated successfully!`);
    //     return res.send(response)
    // }).catch(err => {
    //     console.log('update failed ! - ', err);
    //     return res.send(err)
    // });

    User.findOne({
        // attributes: ['id', 'name'],
        where: { id: req.body.id }
    }).then(user => {
        // console.log('All user:', JSON.stringify(user));
        if (user) {
            user.update(updateData).then(response => {
                console.log(`Item with id = ${req.body.id} updated successfully!`);
                return res.send(response)
            }).catch(err => {
                console.log('update failed ! - ', err);
                return res.send(err)
            });
        }
    }).catch(error => {
        console.log(error)
    })

})

// Delete User with id
app.delete('/users/:id', middleware.authorisedUser, (req, res) => {

    getTimeStampConsole();

    const { id } = req.params

    User.destroy({
        where: {
            id: id
        }
    }).then(response => { // rowDeleted will return number of rows deleted
        if (response === 1) {
            console.log('Deleted successfully');
        }
        return res.json(response)
    }, function (err) {
        console.log(err);
        return res.json(err)
    });
})

// Create a new user
app.get('/catalogue', (req, res) => {
    getTimeStampConsole();
    Catalogue.findAll().then(data => {
        console.log('All data:', JSON.stringify(data, null, 4));
        return res.send(data)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Search Item Pagination
app.get('/catalogue/page-search', (req, res) => {
    getTimeStampConsole();
    console.log('/catalogue/page-search: ');
    let offsetRecords = req.query.per_page * (req.query.current_page - 1)
    let limitRecords = parseInt(req.query.per_page)

    let searchcategory = req.query.category

    let whereQuery = {
        status: 'ACTIVE',
        category: searchcategory,
        [Op.or]:
            [
                {
                    description: {
                        [Op.like]: '%' + req.query.keyword + '%'
                    },
                    isTagSearchOnly: 'NO'
                },
                {
                    tags: {
                        [Op.like]: '%' + req.query.keyword + '%'
                    },
                    isTagSearchOnly: 'YES'
                },
            ]
    }

    if (req.query.admin == 1) {
        whereQuery = {
            status: 'ACTIVE',
            category: searchcategory,
        }
    }

    Catalogue.findAndCountAll({
        // attributes: ['id', 'category', 'description', 'tags', 'isTagSearchOnly', 'status', 'createdAt'],
        attributes: { exclude: ['updatedAt'] },
        where: whereQuery,
        limit: limitRecords,
        offset: offsetRecords
    }).then(data => {
        console.log('All data:', JSON.stringify(data, null, 4));
        return res.send(data)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Search Item Pagination
app.get('/catalogue/admin', (req, res) => {

    getTimeStampConsole();

    let offsetRecords = req.query.per_page * (req.query.current_page - 1)
    let limitRecords = parseInt(req.query.per_page)
    let searchcategory = req.query.category
    let searchInput = req.query.search_input

    let whereCondition;
    if (searchInput == "") {
        whereCondition = {
            category: searchcategory,
        }
    } else {
        whereCondition = {
            category: searchcategory,
            [Op.or]:
                [
                    {
                        description: {
                            [Op.like]: '%' + searchInput + '%'
                        }
                    },
                    {
                        tags: {
                            [Op.like]: '%' + searchInput + '%'
                        }
                    },
                ]
        }
    }

    Catalogue.findAndCountAll({
        attributes: { exclude: ['updatedAt'] },
        where: whereCondition,
        limit: limitRecords,
        offset: offsetRecords
    }).then(data => {
        console.log('All data:', JSON.stringify(data, null, 4));
        return res.send(data)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Search Item
app.get('/catalogue/search', (req, res) => {
    getTimeStampConsole();
    const recordLimit = 3;
    let keyword = req.query.keyword;
    console.log('/catalogue/search');

    sequelize.query(`
    ( SELECT * FROM catalogue WHERE category = 'INFO' AND status = 'ACTIVE' AND ((is_tag_search_only = 'NO' AND description like '%${keyword}%') OR (is_tag_search_only = 'YES' AND tags like '%${keyword}%')) LIMIT ${recordLimit} )
    UNION ALL 
    ( SELECT * FROM catalogue WHERE category = 'DEFINITION' AND status = 'ACTIVE' AND ((is_tag_search_only = 'NO' AND description like '%${keyword}%') OR (is_tag_search_only = 'YES' AND tags like '%${keyword}%')) LIMIT ${recordLimit} )
    UNION ALL 
    ( SELECT * FROM catalogue WHERE category = 'OTHERDETAILS' AND status = 'ACTIVE' AND ((is_tag_search_only = 'NO' AND description like '%${keyword}%') OR (is_tag_search_only = 'YES' AND tags like '%${keyword}%')) LIMIT ${recordLimit} )
    UNION ALL 
    ( SELECT * FROM catalogue WHERE category = 'PROJECTS' AND status = 'ACTIVE' AND ((is_tag_search_only = 'NO' AND description like '%${keyword}%') OR (is_tag_search_only = 'YES' AND tags like '%${keyword}%')) LIMIT ${recordLimit} )
    UNION ALL 
    ( SELECT * FROM catalogue WHERE category = 'QUESTIONS' AND status = 'ACTIVE' AND ((is_tag_search_only = 'NO' AND description like '%${keyword}%') OR (is_tag_search_only = 'YES' AND tags like '%${keyword}%')) LIMIT ${recordLimit} )
    UNION ALL 
    ( SELECT * FROM catalogue WHERE category = 'TEAM' AND status = 'ACTIVE' AND ((is_tag_search_only = 'NO' AND description like '%${keyword}%') OR (is_tag_search_only = 'YES' AND tags like '%${keyword}%')) LIMIT ${recordLimit} )
    `).then(([results, metadata]) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        // console.log(chalk.bold.bgGreen('results'))
        // console.log(results)
        return res.send(results)
    }).catch(err => {
        // console.log(chalk.bold.bgYellow('error'))
        console.log(err)
        return res.send(err)
    })
})

// Search Item Pagination
app.get('/catalogue/search-category', (req, res) => {

    getTimeStampConsole();

    let offsetRecords = req.query.per_page * (req.query.current_page - 1)
    let limitRecords = parseInt(req.query.per_page)
    let searchcategory = req.query.category
    let keyword = req.query.keyword

    Catalogue.findAndCountAll({
        attributes: { exclude: ['updatedAt'] },
        where: {
            category: searchcategory,
            [Op.or]:
                [
                    {
                        description: {
                            [Op.like]: '%' + keyword + '%'
                        }
                    },
                    {
                        tags: {
                            [Op.like]: '%' + keyword + '%'
                        }
                    },
                ]
        },
        limit: limitRecords,
        offset: offsetRecords
    }).then(data => {
        console.log('All data:', JSON.stringify(data, null, 4));
        return res.send(data)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Create an item
app.post('/catalogue', (req, res) => {
    getTimeStampConsole();
    console.log('CREATE CATALOGUE')
    console.log(req.body)

    const { category, description, tags, isTagSearchOnly, status } = req.body
    // console.log('CREATE category: ', category)

    Catalogue.create({ category: category, description: description, tags: tags, isTagSearchOnly: isTagSearchOnly, status: status }).then(catalogue => {
        console.log(`${category}'s auto-generated ID:`, catalogue.id);
        return res.send(catalogue)
    }).catch(err => {
        console.log(err);
        return res.send(err)
    });
})

// Update an item
app.patch('/catalogue', (req, res) => {
    getTimeStampConsole();
    console.log('UPDATE CATALOGUE')
    console.log(req.body)

    const { category, description, tags, isTagSearchOnly, status } = req.body
    console.log('UPDATE category: ', description)

    Catalogue.update({
        category: category, description: description, tags: tags, isTagSearchOnly: isTagSearchOnly, status: status
    }, {
        where: {
            id: req.body.id
        }
    }).then(response => {
        console.log(`Item with id = ${req.body.id} updated successfully!`);
        return res.send(response)
    }).catch(err => {
        console.log('update failed ! - ', err);
        return res.send(err)
    });

})

app.delete('/catalogue/:id', middleware.authorisedUser, (req, res) => {
    getTimeStampConsole();
    console.log("req.params");
    console.log(req.params);
    const { id } = req.params

    Catalogue.destroy({
        where: {
            id: id
        }
    }).then(response => { // rowDeleted will return number of rows deleted
        if (response === 1) {
            console.log('Deleted successfully');
        }
        return res.json(response)
    }, function (err) {
        console.log(err);
        return res.json(err)
    });
})

const options = {
    key: fs.readFileSync('/etc/letsencrypt/archive/wts.wtshub.com/privkey10.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/archive/wts.wtshub.com/cert10.pem')
};

// app.listen(3001, () => {
//     console.log(chalk.blue('PROJECT ONE - Server runnig on port : 3001'))
// })

https.createServer(options, app).listen(3001, () => {
    console.log(chalk.blue('PROJECT ONE - Server runnig on port : 3001'))
})
