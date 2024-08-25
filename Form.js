import React, { useState } from 'react';

function Form() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    // Validate JSON input
    try {
      const parsedInput = JSON.parse(jsonInput);

      if (!parsedInput.data) {
        throw new Error('Invalid JSON structure');
      }

      // Send POST request to backend
      const res = await fetch('http://127.0.0.1:5000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError('Invalid JSON input');
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(
      selectedOptions.includes(value)
        ? selectedOptions.filter((opt) => opt !== value)
        : [...selectedOptions, value]
    );
  };

  return (
    <div>
      <h1>Enter JSON</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data": ["A", "b", "2", "3"]}'
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div>
          <h2>Select Options</h2>
          <label>
            <input
              type="checkbox"
              value="alphabets"
              onChange={handleOptionChange}
            /> Alphabets
          </label>
          <label>
            <input
              type="checkbox"
              value="numbers"
              onChange={handleOptionChange}
            /> Numbers
          </label>
          <label>
            <input
              type="checkbox"
              value="highest_lowercase_alphabet"
              onChange={handleOptionChange}
            /> Highest Lowercase Alphabet
          </label>

          <h2>Response</h2>
          <pre>
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(response).filter(([key]) =>
                  selectedOptions.includes(key)
                )
              ),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Form;
