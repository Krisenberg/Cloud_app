import React from 'react';
import { MdFileUpload } from 'react-icons/md';
import { Button, DropZone, Flex, Text, VisuallyHidden } from '@aws-amplify/ui-react';
import classes from './FileInput.module.css';
import '../../styles/App.css';

const acceptedFileTypes = ['.png', '.gif', '.jpg', 'jpeg', '.html', '.htm', '.doc', '.docx', '.pdf'];


function FileInput ({ onFilesUpload }) {
  const [acceptedFiles, setAcceptedFiles] = React.useState([]);
  const [rejectedFiles, setRejectedFiles] = React.useState([]);
  const hiddenInput = React.useRef(null);

  const onFilePickerChange = (event) => {
    const { files } = event.target;
    if (!files || files.length === 0) {
      return;
    }
    const filesArray = Array.from(files);
    setAcceptedFiles(filesArray.filter(file => acceptedFileTypes.includes(file.name.split('.')[1])));
    setRejectedFiles(filesArray.filter(file => !acceptedFileTypes.includes(file.name.split('.')[1])));
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
        }}
        className={`${classes.dropZone}`}
        // onDragEnter={setIsDragging(true)}
        // onDragLeave={setIsDragging(false)}
        // onDrop={setIsDragging(false)}
      >
        <Flex direction="column" alignItems="center">
          <Flex direction="row" justifyContent="center" alignItems="center">
            <MdFileUpload className={`${classes.dropIcon}`}></MdFileUpload>
            <Text className={`${classes.dropZoneText}`}>Drag files here</Text>
          </Flex>
          <Button className={`${classes.customButton}`} size="medium" onClick={() => hiddenInput.current.click()}>
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
      <Flex direction="row" justifyContent="flex-start" alignItems="flex-start" width="100%" margin="10px">
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start" width="50%" marginLeft="30px">
          {acceptedFiles.length > 0 ? <Text className={`${classes.miniHeader}`}>Accepted files:</Text> : null}
          {acceptedFiles.map((file) => (
            // <Text key={file.name}>{file.name}</Text>
            // <p class={`${classes.normalText}`}>- {file.name} [{file.size} bytes]</p>
            <li key={file.path} class={`${classes.normalText}`}>
              {file.name} [{file.size} bytes]
            </li>
          ))}
        </Flex>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start" width="50%" marginRight="30px">
          {rejectedFiles.length > 0 ? <Text className={`${classes.miniHeader}`}>Rejected files:</Text> : null}
          {rejectedFiles.map((file) => (
            // <Text key={file.name}>{file.name}</Text>
            <li key={file.path} class={`${classes.normalText}`}>
              {file.name} [{file.size} bytes]
            </li>
          ))}
        </Flex>
      </Flex>
      <Button
        className={`${classes.customButton}`}
        marginBottom="30px"
        size="large" onClick={() => onFilesUpload(acceptedFiles) }>
        Submit
      </Button>
    </Flex>
  );
}

export default FileInput;