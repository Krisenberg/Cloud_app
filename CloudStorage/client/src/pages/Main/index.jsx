import React from 'react';
import axios from 'axios';
import { Flex, Heading, Button, Message } from '@aws-amplify/ui-react';
import { MdCloudUpload, MdRefresh } from "react-icons/md";
import logo from '../../logo.svg';
import '../../styles/App.css';
import classes from './Main.module.css';

import FileList from '../../components/FileList';
import FileInput from '../../components/FileInput';

const MainContent = () => {

    const [openFileUploader, setOpenFileUploader] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    const [isLoading, setLoadingState] = React.useState(true);
    const [uploadMessages, setUploadMessages] = React.useState([]);
    const [displayMessages, setDisplayMessages] = React.useState(false);

    function onFileUploadButton() {
      setOpenFileUploader(!openFileUploader);
    }

    async function fetchFiles() {
      setLoadingState(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/files`);
        if (!response.ok) {
          setLoadingState(false);
          // setDisplayError(true);
          // setErrorMessage('Failed to fetch files');
          // throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFiles(data);
        setLoadingState(false);
        // setDisplayError(false);
      } catch (error) {
        setLoadingState(false);
        // setDisplayError(true);
        // setErrorMessage(`Error occured while trying to fetch files: ${error}`)
        setUploadMessages([[false, `Error occured while trying to fetch files: ${error}`]]);
        setDisplayMessages(true);
        // console.error('Error occured while trying to fetch files: ', error);
      }
    }

    async function uploadFile(file, fileName, messages) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);

      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/files`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          messages.push([true, `File ${fileName} uploaded successfully`])
        } else {
          messages.push([false, `File ${fileName} upload failed`])
        }
      } catch (error) {
        console.error('Error - uploading file:', error);
        messages.push([false, `File ${fileName} upload failed`])
      }
    }

    const handleNewFilesUpload = async (fileList, acceptedFileNames) => {
      const messages = [];
      for (let i = 0; i < fileList.length; i++) {
        await uploadFile(fileList[i], acceptedFileNames[i], messages);
      }
      // fileList.map(file => uploadFile(file, messages));
      setOpenFileUploader(false);
      setUploadMessages(messages);
      console.log(messages);
      fetchFiles();
      setDisplayMessages(true);
    }

    const handleMessageDismiss = (index) => {
      setUploadMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages.splice(index, 1);
        if (newMessages.length === 0)
          setDisplayMessages(false);
        return newMessages;
      });
    };

    function getFileNameFromContentDisposition(contentDisposition) {
      const start = contentDisposition.indexOf('filename=') + 9; // 9 is the length of 'filename='
      const end = contentDisposition.indexOf(';', start);
      let fileName = '';
    
      if (end !== -1) {
        fileName = contentDisposition.substring(start, end);
      } else {
        fileName = contentDisposition.substring(start);
      }
    
      // Remove any surrounding quotes
      fileName = fileName.replace(/['"]/g, '');
    
      return fileName;
    }

    async function downloadFile(fileId) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/files/${fileId}`, {
          responseType: 'blob'
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary <a> element to trigger the download
        const tempLink = document.createElement("a");
        tempLink.href = url;
        console.log(response.headers);
        tempLink.setAttribute(
          "download",
          getFileNameFromContentDisposition(response.headers['content-disposition'])
        ); // Set the desired filename for the downloaded file

        // Append the <a> element to the body and click it to trigger the download
        document.body.appendChild(tempLink);
        tempLink.click();

        // Clean up the temporary elements and URL
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error - downloading file:', error);
      }
    }

    async function changeFileName(fileId, newFileName) {
      const messages = [];
      try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND}/api/files/${fileId}`, { Id: fileId, FileName: newFileName });
        if (response.status === 204) {
          messages.push([true, `Successfully updated file [${newFileName}]`]);
        } else {
          messages.push([false, `Failed to update file name [${newFileName}]`]);
        }
      } catch (error) {
        messages.push([false, 'Error updating file name:', error]);
      }

      setUploadMessages(messages);
      fetchFiles();
      setDisplayMessages(true);
    }

    async function deleteFile(fileId) {
      const messages = [];
      try {
        const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/files/${fileId}`);
        if (response.status === 204) {
          messages.push([true, `Successfully deleted file [Id = ${fileId}]`]);
        } else {
          messages.push([false, `Failed to delete file [Id = ${fileId}]`]);
        }
      } catch (error) {
        messages.push([false, 'Error deleting file [Id = ${fileId}]', error]);
      }

      setUploadMessages(messages);
      fetchFiles();
      setDisplayMessages(true);
    }

    React.useEffect(() => { fetchFiles(); }, []);

    return (
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          gap="1rem"
          marginTop={50}
        >
          {!displayMessages ? null :
            <Flex direction="column" className={`${classes.overlayStyle}`}>
              {uploadMessages.map((message, index) => (
                <Message
                  key={index}
                  colorTheme={message[0] ? 'success' : 'error'}
                  isDismissible={true}
                  onDismiss={() => handleMessageDismiss(index)}
                >
                  {message[1]}
                </Message>
              ))}
            </Flex>
          }
          {/* {(uploadMessages.length > 0) ?        
            <Flex direction="column" className={`${classes.overlayStyle}`}>
              {uploadMessages.map((message, index) => (
                <Message key={index} colorTheme={message[0] ? 'success' : 'error'} isDismissible={true}>
                  {message[1]}
                </Message>
              ))}
            </Flex> : null
          } */}
          <Flex
            direction="row"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            gap="1rem"
            marginBottom={50}
          >
            <img src={logo} className="App-logo-small" alt="logo" />
            <Heading className={`${classes.heading}`} level={1}>
              AWS S3 file storage wrapper
            </Heading>
          </Flex>
          <Flex
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            alignContent="flex-end"
            width="60%"
            wrap="nowrap"
            gap="1rem"
          >
            <Button
              onClick={onFileUploadButton}
              className={openFileUploader ? `${classes.customButtonPressed}` : `${classes.customButton}`}
            >
              <MdCloudUpload className={openFileUploader ? `${classes.buttonIconPressed}` : `${classes.buttonIcon}`}/>
              Upload new file
            </Button>
            <Button
              onClick={fetchFiles}
              className={`${classes.customButton}`}
            >
              <MdRefresh className={`${classes.buttonIcon}`}/>
              Refresh
            </Button>
          </Flex>
          {openFileUploader ? <FileInput onFilesUpload={handleNewFilesUpload}></FileInput> : null}
          {/* <FileInput></FileInput> */}
          <FileList
            files={files}
            isLoading={isLoading}
            handleDatabaseFileDownload={downloadFile}
            handleDatabaseFileNameChange={changeFileName}
            handleDatabaseFileDelete={deleteFile}
          ></FileList>
        </Flex>
        // <div className="App">
        //     <header className="App-header">
        //     <p>
        //         Edit <code>src/App.js</code> and save to reload.
        //     </p>
        //     <a
        //         className="App-link"
        //         href="https://reactjs.org"
        //         target="_blank"
        //         rel="noopener noreferrer"
        //     >
        //         Learn React
        //     </a>
        //     </header>
        // </div>
    );
  }
  
  export default MainContent;