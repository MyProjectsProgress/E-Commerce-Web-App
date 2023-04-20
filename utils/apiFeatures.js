class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        // Getting rid of ['page', 'sort', 'limit', 'fields'] that comes in the request header
        const queryStringObj = { ...this.queryString };  // Why Destruction? Because I don't wanna pass the request query by refrence. Just need a copy of it.
        const exlcudesFields = ['page', 'sort', 'limit', 'fields'];
        exlcudesFields.forEach(field => delete queryStringObj[field]);

        // FILTERATION USING [gt, gte, lt, lte]
        let queryStr = JSON.stringify(queryStringObj); //convert the query object to json string to apply replace function on it
        queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, match => `$${match}`); // applying the most strange function in coding history
        queryStr = JSON.parse(queryStr);

        this.mongooseQuery = this.mongooseQuery.find(queryStr);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            // price, -sold => [price, -sold] => price -sold
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-cteateAt');
        }
        return this;
    }

    limitFileds() {
        if (this.queryString.fields) {
            const fields = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName == 'Products') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }

        return this;
    }

    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit; // i am on page 2 * limit is 10 = 20 is the last document in the current page

        // Pagination Result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit); // 50 total docs / 10 num of pages = 5 per page

        // Next Page
        if (endIndex < countDocuments) {
            pagination.nextPage = page + 1;
        }

        if (skip > 0) {
            pagination.previousPage = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;

        return this;
    }
};

module.exports = ApiFeatures;