import React, { useState } from 'react';
import styles from '../styles/ResumeTitles.module.css';
import { JobData } from './types'; // Adjust the path as necessary

interface ResumeTitlesProps {
  resumeTitles: string;
  location: string; // Assuming this is a string like "City, State"
  setJobsData: (jobs: JobData[]) => void;
}


const ResumeTitles: React.FC<ResumeTitlesProps> = ({ resumeTitles, location, setJobsData }) => {
  const json = JSON.parse(resumeTitles.toString());
  const initialJobTitles = json.jobTitles;
  const [jobTitles] = useState(initialJobTitles);
  const [selectedTitles, setSelectedTitles] = useState<Set<string>>(new Set()); // Tracks clicked titles
  

  // Split location into city and state
  const [city, state] = location.split(',').map((part) => part.trim());

  // Handler for sending the selected job title and location to the API
  const sendToApi = async (jobTitle: string) => {
    
    // try {
    //   const response = await fetch(`/api/usajobs/search?city=${encodeURIComponent("Denver")}&state=${encodeURIComponent(state)}&jobTitle=${encodeURIComponent(jobTitle)}&Radius=75`, {
    //     method: 'GET',
    //   });
  
    //   if (!response.ok) {
    //     throw new Error(`API request failed with status ${response.status} ${response.statusText}`);
    //   }
  
    //   const contentType = response.headers.get('content-type');
    //   if (!contentType || !contentType.includes('application/json')) {
    //     throw new TypeError("Oops, we haven't got JSON!");
    //   }
  
    //   const data = await response.json();
    //   console.log(data)
    //   setJobsData(data); // Accumulate jobs data
    // } catch (error) {
    //   console.error('Failed to fetch from API', error);
    // }


    try {
      const response = await fetch(`/api/jooble/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&jobTitle=${encodeURIComponent(jobTitle)}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch job listings');
      }
  
      const jobListings = await response.json();
      setJobsData(jobListings.jobs);
      console.log(jobListings.jobs); // Do something with the job listings, e.g., update state or props
    } catch (error) {
      console.error("Error fetching job listings:", error);
      // Handle the error appropriately in your UI
    }
  };
  
  // Updated click handler
  const handleJobTitleClick = (item: string) => {
    // Convert Set to Array to check if item is included, because we're targeting ES5
    if (Array.from(selectedTitles).includes(item)) {
      // Job title has already been clicked, don't fetch again
      return;
    }
  
    // Add the new title to the Set by first converting the Set to an array, adding the item, and converting back
    const updatedTitles = new Set(Array.from(selectedTitles).concat(item));
    setSelectedTitles(updatedTitles);
    sendToApi(item); // Perform the API call
  };
  

  return (
    <div className={styles.container}>
      <p className={styles.subtitle}>Click a job title to search. Clicked titles won't be searched again.</p>
      {Array.isArray(jobTitles) && (
        <div className={styles.grid}>
          {jobTitles.map((item, index) => (
            <button
              key={index}
              className={`${styles.gridItem} ${selectedTitles.has(item) ? styles.selected : ''}`}
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
