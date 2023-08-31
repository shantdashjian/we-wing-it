import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const chatbotConversation = document.getElementById('chatbot-conversation')

let conversationStr = ''

document.addEventListener('submit', (e) => {
  e.preventDefault()
  const userInput = document.getElementById('user-input')
  conversationStr += ` ${userInput.value} ->`
  fetchReply()
  const newSpeechBubble = document.createElement('div')
  newSpeechBubble.classList.add('speech', 'speech-human')
  chatbotConversation.appendChild(newSpeechBubble)
  newSpeechBubble.textContent = userInput.value
  userInput.value = ''
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})

async function fetchReply() {
  const url = 'https://we-wing-it.netlify.app/.netlify/functions/fetchAI'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'text/plain'
    },
    body: conversationStr
  })
  const data = await response.json()
  console.log(data)
  /*
  Challenge:
    1. Make a fetch request to the url using the 
       following details. 
       - The method should be 'POST'
       - In the headers, the 'content-type' should 
         be 'text/plain'
       - The body should hold conversationStr
    2. Save the response to a const and log it out. 
    3. Copy and paste the updated fetchReply function 
       to VS Code and delete any unnecessary code from 
       index.js
    4. Push the changes to GitHub to trigger a
       redeploy.
    5. Navigate to your Netlify site, hit send 
       and see what you get in the console. (You 
       should see "Hello World" in an object).
  */
  // const response = await openai.createCompletion({
  //   model: 'davinci:ft-personal-2023-08-30-17-43-54',
  //   prompt: conversationStr,
  //   presence_penalty: 0,
  //   frequency_penalty: 0.3,
  //   max_tokens: 100,
  //   temperature: 0,
  //   stop: ['\n', '->']
  // })
  // conversationStr += ` ${response.data.choices[0].text} \n`
  // renderTypewriterText(response.data.choices[0].text)
}

function renderTypewriterText(text) {
  const newSpeechBubble = document.createElement('div')
  newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
  chatbotConversation.appendChild(newSpeechBubble)
  let i = 0
  const interval = setInterval(() => {
    newSpeechBubble.textContent += text.slice(i - 1, i)
    if (text.length === i) {
      clearInterval(interval)
      newSpeechBubble.classList.remove('blinking-cursor')
    }
    i++
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
  }, 50)
}