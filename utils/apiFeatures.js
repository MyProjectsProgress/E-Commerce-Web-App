class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        // Getting rid of ['page', 'sort', 'limit', 'fields'] that comes in the request header
        const queryStringObj = { ...this.queryString };  // Why Destruction? Because I don't wanna pass the request query by refrence. Just need a copy of it.
        const exlcudesFields = ['page', 'sort', 'limit', 'fields'];  // these are the keywords that I don't want to filter with in the req.query.
        exlcudesFields.forEach(field => delete queryStringObj[field]); // clean the query string object from the unwanted queries

        // FILTERATION USING [gt, gte, lt, lte]
        // the req.body = { price: { gte: '50' }, ratingsAverage: { gte: '4' } }
        // the wanted query string object to work with mongoose = { price: {$gte: '50'}, ratingsAverage: {$gte: '4'}}
        // we do that by first stringify the query string object then apply the replace function
        let queryStr = JSON.stringify(queryStringObj); //convert the query object to string to apply replace function on it

        // /\b(gte|gt|lte|lt)\b/g => regular expression that match gte or gt or lte or lt an pass it to a call back function
        //  (match) => `$${match}` => if the match happens we add dollar sign to the matched expression
        // ex: we found gte, we will add $ before gte so it will be $gte
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // applying the most strange function in coding history

        // converting the expression to json again
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

        // return the class object so that we can chain methods
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            // toString solved the problem of reading the query as undefined
            const sortBy = this.queryString.sort.toString().split(',').join(' '); // [price, -sold] => price -sold
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            // default sorting is the newest then the oldest added fields
            this.mongooseQuery = this.mongooseQuery.select('-cteateAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            // converting from => ['price', '_id', 'title'] to =>  price _id title
            const fields = this.queryString.sort.toString().split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            // default select all fields but __v 
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === 'Products') {
                // query.$or => performs a logical OR operation on an array
                // $regex:  this.queryString.keyword => means does the title field contain the keyword?
                // $options: 'i' => not lower/ upper case sensitive
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                // because all other models has this field in common
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
        pagination.numberOfPages = Math.ceil(countDocuments / limit); // 50 total docs / 10 num of pages = 5 pages

        // Next Page
        // countDocuments refers to all documents in database
        // if countDocuments = 25 , limit is 10 document per page, so at page 2 the index = 2*10 = 20
        // the if condisiton checks if the ndex less than total documents so theres definitely remianing page
        if (endIndex < countDocuments) {
            pagination.nextPage = page + 1;
        }
        // skip refers to the rmeianing documents that will be added to the next page, so if it isn't = 0 so difinately there will be a prev page 
        if (skip > 0) {
            pagination.previousPage = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;

        return this;
    }
};

module.exports = ApiFeatures;