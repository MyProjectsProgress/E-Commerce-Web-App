This backend project was built using Node.js, Express, and MongoDB to create APIs for categories, brands, subcategories, and products.

Installation
Clone the repository from GitHub
git clone https://github.com/your-repo-name.git

Install the dependencies
npm install

Create a .env file with the following environment variables:
makefile
MONGO_URI=<your-mongodb-uri>
PORT=<your-port-number>

Start the server
npm start

API Endpoints

Categories
GET /categories
Returns a list of all categories.

GET /categories/:categoryId
Returns a specific category by ID.

POST /categories
Creates a new category.

PUT /categories/:categoryId
Updates an existing category by ID.

DELETE /categories/:categoryId
Deletes a category by ID.

Brands
GET /brands
Returns a list of all brands.

GET /brands/:brandId
Returns a specific brand by ID.

POST /brands
Creates a new brand.

PUT /brands/:brandId
Updates an existing brand by ID.

DELETE /brands/:brandId
Deletes a brand by ID.

Subcategories
GET /subcategories
Returns a list of all subcategories.

GET /subcategories/:subcategoryId
Returns a specific subcategory by ID.

POST /subcategories
Creates a new subcategory.

PUT /subcategories/:subcategoryId
Updates an existing subcategory by ID.

DELETE /subcategories/:subcategoryId
Deletes a subcategory by ID.

Products
GET /products
Returns a list of all products.

GET /products/:productId
Returns a specific product by ID.

POST /products
Creates a new product.

PUT /products/:productId
Updates an existing product by ID.

DELETE /products/:productId
Deletes a product by ID.

Contribution
Contributions are welcome! If you find a bug or want to add a feature, please submit a pull request.