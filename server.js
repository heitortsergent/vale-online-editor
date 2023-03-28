const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/lint', (req, res) => {
  const { text, option } = req.body;

  // Save text to a temporary file and run the Vale CLI tool
  const fs = require('fs');
  const tmp = require('tmp');

  // Create a temporary file to store the text
  tmp.file({ postfix: '.txt' }, (err, path, fd, cleanup) => {
    if (err) {
      res.status(500).json({ error: 'Failed to create a temporary file.' });
      return;
    }

    // Write the text to the temporary file
    fs.writeFile(path, text, (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to write to the temporary file.' });
        return;
      }

      // Run the Vale CLI tool on the temporary file
    //   const valeCmd = `vale --output JSON --config ${option} ${path}`;
      const valeCmd = `vale --output JSON ${path}`;
      console.log('valeCmd: ' + valeCmd);
      exec(valeCmd, (err, stdout, stderr) => {
        // Clean up the temporary file
        cleanup();

        if (err) {
          res.status(500).json({ error: 'Failed to run the Vale CLI tool.' });
          return;
        }

        // Parse the output from the Vale CLI tool and send it as a response
        let lintErrors;
        try {
          const lintOutput = JSON.parse(stdout);
          console.log('lintOutput: ' + stdout);
          lintErrors = Object.values(lintOutput).flatMap((fileErrors) => fileErrors.map((error) => error.Message));
        } catch (e) {
          res.status(500).json({ error: 'Failed to parse the Vale CLI output.' });
          return;
        }

        // console.log('server.js lintErrors');
        // console.log(lintErrors);
        res.json(Array.isArray(lintErrors) ? lintErrors : []);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
