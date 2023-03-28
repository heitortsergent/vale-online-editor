document.getElementById('lint-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = document.getElementById('text-input').value;
    const option = document.getElementById('lint-options').value;
    
    const response = await fetch('/lint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, option }),
    });
  
    const lintErrors = await response.json();
    console.log('lintErrors:');
    console.log(lintErrors);
    const lintResultsElement = document.getElementById('lint-results');
    lintResultsElement.innerHTML = '';
  
    if(Array.isArray(lintErrors)) {
        lintErrors.forEach((error) => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            lintResultsElement.appendChild(listItem);
          });
    }
  });
  