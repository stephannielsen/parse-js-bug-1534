  const axios = require('axios');
(async () => {
  let headers = {
    'X-Parse-Application-Id': 'ParseTest',
    'Content-Type': 'application/json',
  };

  const userId = await axios({
    method: 'POST',
    headers,
    url: `http://localhost:1337/parse/functions/setupTestData`,
  })

  headers = {
    'X-Parse-Application-Id': 'ParseTest',
    'Authorization': 'Use abcd',
    'Content-Type': 'application/json',
  };

  const response = await axios({
    method: 'POST',
    headers,
    url: `http://localhost:1337/parse/functions/testRelation`,
  })
  console.log(response.data.result);
})();
