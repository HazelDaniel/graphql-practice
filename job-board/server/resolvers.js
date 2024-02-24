const db = require("./db");
const Query = {
  jobs: async () => {
    return db.jobs.list();
  },
  job: async (_, args) => {
    return db.jobs.get(args.id);
  },
  company: async (_, args) => {
    return db.companies.get(args.id);
  },
};

const Mutation = {
  createJob: (_, { input }, context) => {
    if (!context.user) {
      throw new Error("Unauthorized");
    }
    const jobId = db.jobs.create({
      ...input,
      companyId: context.user.companyId,
    });
    return db.jobs.get(jobId);
  },
};

const Job = {
  company: async (job) => {
    return db.companies.get(job.companyId);
  },
};

const Company = {
  jobs: async (company) => {
    return db.jobs.list().filter((job) => job.companyId === company.id);
  },
};

module.exports = { Query, Job, Company, Mutation };
