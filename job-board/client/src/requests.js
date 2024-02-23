export const endpointURL = `http://localhost:9000/graphql`;

export async function loadJob(id) {
  const response = await fetch(endpointURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
      query jobQuery($id: ID!) {
        job(id: $id) {
          title
          description
          company {
            id
            name
          }
        }
      }`,
      variables: {id}
    }),
  });

  const responseBody = await response.json();
  return responseBody.data.job;
}

export async function loadJobs() {
  const response = await fetch(endpointURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{
        jobs {
          id
          title
          company {
            id
            name
          }
        }
      }
      `,
    }),
  });

  const responseBody = await response.json();
  return responseBody.data.jobs;
}
