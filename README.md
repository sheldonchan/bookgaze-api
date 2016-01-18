# bookgaze-api
Creates a Node.JS service to retrieve recommendations and ratings using the Amazon API. This is the back-end service to the Bookgaze recommender application. 

## Installation

Install using npm:
```bash
$ git clone http://github.com/sheldonchan/bookgaze-api
$ cd bookgaze-api
$ npm install
```

## Quick Start

You will need to create a config.json file that contains your AWS credentials and drop the file into the same folder. If you're unfamiliar how to get these keys, see: http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html

```json
{
  "AWS_TAG": "<INSERT AWS_TAG>",
  "AWS_ACCESS_KEY_ID": "<INSERT AWS ACCESS KEY ID HERE>",
  "AWS_SECRET_ACCESS_KEY": "<INSERT SECRET ACCESS KEY HERE>",
  "AWS_DEFAULT_REGION": "<INSERT DEFAULT REGION HERE>"
}
```
Once you've created this file in the same folder, you can run the following to launch the service.

```bash
$ cd bookgaze-api
$ node index.js
```

Open a browser and point to: http://127.0.0.1:3000/api/v1/search?title=great%expectations
