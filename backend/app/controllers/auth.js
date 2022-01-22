import db from '../models/index.js';

const Users = db.users;
const Notes = db.notes;

async function authenticate(token, title) {
    let ans = {
        status: false,
        message: ''
    }

    const user = await Users.findOne({where: {
        token: token
    }});
    if (!user) {
        ans.message = 'fake token!';
        return ans;
    };

    const note = await Notes.findOne({where: {
        title: title,
        username: user.username
    }});
    if (!note) {
        ans.message = 'note does not exist';
        return ans;
    };

    ans.status = true;
    ans.title = title;
    ans.username = user.username;
    return ans;
};

export default authenticate;