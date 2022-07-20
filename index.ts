import readline from 'readline';
import { User } from './User';
const std = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readUserInput = (user:User) =>{
  std.question('', (text) =>{
    console.log(text);
    if(text == 'exit') {
      std.close();
      return;
    }

    user.broadcastMessage(text);

    readUserInput(user);
  })
}

std.question(`Welcome to PubSub chat! \nWhat's your name? `, async (name) => {
  console.log(`Hi ${name}!`);

  const user = new User(name);
  await user.setupStreams()

  //reading user input recursive loop
  readUserInput(user)
});

