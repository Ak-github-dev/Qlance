#pragma once
#include "qpi.h"

using namespace QPI;

enum JobStatus : unsigned char {
    OPEN = 0,
    CLAIMED = 1,
    SUBMITTED = 2,
    APPROVED = 3,
    REJECTED = 4
};

struct Job {
    unsigned long long jobId;
    unsigned long long priceInQubic;
    id clientAddress;
    id workerAddress;
    JobStatus status;
    unsigned int createdAt;
};

struct Qlance : public ContractBase
{
public:
    enum {
        REGISTER_USER_FUNCTIONS_AND_PROCEDURES
    };

protected:
    unsigned long long jobCounter;
    Job jobs[1000];
    unsigned long long totalJobsCompleted;

public:
    // ---------------- GetJobsCount ----------------
    struct GetJobsCount_input {};
    struct GetJobsCount_output {
        unsigned long long count;
    };

    PUBLIC_FUNCTION(GetJobsCount)
    {
        output.count = state.jobCounter;
    }

    // ---------------- GetJob ----------------
    struct GetJob_input {
        unsigned long long jobId;
    };

    struct GetJob_output {
        unsigned long long jobId;
        unsigned long long price;
        unsigned char status;
    };

    PUBLIC_FUNCTION(GetJob)
    {
        if (input.jobId >= state.jobCounter) {
            output.jobId = 0;
            return;
        }

        Job job = state.jobs[input.jobId];
        output.jobId = job.jobId;
        output.price = job.priceInQubic;
        output.status = (unsigned char)job.status;
    }

    // ---------------- PostJob ----------------
    struct PostJob_input {
        unsigned long long priceInQubic;
    };

    struct PostJob_output {
        unsigned long long jobId;
    };

    PUBLIC_PROCEDURE(PostJob)
    {
        if (state.jobCounter >= 1000) {
            output.jobId = 0;
            return;
        }

        unsigned long long jobId = state.jobCounter;

        Job job;
        job.jobId = jobId;
        job.priceInQubic = input.priceInQubic;
        job.clientAddress = qpi.invocator();
        job.workerAddress = NULL_ID;
        job.status = OPEN;
        job.createdAt = 0;

        state.jobs[jobId] = job;
        state.jobCounter++;

        output.jobId = jobId;
    }

    // ---------------- ClaimJob ----------------
    struct ClaimJob_input {
        unsigned long long jobId;
    };

    struct ClaimJob_output {
        unsigned char status;
    };

    PUBLIC_PROCEDURE(ClaimJob)
    {
        if (input.jobId >= state.jobCounter) {
            output.status = 1;
            return;
        }

        Job job = state.jobs[input.jobId];

        if (job.status != OPEN) {
            output.status = 1;
            return;
        }

        job.status = CLAIMED;
        job.workerAddress = qpi.invocator();
        state.jobs[input.jobId] = job;

        output.status = 0;
    }

    // ---------------- SubmitWork ----------------
    struct SubmitWork_input {
        unsigned long long jobId;
    };

    struct SubmitWork_output {
        unsigned char status;
    };

    PUBLIC_PROCEDURE(SubmitWork)
    {
        if (input.jobId >= state.jobCounter) {
            output.status = 1;
            return;
        }

        Job job = state.jobs[input.jobId];

        if (job.status != CLAIMED || qpi.invocator() != job.workerAddress) {
            output.status = 1;
            return;
        }

        job.status = SUBMITTED;
        state.jobs[input.jobId] = job;

        output.status = 0;
    }

    // ---------------- ApproveWork ----------------
    struct ApproveWork_input {
        unsigned long long jobId;
    };

    struct ApproveWork_output {
        unsigned char status;
    };

    PUBLIC_PROCEDURE(ApproveWork)
    {
        if (input.jobId >= state.jobCounter) {
            output.status = 1;
            return;
        }

        Job job = state.jobs[input.jobId];

        if (job.status != SUBMITTED || qpi.invocator() != job.clientAddress) {
            output.status = 1;
            return;
        }

        job.status = APPROVED;
        state.jobs[input.jobId] = job;
        state.totalJobsCompleted++;

        output.status = 0;
    }

    // ---------------- RejectWork ----------------
    struct RejectWork_input {
        unsigned long long jobId;
    };

    struct RejectWork_output {
        unsigned char status;
    };

    PUBLIC_PROCEDURE(RejectWork)
    {
        if (input.jobId >= state.jobCounter) {
            output.status = 1;
            return;
        }

        Job job = state.jobs[input.jobId];

        if (job.status != SUBMITTED || qpi.invocator() != job.clientAddress) {
            output.status = 1;
            return;
        }

        job.status = REJECTED;
        state.jobs[input.jobId] = job;

        output.status = 0;
    }

    // ---------------- Registration ----------------
    REGISTER_USER_FUNCTIONS_AND_PROCEDURES()
    {
        REGISTER_USER_FUNCTION(GetJobsCount, 1);
        REGISTER_USER_FUNCTION(GetJob, 2);

        REGISTER_USER_PROCEDURE(PostJob, 1);
        REGISTER_USER_PROCEDURE(ClaimJob, 2);
        REGISTER_USER_PROCEDURE(SubmitWork, 3);
        REGISTER_USER_PROCEDURE(ApproveWork, 4);
        REGISTER_USER_PROCEDURE(RejectWork, 5);
    }
};
