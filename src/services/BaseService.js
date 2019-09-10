const PaginationMiddleware = require('./PaginationMiddleware');

export default class BaseService {
  constructor(mongooseModel, apiurl) {
    this.mongooseModel = mongooseModel;
    this.apiurl = apiurl;
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.store = this.store.bind(this);
    this.route = this.route.bind(this);
  }

  async index(req, res, next) {
    req.mongooseModel = this.mongooseModel;
    req.apiurl = 'localhost:8081' + this.apiurl;
    next();
  }

  async show(req, res) {
    const { id } = req.params;
    const mongooseObject = await this.mongooseModel.findById(id);
    return res.json(mongooseObject);
  }

  async update(req, res) {
    const { _id } = req.body;
    if (!_id) {
      return res.status(500).send('Object _id is not provided.');
    }

    try {
      const mongooseObject = await this.mongooseModel.findByIdAndUpdate(_id, req.body, {
        new: true
      });
      return res.json(mongooseObject);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const response = {
      message: `ID:  ${id} apagado com sucesso`,
      class: 'danger',
      id: id
    };

    try {
      await this.mongooseModel.findByIdAndRemove(id);
    } catch (err) {
      return res.status(500).send(err);
    }

    // req.io.emit('/financial/account', response);
    return res.status(200).send(response);
  }

  async store(req, res) {
    const mongooseObject = await this.mongooseModel.create(req.body);

    //req.io.emit('/financial/account', FinancialAccount);
    return res.json(mongooseObject);
  }

  route(routes) {
    const apiurlid = this.apiurl + '/:id';

    routes.get(this.apiurl, this.index, PaginationMiddleware.laravelPagination);
    routes.get(apiurlid, this.show);
    routes.delete(apiurlid, this.delete);
    routes.put(this.apiurl, this.update);
    routes.post(this.apiurl, this.store);
  }
}


