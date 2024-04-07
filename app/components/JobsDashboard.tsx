
import React from 'react';
import { JobData } from './types'; // Adjust the path as necessary

interface JobsDashboardProps {
  jobsData: JobData[];
}

const JobsDashboard: React.FC<JobsDashboardProps> = ({ jobsData }) => {
  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobsData.map((job) => (
          <li key={job.id}>
            <a href={job.link} target="_blank" rel="noopener noreferrer">{job.title}</a> at {job.company} in {job.location}
            <p>{job.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobsDashboard;
