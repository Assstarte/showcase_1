const Controller = require('../controller')

class Links extends Controller {
    index(req, res){
        res.render('admin/links/index', {
            layout: 'admin.hbs',
            dashboard: true,
            username: req.session.login
        })
    }
}

module.exports = new Links()