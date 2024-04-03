import type { NextApiRequest, NextApiResponse } from 'next';

interface JobListing {
  JobTitle: string;
  // Add other fields as needed
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const positionTitle = typeof req.query.jobTitle === 'string' ? req.query.jobTitle : '';
  const locationName = `${typeof req.query.city === 'string' ? req.query.city : ''}, ${typeof req.query.state === 'string' ? req.query.state : ''}`;
  const datePosted = '60'; // Last 60 days

  const apiUrl = `https://data.usajobs.gov/api/Search?PositionTitle=${encodeURIComponent(positionTitle)}&LocationName=${encodeURIComponent(locationName)}&DatePosted=${datePosted}`;
  console.log(apiUrl)
  const headers: Record<string, string> = {
    'Host': 'data.usajobs.gov',
  };

  if (process.env.USAJOBS_EMAIL) headers['User-Agent'] = process.env.USAJOBS_EMAIL;
  if (process.env.USAJOBS_API_KEY) headers['Authorization-Key'] = process.env.USAJOBS_API_KEY;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch job listings: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    
    const jobListings: JobListing[] = data.SearchResult.SearchResultItems.map((item: any) => ({
      JobTitle: item.MatchedObjectDescriptor.PositionTitle,
      
      // Map other fields as needed
    }));

    res.status(200).json(jobListings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching job listings' });
  }
}
