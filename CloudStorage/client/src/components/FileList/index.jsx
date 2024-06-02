import React, { useState, useEffect } from 'react';
import { Placeholder, Card, Collection, Table, TableBody,
  TableCell, TableHead, TableRow, 
  Flex} from '@aws-amplify/ui-react';
import { MdCloudDownload, MdDriveFileRenameOutline, MdDeleteOutline } from "react-icons/md";
import classes from './FileList.module.css';

function FileList({ files, isLoading, displayError, errorMessage, onFileDownload }) {

  // const [files, setFiles] = useState([]);
  // const [isLoading, setLoadingState] = useState(true);
  // const [displayError, setDisplayError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

  // async function fetchFiles() {
  //   setLoadingState(true);
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/files`);
  //     if (!response.ok) {
  //       setLoadingState(false);
  //       setDisplayError(true);
  //       setErrorMessage('Failed to fetch files');
  //       // throw new Error('Failed to fetch files');
  //     }
  //     const data = await response.json();
  //     setFiles(data);
  //     setLoadingState(false);
  //     setDisplayError(false);
  //   } catch (error) {
  //     setLoadingState(false);
  //     setDisplayError(true);
  //     setErrorMessage(`Error occured while trying to fetch files: ${error}`)
  //     // console.error('Error occured while trying to fetch files: ', error);
  //   }
  // }

  // useEffect(() => { fetchFiles(); }, []);

  if (isLoading) {
    return <Placeholder className={`${classes.placeholder}`} />
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
    <Table highlightOnHover={false} className={`${classes.table}`}>
      <TableHead>
        <TableRow>
          <TableCell as="th" className={`${classes.tableHeader}`}>
            File Id
          </TableCell>
          <TableCell as="th" className={`${classes.tableHeader}`}>
            File name
          </TableCell>
          <TableCell as="th" className={`${classes.tableActionsHeader}`}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {files.map(file => (
          <TableRow key={file.id}>
            <TableCell className={`${classes.tableCell}`}>{file.id}</TableCell>
            <TableCell className={`${classes.tableCell}`}>{file.fileName}</TableCell>
            <TableCell className={`${classes.tableCell}`}>
              <Flex
                direction="row"
                justifyContent="flex-end"
                alignContent="flex-end"
                wrap="nowrap"
                gap="1rem"
              >
                <MdCloudDownload className={`${classes.actionButton}`} onClick={() => onFileDownload(file.id)}/>
                <MdDriveFileRenameOutline className={`${classes.actionButton}`}/>
                <MdDeleteOutline className={`${classes.actionButton}`}/>
              </Flex>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    // <Collection
    //   items={files}
    //   type="list"
    //   direction="column"
    //   gap="20px"
    //   wrap="nowrap"
    // >
    //   {(item, index) => (
    //     <Card
    //       key={index}
    //       borderRadius="medium"
    //       maxWidth="20rem"
    //       variation="elevated"
    //       boxShadow="large"
    //       className={`${classes.fileCard}`}
    //     >

    //     </Card>
    //   )}    
    // </Collection>
    // <div>
    //   {files.map(file => (
    //     <div key={file.id}>
    //       <p>File ID: {file.id}</p>
    //       <p>File Name: {file.fileName}</p>
    //     </div>
    //   ))}
    // </div>
  );
}

export default FileList;