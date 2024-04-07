import React, { useEffect, useState } from 'react';
import styles from '../styles/ResumeWorth.module.css';

interface ResumeWorthProps {
  resumeWorth: string;
  setLocation: (location: string) => void;
  showJobTitleSection: boolean;
  setShowJobTitleSection: (value: boolean) => void;
}

const ResumeWorth: React.FC<ResumeWorthProps> = ({ resumeWorth, setLocation, showJobTitleSection, setShowJobTitleSection }) => {
  const completion = JSON.parse(resumeWorth.toString());
  console.log(completion)
  // Extract the estimated worth, explanation, and improvements from the analysis result
  const estimatedWorthMatch = completion.estimatedWorth.value;
  const explanation = completion.estimatedWorth.explanation.critiques;
  // Corrected from "postives" to "positives"
  const improvements = completion.estimatedWorth.explanation.positives;
  const estimatedWorth = estimatedWorthMatch ? estimatedWorthMatch : 'N/A'; // Simplified this line


  const [showNextSection, setShowNextSection] = useState(false); // 

  useEffect(() => {
    setLocation(completion.location)
  }, [completion.location, setLocation]);

  return (
    <div className={styles.container}>
      <div className={styles.worth}>{estimatedWorth}</div>
      <h2 className={styles.subtitle}>Resume worth</h2>
      <p>{completion.estimatedWorth.explanation.explanation}</p>

      {!showNextSection && (
        <button onClick={() => setShowNextSection(true)} className={styles.nextButton}>
          Next bullets points
        </button>
      )}

      {showNextSection && (
        <>
        <div className={styles.content}>
          <div className={styles.column}>
            {Array.isArray(improvements) && (
              <ul className={styles.list}>
                {improvements.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.column}>
            {Array.isArray(explanation) && (
              <ul className={styles.list}>
                {explanation.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          </div>
          {!showJobTitleSection && (
            <button onClick={() => setShowJobTitleSection(true)} className={styles.nextButton} >
              Next Job Titles
            </button>
          )}
        </>
      )}

    </div>
  );
};

export default ResumeWorth;
