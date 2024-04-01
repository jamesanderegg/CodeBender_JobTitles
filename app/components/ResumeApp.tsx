import React, { useEffect, useState } from 'react';
import ResumeUploader from './ResumeUploader';
import ResumeWorth from './ResumeWorth';
import ResumeTitles from './ResumeTitles';
import { useCompletion } from 'ai/react';

const ResumeApp = () => {
    const [showWorth, setShowWorth] = useState(false);
    const [isLoadingResume, setIsLoadingResume] = useState(false);
    const [resumeText, setResumeText] = useState<string>('');

    const { completion, isLoading, complete, error } = useCompletion({
        api: '/api/openai-resume',
      });

      
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
        <ResumeWorth resumeWorth={completion} />
        <ResumeTitles resumeTitles={completion} />
        </>
      )}
      {error && <p>{error.message}</p>}
     
        </>
    )
}
export default ResumeApp;