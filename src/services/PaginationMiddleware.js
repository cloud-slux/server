const XFilterQueryOtimizer = require('../utils/expressionsParsers/XFilter/XFilterQueryOtimizer')
  .default;
const xFilterQueryOtimizer = new XFilterQueryOtimizer();

module.exports = {
  async laravelPagination(req, res) {
    const mongooseModel = req.mongooseModel;
    const url = req.apiurl;

    let page = req.query.page;

    if (!page) {
      page = 1;
    }

    let limit = req.query.limit;
    if (!limit) {
      limit = 10;
    }

    let select = req.query.select;
    if (!select) {
      select = '';
    } else {
      select = select.replace(new RegExp(',', 'g'), ' ');
    }

    let filter = {};
    if (!!req.query.q) {
      filter = xFilterQueryOtimizer.Filter(req.query.q);
    }

    // for (var property in req.query) {
    //   if (req.query.hasOwnProperty(property)) {
    //     if (property == 'page' || property == 'limit' || property == 'select') {
    //       continue;
    //     }

    //     const value = req.query[property];

    //     if (property.endsWith('$contains')) {
    //       const field = property.replace('$contains', '');
    //       filter[field] = { $regex: value, $options: 'i' };
    //     } else if (property.endsWith('$equals')) {
    //       const field = property.replace('$equals', '');
    //       filter[field] = value;
    //     }
    //   }
    // }

    console.log(filter);

    const myCustomLabels = {
      totalDocs: 'total',
      docs: 'data',
      limit: 'per_page',
      page: 'current_page',
      nextPage: 'next_page',
      prevPage: 'prev_page',
      totalPages: 'last_page'
    };

    const options = {
      page: page,
      limit: limit,
      select: select,
      customLabels: myCustomLabels,
      sort: { _id: 1 }
    };

    try {
      const mongooseObjects = await mongooseModel.paginate(filter, options);

      mongooseObjects['path'] = url;
      mongooseObjects['first_page_url'] = url + '?page=1';
      mongooseObjects['last_page_url'] = url + '?page=' + mongooseObjects['last_page'];
      mongooseObjects['next_page_url'] =
        page == mongooseObjects['last_page'] ? null : url + '?page=' + mongooseObjects['next_page'];
      mongooseObjects['prev_page_url'] =
        page == 1 ? null : url + '?page=' + mongooseObjects['prev_page'];
      mongooseObjects['from'] = (page - 1) * limit + 1;
      mongooseObjects['to '] = page * limit;

      return res.json(mongooseObjects);
    } catch (err) {
      console.log(err);
    }
  }
};
