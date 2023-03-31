const codeMirrorOptions = {
    lineNumbers: true, // Enable line numbers
    lineWrapping: true, // Enable line wrapping
    mode: 'markdown', // Set the mode to plain text
    value: "# Example \n\nThis is some example text with a few errors that Vale + Microsoft package would pick up.\n\nThe passive voice should not be used. Also should not should be shouldn't.\n\nThis is a very simple error for using 'very'. And punctuation should be inside quotes.\n\nSelect the Lint Text button to see a list of errors. :)"
  };
  
const textInput = CodeMirror(document.getElementById('text-input'), codeMirrorOptions);

document.getElementById('lint-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = textInput.getValue();
    const option = document.getElementById('lint-options').value;
    
    const response = await fetch('/lint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, option }),
    });

    const lintOutput = await response.json();
    const lintResultsElement = document.getElementById('lint-results').querySelector('tbody');
    lintResultsElement.innerHTML = '';

    if(Object.keys(lintOutput).length === 0) {
      const errorRow = document.createElement('tr');
      const noErrorsCell = document.createElement('td');

      noErrorsCell.textContent = 'No errors found!';
      noErrorsCell.colSpan = 4;
      noErrorsCell.style.textAlign = 'center';

      errorRow.append(noErrorsCell);
      lintResultsElement.append(errorRow);
    } else {
      Object.values(lintOutput).forEach((fileErrors) => {
        fileErrors.forEach((error) => {
            const tableRow = document.createElement('tr');
  
            const lineCell = document.createElement('td');
            lineCell.textContent = error.Line;
            tableRow.appendChild(lineCell);
  
            const messageCell = document.createElement('td');
            messageCell.textContent = error.Message;
            tableRow.appendChild(messageCell);
  
            const severityCell = document.createElement('td');
            severityCell.textContent = error.Severity;
            tableRow.appendChild(severityCell);
  
            const checkCell = document.createElement('td');
            checkCell.textContent = error.Check;
            tableRow.appendChild(checkCell);
  
            lintResultsElement.appendChild(tableRow);
        });
      });
    }
  });
  