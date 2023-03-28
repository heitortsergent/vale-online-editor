const codeMirrorOptions = {
    lineNumbers: true, // Enable line numbers
    lineWrapping: true, // Enable line wrapping
    mode: 'text/plain', // Set the mode to plain text
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
      // const noErrorsMessage = document.createElement('p');
      // noErrorsMessage.textContent = 'No errors found!';
      // lintResultsElement.appendChild(noErrorsMessage);

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
  