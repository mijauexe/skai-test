# skai-tasks
A few solved tasks.


## Build and run locally
You should clone this repo and run:
```bash
docker-compose up
``` 
in the root of the project if you want to build and run the project locally.

## Alternative build and run locally
You should clone this repo first.
If you want to check out Task 1, position yourself in the task1 directory and run these commands:
```bash
npm install
npm start
``` 
For tasks 2 and 3, you should run:
```bash
flask --app server_task2 run -p 5000
``` 
and
```bash
flask --app server_task3 run -p 5001
``` 
in their respective directories.

## Testing Task 1
Visit [localhost:5173](http://localhost:5173)

## Testing Task 2
For Task 2, you should POST the localhost:5000 with the following structure:
```json
{
    "productListings": [
        {
            "productID": "123",
            "authorizedSellerID": "A1"
        }
    ],
    "salesTransactions": [
        {
            "productID": "123",
            "sellerID": "A2"
        }
    ]
}
``` 

## Testing Task 3
For Task 3, you should POST the localhost:5001 with the following structure:
```json
{
    "start_times": [10, 20, 30, 40, 50, 60],
    "end_times": [15, 25, 35, 45, 55, 65]
}
``` 

## Stack
JavaScript, Python
