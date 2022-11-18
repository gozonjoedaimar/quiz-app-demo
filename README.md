# quiz-app-demo

## Setup

    # copy .env.sample 
    cp .env.sample .env

    # install dependencies
    npm install

    # start dev
    npm run dev

## Edit routes

Note: most response may contain the `changes` property. It indicates if the update/insert was successful.

### Add/Update quiz

#### Add quiz

POST /api/edit/quiz

    # request and body 
    POST http://localhost:3000/api/edit/quiz
    Content-Type: application/json
    {
      "title": "Quiz 2",
      "questions": 5
    }

    # response
    {
      "title": "Quiz 2",
      "questions": 5,
      "lastID": 1,
      "changes": 1
    }

#### Update quiz

PUT /api/edit/quiz/:quiz_id

    # request and body
    PUT http://localhost:3000/api/edit/quiz/1
    Content-Type: application/json
    {
      "title": "Quiz 1 v2",
      "questions": 8
    }

    # response
    {
      "quiz_id": "1",
      "title": "Quiz 1 v2",
      "questions": 8,
      "changes": 1
    }

#### Publish quiz

PUT /api/edit/quiz/publish/:quiz_id

    # request
    PUT http://localhost:3000/api/edit/quiz/publish/1

    # response
    {
      "quiz_id": "1",
      "changes": 1
    }

#### Add question

POST /api/edit/quiz/:quiz_id/question

    # request and body
    PUT http://localhost:3000/api/edit/quiz/1/question
    Content-Type: application/json
    {
      "question": "Question 1",
      "choices": 5,
      // type: Refer to question_type table in database
      "type": 1
    }

    # response
    {
      "quiz_id": "1",
      "question": "Question 1",
      "choices": 5,
      "type": 1,
      "lastID": 1,
      "changes": 1
    }

#### Update question

PUT /api/edit/quiz/:quiz_id/question/:question_id

    # request and body
    PUT http://localhost:3000/api/edit/quiz/1/question/1
    Content-Type: application/json
    {
      "question": "Question 1",
      "choices": 5,
      // type: Refer to question_type table in database
      "type": 1
    }

    # response
    {
      "quiz_id": "1",
      "question_id": "1",
      "question": "Question 1",
      "choices": 5,
      "type": 1,
      "changes": 1
    }

#### Add choice

POST /api/edit/quiz/:quiz_id/question/:question_id/choice

    # request and body
    PUT http://localhost:3000/api/edit/quiz/1/question/1/choice
    Content-Type: application/json
    {
      "text": "Choice 1",
      "is_correct": 1
    }

    # response
    {
      "quiz_id": "1",
      "question_id": "1",
      "text": "Choice 1",
      "is_correct": 1,
      "lastID": 1,
      "changes": 1
    }

#### Update choice

POST /api/edit/quiz/:quiz_id/question/:question_id/choice/:choice_id

    # request and body
    PUT http://localhost:3000/api/edit/quiz/1/question/1/choice/1
    Content-Type: application/json
    {
      "text": "Choice 1",
      "is_correct": 1
    }

    # response
    {
      "quiz_id": "1",
      "question_id": "1",
      "choice_id": 1,
      "text": "Choice 1",
      "is_correct": 1,
      "changes": 1
    }

## Dev

Sample/Test request can be found at `./rest` folder and can be checked via [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension. Also note that named requests or requests with `// @name requestName` should be run first (in order) before running the remaining requests.