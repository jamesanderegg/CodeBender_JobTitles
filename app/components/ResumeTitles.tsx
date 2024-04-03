import React, { useState } from 'react';
import styles from '../styles/ResumeTitles.module.css';

interface ResumeTitlesProps {
  resumeTitles: string;
  location: string; // Assuming this is a string like "City, State"
}

const ResumeTitles: React.FC<ResumeTitlesProps> = ({ resumeTitles, location }) => {
  const json = JSON.parse(resumeTitles.toString());
  const initialJobTitles = json.jobTitles;
  const [jobTitles] = useState(initialJobTitles);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  // Split location into city and state
  const [city, state] = location.split(',').map((part) => part.trim());
  console.log(location)
  // Handler for sending the selected job title and location to the API
  const sendToApi = async (jobTitle: string) => {
    try {
      const response = await fetch(`/api/usajobs/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&jobTitle=${encodeURIComponent(jobTitle)}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status} ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch from API', error);
    }
  };

  // Updated click handler
  const handleJobTitleClick = (item: string) => {
    setSelectedTitle(item);
    sendToApi(item); // Perform the API call
  };

  return (
    <div className={styles.container}>
      <p className={styles.subtitle}>Click a job title to search.</p>
      {Array.isArray(jobTitles) && (
        <div className={styles.grid}>
          {jobTitles.map((item, index) => (
            <button
              key={index}
              className={`${styles.gridItem} ${item === selectedTitle ? styles.selected : ''}`}
              onClick={() => handleJobTitleClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeTitles;
