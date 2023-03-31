const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const pathModule = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/lint", (req, res) => {
  const { text, option } = req.body;

  // Save text to a temporary file and run the Vale CLI tool
  const fs = require("fs");
  const tmp = require("tmp");

  // Create a temporary file to store the text
  tmp.file({ postfix: ".txt" }, (err, path, fd, cleanup) => {
    if (err) {
        console.error(`error creating file: ${err}`);
      res.status(500).json({ error: "Failed to create a temporary file." });
      return;
    }

    // Write the text to the temporary file
    fs.writeFile(path, text, (err) => {
      if (err) {
        res
          .status(500)
          .json({ error: "Failed to write to the temporary file." });
        return;
      }

      // Run the Vale CLI tool on the temporary file
      const valeConfigPath = pathModule.resolve(__dirname, "vale-config-files/.vale-" + option + ".ini");
      const valeCmd = `vale --output JSON --config '${valeConfigPath}' ${path}`;
      exec(valeCmd, {maxBuffer: 1024 * 1024 * 10}, (err, stdout, stderr) => {
        // Clean up the temporary file
        cleanup();

        if (err && Object.keys(stdout).length === 0) {
          res.status(500).json({ error: "Failed to run the Vale CLI tool." });
          return;
        }

        // Parse the output from the Vale CLI tool and send it as a response
        let lintErrors;
        try {
          lintErrors = JSON.parse(stdout);
        } catch (e) {
          res
            .status(500)
            .json({ error: "Failed to parse the Vale CLI output." });
          return;
        }

        res.json(lintErrors);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
