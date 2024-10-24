import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { nanoid } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}


export function createUsername(fullName: string, email: string): string {
  // Extract the first name from the full name and replace spaces with underscores
  const firstName = fullName.split(' ')[0].toLowerCase().replace(/\s+/g, '_');

  // Extract the part of the email before the @ symbol
  const emailLocalPart = email.split('@')[0].toLowerCase();

  // Remove vowels from the email local part
  const emailWithoutVowels = emailLocalPart.replace(/[aeiou]/gi, '');

  // Randomize the remaining characters and take up to 4 letters
  const shuffledEmailPart = emailWithoutVowels
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
    .slice(0, 4);

  // Get the current date in YYYYMMDD format
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  // Randomize the digits of the formatted date and take up to 4 digits
  const shuffledDate = formattedDate
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
    .slice(0, 4);

  // Combine the shuffled parts
  let combinedPart = `${shuffledEmailPart}${shuffledDate}`;

  // Randomly decide whether to add an underscore or not
  if (Math.random() > 0.5) {
    const insertUnderscoreAt = Math.floor(Math.random() * (combinedPart.length + 1));
    combinedPart = combinedPart.slice(0, insertUnderscoreAt) + '_' + combinedPart.slice(insertUnderscoreAt);
  }

  // Combine the parts to form the initial username
  let username = `${firstName}${combinedPart}`.toLowerCase();

  // Remove any characters that are not lowercase letters, numbers, or underscores
  username = username.replace(/[^a-z0-9_]/g, '');

  // Ensure the username does not exceed 12 characters
  if (username.length > 12) {
    username = username.slice(0, 12);
  }

  // Ensure the username has only one underscore if it has one
  const underscoreCount = (username.match(/_/g) || []).length;
  if (underscoreCount > 1) {
    username = username.replace(/_/g, '');
  }

  // Optionally reinsert a single underscore if the original intention was to have one
  if (underscoreCount > 0 && !username.includes('_')) {
    const insertUnderscoreAt = Math.floor(Math.random() * (username.length + 1));
    username = username.slice(0, insertUnderscoreAt) + '_' + username.slice(insertUnderscoreAt);
  }

  return username;
}



export function trimExcessiveLineBreaks(text: string): string {
  // Replace two or more consecutive line breaks with 1 line
  text = text.replace(/(\r?\n){2,}/g, '\n');
  // Split the text into lines
  const lines = text.split('\n');

   // Remove the first line if it is empty
   if (lines[0].trim() === '') {
    lines.shift();
  }

  // Keep the first 5 lines
  const limitedLines = lines.slice(0, 4);
  // Join the lines back into a single string
  return limitedLines.join('\n');
  }




  export function createSlug(content: string, username?: string, useNanoid?:boolean) {
    // Step 1: Extract the content and trim to 60 chars if greater than 60
    const trimmedContent = content.length > 60 ? content.slice(0, 60) : content;
    
   // Step 2: Replace any symbol or spaces with an empty string, make it lowercase
   const formattedTitle = trimmedContent.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Step 2: Add `_by_{username}` at the end
    const formattedUsername = username ? `-by-${username?.toLowerCase()}` : '';
  
    // Step 3: Generate a unique ID using nanoid and append it to the slug
    const uniqueId = nanoid();
  
    // Step 4: Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
  
    // Combine all parts to form the final slug
    const slug = (useNanoid ? `${formattedTitle}${formattedUsername}-${uniqueId}-${currentDate}` : 
                             `${formattedTitle}${formattedUsername}`);
  
    return slug;
  }
  
  

  // truncate
  export const truncateString = (str: string, length: number, ellipsis: boolean = false) => {
    // Function to detect URLs and remove them
    const removeUrls = (text: string) => {
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlPattern, '[URL]');
    };
  
    // Function to add spaces around dots
    const addSpacesAroundDots = (text: string) => {
      return text.replace(/\./g, ' . ');
    };
  
    // First, remove URLs from the string
    const noUrlString = removeUrls(str);
  
    // Then, add spaces around dots
    const plainText = addSpacesAroundDots(noUrlString);
  
    // Then truncate the string if necessary
    const truncatedString = plainText.length > length ? plainText.slice(0, length) : plainText;
    
    // Add ellipsis if required
    return ellipsis && plainText.length > length ? `${truncatedString}...` : truncatedString;
  };


  export const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 150; // Average words read per minute
    const words = content.split(/\s+/).length; // Count words by splitting on whitespace
    const minutes = Math.ceil(words / wordsPerMinute); // Round up to the nearest minute
    return minutes;
  };
  