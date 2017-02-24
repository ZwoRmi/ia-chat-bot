#ia-chat-bot

ChatBot for slack developed for INSTA.

## Installation

1. Clone this project
2. Add a chatbot to your slack team and get your api token
3. Add your slack api token to your environment variables
4. run `npm install --production`

## Running the project

Run `npm start`

##Usage

Simply chat with the chatbot, he will learn from what you say to him. 
When he gives you a good/bad message, add a reaction :+1:/:-1: on this response.

If you want to give him a new response for a message, tell him : `expectedAnswer: <The message you want him to remember>`

## Dependencies

- [slackbots](https://www.npmjs.com/package/slackbots) To interact with [slack](https://slack.com/)
- [CircularJson](https://www.npmjs.com/package/circular-json) To store data in a file when there are circular references

## Contributors
- Nassim Rebouh
- Patrick Bukowski
- Dany Patient
- Lucas Lemaire
