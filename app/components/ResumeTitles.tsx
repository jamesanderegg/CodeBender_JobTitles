import React, { useState } from 'react';
import styles from '../styles/ResumeTitles.module.css';

interface ResumeTitlesProps {
  resumeTitles: string;
}

const ResumeTitles: React.FC<ResumeTitlesProps> = ({ resumeTitles }) => {
  const json = JSON.parse(resumeTitles.toString());
  const initialJobTitles = json.jobTitles;
  const [jobTitles] = useState(initialJobTitles); // Assuming jobTitles don't change, no setter needed
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null); // To keep track of the selected job title

  // Handler for click event
  const handleJobTitleClick = (item: string) => {
    setSelectedTitle(item);
    // You can also perform the API call here or use the selected item for other actions
    console.log(`Selected job title: ${item}`);
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
