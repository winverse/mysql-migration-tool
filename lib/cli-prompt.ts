import readline from 'readline';

function cliPrompt(question: string): Promise<string> {
  const rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(question);
  rl.prompt();

  return new Promise((resolve, reject) => {
    let databaseName: string = ''
    rl.on('line', (line:string) => {
      databaseName = line;
      rl.close();
    })

    rl.on('close', () => {
      if (!databaseName) {
        reject('Needs database name');
      }
      resolve(databaseName);
    })
  })
}

export default cliPrompt;