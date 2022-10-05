const axios = require('axios');
(async () => {
  let headers = {
    'X-Parse-Application-Id': 'ParseTest',
    'Content-Type': 'application/json',
  };

  const setupResponse = await axios({
    method: 'POST',
    headers,
    url: `http://localhost:1337/parse/functions/setupTestData`,
  });

  const user = setupResponse.data.result;
  console.log(JSON.stringify(user));

  headers = {
    'X-Parse-Application-Id': 'ParseTest',
    'Authorization': `${user.objectId}`,
    'Content-Type': 'application/json',
  };

  const response = await axios({
    method: 'POST',
    headers,
    url: `http://localhost:1337/parse/functions/testRelation`,
  })
  console.log(response.data.result);
})();
