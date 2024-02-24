import {getAccessToken, isLoggedIn} from "./auth";

export const endpointURL = `http://localhost:9000/graphql`;

async function loadResource(query, variables = undefined) {
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variables && { ...variables },
    }),
  }

  if (isLoggedIn()) {
    request.headers['authorization'] = `Bearer ${getAccessToken()}`;
  }

  const response = await fetch(endpointURL, request);

  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors.map((el) => el.message).join("\n");
    throw new Error(message);
  }
  return responseBody.data;
}

export async function loadJob(id) {
  const query = `
      query jobQuery($id: ID!) {
        job(id: $id) {
          title
          description
          company {
            id
            name
          }
        }
      }`;

  try {
    const { job } = await loadResource(query, { id });
    return job;
  } catch (err) {
    alert(err.message);
    return null;
  }
}

export async function loadJobs() {
  const query = `{
        jobs {
          id
          title
          company {
            id
            name
          }
        }
      }
      `;
  try {
    const { jobs } = await loadResource(query);
    return jobs;
  } catch (err) {
    alert(err.message);
    return null;
  }
}

export async function loadCompany(id) {
  const query = `
      query companyQuery($id: ID!) {
        company(id: $id) {
          id
          name
          description
          jobs {
            id
            title
          }
        }
      }`;

  try {
    const { company } = await loadResource(query, { id });
    return company;
  } catch (err) {
    alert(err.message);
    return null;
  }
}

export async function createJob(input) {
  const mutation = `
  mutation postJob ($input: createJobInput ) {
    job: createJob(input: $input) {
      id
      company {
        id
        description
        name
      }
  
    }
  }
  `;
  const variables = {input};
  const {job} = await loadResource(mutation, variables);
  return job;
}
