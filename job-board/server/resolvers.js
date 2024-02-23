const db = require("./db");
const Query = {
  jobs: async () => {
    return db.jobs.list();
  },
  job: async (_, args) => {
    return db.jobs.get(args.id);
  }
};

const Job = {
  company: async (job) => {
    return db.companies.get(job.companyId);
  }
}

module.exports = { Query, Job };
