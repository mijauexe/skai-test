from flask import Flask, request, jsonify

app = Flask(__name__)


def identify_unauthorized_sales(productListings, salesTransactions):
    authorized_products = {listing['productID']: listing['authorizedSellerID'] for listing in productListings}

    unauthorized_sales = []
    for transaction in salesTransactions:
        product_id = transaction['productID']
        seller_id = transaction['sellerID']

        # Unauthorized transaction is the one where either:
        # The seller id doesn't exist in the authorized sellers list
        # The product id doesn't exist in product list
        # The product id matches, but the seller isn't authorized

        if product_id not in authorized_products or seller_id not in set(
                [listing['authorizedSellerID'] for listing in productListings]) or authorized_products[
            product_id] != seller_id:
            unauthorized_sales.append({"productID": product_id, "sellerID": seller_id})

    return unauthorized_sales


@app.route('/', methods=['POST'])
def process_data():
    # Get the JSON data from the request
    data = request.json

    # Ensure that the required fields are present in the request
    if 'productListings' not in data or 'salesTransactions' not in data:
        return jsonify({"error": "Invalid input. 'productListings' and 'salesTransactions' are required fields."}), 400

    # Access productListings and salesTransactions from the JSON data
    productListings = data.get('productListings', [])
    salesTransactions = data.get('salesTransactions', [])

    # Check whether the request is properly formatted
    for item in productListings:
        if 'authorizedSellerID' not in item or 'productID' not in item:
            response = {
            "unauthorized_sales": [],
                "error": "wrong input"
            }
            return jsonify(response), 400

    for item in salesTransactions:
        if 'productID' not in item or 'sellerID' not in item:
            response = {
            "unauthorized_sales": [],
                "error": "wrong input"
            }
            return jsonify(response), 400

    try:
        # Identify unauthorized sales
        unauthorized_sales = identify_unauthorized_sales(productListings, salesTransactions)

        response = {
            "unauthorized_sales": unauthorized_sales
        }
        return jsonify(response), 200
    except:
        # Exception returns server error
        response = {
            "unauthorized_sales": [],
            "error": "Server Error"
        }
        return jsonify(response), 400


if __name__ == '__main__':
    app.run(debug=True, port = 5000, host="0.0.0.0")