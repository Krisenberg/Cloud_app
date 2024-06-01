import React, { useState, useEffect } from 'react';
import { Placeholder } from '@aws-amplify/ui-react';

function FileList() {

  const [files, setFiles] = useState([]);
  const [isLoading, setLoadingState] = useState(true);
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function fetchFiles() {
    setLoadingState(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/files`);
      if (!response.ok) {
        setLoadingState(false);
        setDisplayError(true);
        setErrorMessage('Failed to fetch files');
        // throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
      setLoadingState(false);
      setDisplayError(false);
    } catch (error) {
      setLoadingState(false);
      setDisplayError(true);
      setErrorMessage(`Error occured while trying to fetch files: ${error}`)
      // console.error('Error occured while trying to fetch files: ', error);
    }
  }

  useEffect(() => { fetchFiles(); }, []);

  if (isLoading) {
    return <Placeholder size="large" />
  }
  if (displayError) {
    return (
      <div>
        <p color='white'>ERROR</p>
        <p color='white'>{errorMessage}</p>
      </div>
    )   
  }
  return (
    <div>
      {files.map(file => (
        <div key={file.id}>
          <p>File ID: {file.id}</p>
          <p>File Name: {file.fileName}</p>
        </div>
      ))}
    </div>
  );
}

export default FileList;