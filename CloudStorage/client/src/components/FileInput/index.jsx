import React from 'react';
import { MdFileUpload } from 'react-icons/md';
import { Button, DropZone, Flex, Text, VisuallyHidden, Divider } from '@aws-amplify/ui-react';
import classes from './FileInput.module.css';
import '../../styles/App.css';

import InputFilesTable from '../../components/InputFilesTable';

const acceptedFileTypes = ['.png', '.gif', '.jpg', 'jpeg', '.html', '.htm', '.doc', '.docx', '.pdf'];


function FileInput ({ onFilesUpload }) {
  const [acceptedFiles, setAcceptedFiles] = React.useState([]);
  const [rejectedFiles, setRejectedFiles] = React.useState([]);
  const [acceptedFileNames, setAcceptedFileNames] = React.useState([]);

  const hiddenInput = React.useRef(null);

  const onFilePickerChange = (event) => {
    const { files } = event.target;
    if (!files || files.length === 0) {
      return;
    }
    const filesArray = Array.from(files);
    setAcceptedFiles(filesArray.filter(file => acceptedFileTypes.includes(`.${file.name.split('.')[1]}`)));
    setRejectedFiles(filesArray.filter(file => !acceptedFileTypes.includes(`.${file.name.split('.')[1]}`)));
    setAcceptedFileNames(filesArray.map(file => file.name));
  };

  const handleFileNameChange = (index, newName) => {
    const newFileNames = [...acceptedFileNames];
    newFileNames[index] = newName;
    setAcceptedFileNames(newFileNames);
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={`${classes.mainFlex}`}
    >
      <DropZone
        acceptedFileTypes={acceptedFileTypes}
        onDropComplete={({ acceptedFiles, rejectedFiles }) => {
          setAcceptedFiles(acceptedFiles);
          setRejectedFiles(rejectedFiles);
          setAcceptedFileNames(acceptedFiles.map(file => file.name));
        }}
        className={`${classes.dropZone}`}
      >
        <Flex direction="column" alignItems="center">
          <Flex direction="row" justifyContent="center" alignItems="center">
            <MdFileUpload className={`${classes.dropIcon}`}></MdFileUpload>
            <Text className={`${classes.dropZoneText}`}>Drag files here</Text>
          </Flex>
          <Button className={`${classes.customButton}`} size="large" onClick={() => hiddenInput.current.click()}>
            Browse
          </Button>
        </Flex>
        <VisuallyHidden>
          <input
            type="file"
            tabIndex={-1}
            ref={hiddenInput}
            onChange={onFilePickerChange}
            multiple={true}
            accept={acceptedFileTypes.join(',')}
          />
        </VisuallyHidden>
      </DropZone>
      {(acceptedFiles.length > 0 && rejectedFiles.length > 0) ?
        <Flex direction="row" justifyContent="flex-start" alignItems="flex-start" width="100%" margin="10px">
          <InputFilesTable files={acceptedFiles} acceptedFileNames={acceptedFileNames} areAccepted={true} isSingleTable={false} handleFileNameChange={handleFileNameChange}></InputFilesTable>
          <InputFilesTable files={rejectedFiles} acceptedFileNames={acceptedFileNames} areAccepted={false} isSingleTable={false} handleFileNameChange={handleFileNameChange}></InputFilesTable>
        </Flex> : (
          (acceptedFiles.length > 0) ?
            <InputFilesTable files={acceptedFiles} acceptedFileNames={acceptedFileNames} areAccepted={true} isSingleTable={true} handleFileNameChange={handleFileNameChange}></InputFilesTable>
            : ((rejectedFiles.length > 0) ?
              <InputFilesTable files={rejectedFiles} acceptedFileNames={acceptedFileNames} areAccepted={false} isSingleTable={true} handleFileNameChange={handleFileNameChange}></InputFilesTable>
              : null)
        )
      }
      <Button
        className={`${classes.buttonSubmit}`}
        disabled={acceptedFiles.length === 0}
        marginBottom="15px"
        size="large" onClick={() => onFilesUpload(acceptedFiles, acceptedFileNames) }>
        Submit
      </Button>
      <Divider className={`${classes.divider}`}></Divider>
    </Flex>
  );
}

export default FileInput;