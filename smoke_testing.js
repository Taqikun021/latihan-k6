import http from "k6/http";
import { check, sleep } from "k6";

const API_URL = "https://gorest.co.in/public-api";
const API_TOKEN = "8bbd8edfeabb9cd387a28b356bde48d92778dde548e7da74db89ab9971957f08";

export let options = {
  vus: 10,
  duration: '30s'
};

export default function () {

  const params = { headers: { "Authorization": `Bearer ${API_TOKEN}` } };
  let randomInt = Math.floor(Math.random() * 1000000);

  let createUserResponse = http.post(
      `${API_URL}/users`,
      {
        "name": "John Doe",
        "gender": "Male",
        "email": `john.doe+${randomInt}@tsh.io`,
        "status": "Active"
      },
      params
  );
  check(
      createUserResponse,
      { "Create user response status code is 200": (r) => r.status == 200 }
  );

  let getUserResponse = http.get(
      `${API_URL}/users/${JSON.parse(createUserResponse.body).data.id}`,
      params
  )
  check(
      getUserResponse,
      { "Get user response status code is 200": (r) => r.status == 200 }
  );

  let patchUserResponse = http.patch(
      `${API_URL}/users/${JSON.parse(createUserResponse.body).data.id}`,
      {
        "gender": "Female"
      },
      params
  )
  check(
      patchUserResponse,
      { "Update user response status code is 200": (r) => r.status == 200 }
  );

  let deleteUserResponse = http.del(
      `${API_URL}/users/${JSON.parse(createUserResponse.body).data.id}`,
      params
  )
  check(
      deleteUserResponse,
      { "Delete user response status code is 200": (r) => r.status == 200 }
  );

  sleep(0.5);
}