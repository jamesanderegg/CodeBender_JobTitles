import type { NextApiRequest, NextApiResponse } from 'next';

interface JobListing {
  JobTitle: string;
  MinimumAmount: string;
  MaximumAmount: string;
  Location: string;
  DatePosted: string;
  PositionStartDate: string;
  PositionEndDate: string;
  ApplicationCloseDate: string;
  OrganizationName: string;
  DepartmentName: string;
  PositionURI: string;
  QualificationSummary: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<JobListing[] | { message: string }>) {
  const keywords = typeof req.query.jobTitle === 'string' ? req.query.jobTitle : '';
  const location = `${typeof req.query.city === 'string' ? req.query.city : ''}, ${typeof req.query.state === 'string' ? req.query.state : ''}`;
  
  const url = "https://jooble.org/api/";
  const key = process.env.JOOBLE_API_KEY; // Ensure your API key is stored in your environment variables
  const params = JSON.stringify({
    keywords: keywords,
    location: location
  });

  try {
    const apiResponse = await fetch(url + key, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: params,
    });

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch job listings: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    // Transform the data from Jooble into the format expected by your application
    // Note: You will need to adjust the mappings based on Jooble's actual response structure,
    // as this example assumes a similar structure to USAJobs for demonstration purposes.
    const jobListings: JobListing[] = data.jobs.map((job: any) => ({
      JobTitle: job.title,
      MinimumAmount: '', // Jooble might not provide this information
      MaximumAmount: '', // Jooble might not provide this information
      Location: job.location,
      DatePosted: job.datePosted,
      PositionStartDate: '', // Jooble might not provide this information
      PositionEndDate: '', // Jooble might not provide this information
      ApplicationCloseDate: '', // Jooble might not provide this information
      OrganizationName: job.company,
      DepartmentName: '', // Jooble might not provide this information
      PositionURI: job.link,
      QualificationSummary: '', // Jooble might not provide this information
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching job listings from Jooble' });
  }
}
