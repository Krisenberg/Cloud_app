import React from 'react';
import axios from 'axios';
import { Flex, Heading, DropZone, Button } from '@aws-amplify/ui-react';
import logo from '../../logo.svg';
import '../../styles/App.css';
import classes from './Main.module.css';

import FileList from '../../components/FileList';
import FileInput from '../../components/FileInput';

const MainContent = () => {

    const [openFileUploader, setOpenFileUploader] = React.useState(false);

    function onFileUploadButton() {
      setOpenFileUploader(!openFileUploader);
    }

    async function uploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/files`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          console.log('File uploaded successfully');
        } else {
          console.log('File upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    const handleNewFilesUpload = async (fileList) => {
      fileList.map(file => uploadFile(file));
    }


    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            gap="1rem"
            marginTop={50}
        >
            <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                gap="1rem"
            >
                <img src={logo} className="App-logo-small" alt="logo" />
                <Heading className={`${classes.heading}`} level={1}>
                    AWS S3 file storage wrapper
                </Heading>
            </Flex>
            <Button
                onClick={onFileUploadButton}
            >
                Upload new file
            </Button>
            {openFileUploader ? <FileInput onFilesUpload={handleNewFilesUpload}></FileInput> : null}
            {/* <FileInput></FileInput> */}
            <FileList></FileList>
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