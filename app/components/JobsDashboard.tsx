
import React from 'react';
import { JobData } from './types'; // Adjust the path as necessary
import styles from '../styles/JobsDashboard.module.css'
interface JobsDashboardProps {
  jobsData: JobData[];
}

const JobsDashboard: React.FC<JobsDashboardProps> = ({ jobsData }) => {
  return (
    <div>
      <h2>Job Listings</h2>
      <table className={styles.dashboard}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {jobsData.map((job) => (
            <tr key={job.id}>
              <td>
                <a href={job.link} target="_blank" rel="noopener noreferrer">{job.title}</a>
              </td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td dangerouslySetInnerHTML={{ __html: job.snippet }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsDashboard;
