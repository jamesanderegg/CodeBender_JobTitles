// Import Next.js types for API routes
import type { NextApiRequest, NextApiResponse } from 'next';

// Define a type for the API response to ensure type safety
interface JobListing {
  // Define the structure based on the API response
  JobTitle: string;
  // Add other fields as needed
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Destructure city, state, and jobTitle from the request body or query
  const { city, state, jobTitle } = req.query;

  // Construct the API URL with query parameters
  const apiUrl = `https://developer.usajobs.gov/api-reference/get-api-search?City=${city}&State=${state}&JobTitle=${encodeURIComponent(jobTitle)}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        // Replace 'YOUR_API_KEY_HERE' with your actual API key
        'Authorization-Key': process.env.USAJOBS!,
      },
    });

    if (!apiResponse.ok) {
      throw new Error('Failed to fetch job listings');
    }

    const data = await apiResponse.json();

    // Process and return the job listings
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
