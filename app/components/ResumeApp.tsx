import React, { useEffect, useState } from 'react';
import ResumeUploader from './ResumeUploader';
import ResumeWorth from './ResumeWorth';
import ResumeTitles from './ResumeTitles';
import JobsDashboard from './JobsDashboard';
import { useCompletion } from 'ai/react';
import { JobData } from './types'; // Adjust the path as necessary
import styles from '../styles/Home.module.css';

const ResumeApp = () => {
    const [showWorth, setShowWorth] = useState(false);
    const [isLoadingResume, setIsLoadingResume] = useState(false);
    const [resumeText, setResumeText] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [jobsData, setJobsData] = useState<JobData[]>([]); 
    const { completion, isLoading, complete, error } = useCompletion({
        api: '/api/openai-resume',
      });

      // Function to add new job data to the existing state
const addJobsData = (newData: JobData[]) => {
  setJobsData((prevData) => [...prevData, ...newData]);
  console.log(jobsData)
};
    useEffect(() => {
        const getResumeWorth = async (text: string) => {
          const messageToSend = `RESUME: ${text}\n\n-------\n\n`;
          // console.log("Sending message:", messageToSend);
          await 
          complete(messageToSend);
          setShowWorth(true);
          setIsLoadingResume(false);

          
        };
    
        if (resumeText !== '') {
          getResumeWorth(resumeText).then();
        }
      }, [resumeText]);
   
      
    return(
        <>
        
        {!showWorth ? (
        <div >
          <p>Upload your resume to know your worth.</p>
          <ResumeUploader setIsLoading={setIsLoadingResume} setResumeText={setResumeText} />
          {(isLoadingResume || isLoading) && 
            <div>
              <div>Loading!!!</div>
            </div>}
        </div>
      ) : (
     <>
        <ResumeWorth resumeWorth={completion} setLocation={setLocation} />
        <p>{location}</p>
        <ResumeTitles resumeTitles={completion} location={location} setJobsData={addJobsData} />
        </>
      )}
      {error && <p>{error.message}</p>}
      {jobsData.length > 0 && <JobsDashboard jobsData={jobsData} />}
        </>
    )
}
export default ResumeApp;