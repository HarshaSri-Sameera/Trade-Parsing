# Take-home Assignment - Trade Parsing and Balance Calculator

Objective: Develop a server side application using Node.js and MongoDB and complete the following tasks.

## Task 1

- Implement an API that accepts a CSV file as the input, parses the data present in it and stores it in a database.
    - CSV file to be taken as input:
        
        [KoinX Assignment CSV Sample.csv](https://prod-files-secure.s3.us-west-2.amazonaws.com/d529bad7-781a-4667-ae70-719d4793d77d/d14b32f7-e76e-4277-b587-b782d795cfda/KoinX_Assignment_CSV_Sample.csv)
        
    - Each row has details about a cryptocurrency trade. The `UTC_Time` column mentions when the trade happened. `Operation` column mentions whether it’s a buy trade or a sell trade. `Market` gives the market in which the trade happened. The `Market` column’s values have 2 `/` separated assets. The asset on the left is called the `base coin` and the asset on the right is called the `quote coin`. For example, in the first row in the above sample file, `BTC` is the `base coin` and `INR` is the `quote coin`. The `Buy/Sell Amount` column has the quantity of `base coin` being bought or sold. For example, in the first row, 25 BTC is being bought. `Price` column’s values mention the price at which the `base coin` is bought or sold in terms of the `quote coin`.
    - Design a database schema and then store the trade data parsed from the CSV in it. Assume that all of these trades that we would upload belong to the same account.

## Task 2

- Implement an API that would give the asset-wise balance of the account at any given timestamp.
- JSON Body input of the API:

```jsx
{
  "timestamp": "2022-09-28 12:00:00"
}
```

- Expected Response according to the above file:

```jsx
{
  "BTC": 15,
  "MATIC": 100
}
```

- Explanation:
    - Before time “2022-09-28 12:00:00”, there were 2 transactions for BTC, one buy trade with amount as 25 and one sell trade with amount as 10. Hence the end balance at time “2022-09-28 12:00:00” would be 25 - 10 = 15.
    - Similarly for MATIC, there was only one buy trade, hence the balance would be 100.
- If the `timestamp` input would be "2022-09-27 12:00:00", then the output would be:

```jsx
{
  "BTC": 15
}
```

- There wouldn’t be any entry of MATIC because there wasn’t any MATIC trade before the given timestamp.

**Optional Tasks:-**

1. Deploy your database using MongoDB Atlas or other similar tools.
2. Deploy your backend using platforms like Heroku or any cloud platform like AWS, GCP or Azure and expose the API to the public.

**Please host your code on GitHub.**

**Notes:-**

1. Think of this assignment as a production grade project. Using best practices, writing clean code etc. will fetch you additional points.
2. Do think well about how you want to design your database schemas.
3. We care about the usage of version control and the way you structure(and name) your commits!

**Once you’re done with the tasks, please send over the GitHub and Deployed Link(if done) to the same email that you received this assignment in.**