import React from 'react';
import { Placeholder, TextField, Table, TableBody, TableCell, TableHead,
  TableRow, Flex, Button } from '@aws-amplify/ui-react';
import { MdCloudDownload, MdDriveFileRenameOutline, MdDeleteOutline, MdOutlineSave } from "react-icons/md";
import classes from './FileList.module.css';

function FileList({ files, isLoading, handleDatabaseFileDownload,
  handleDatabaseFileNameChange, handleDatabaseFileDelete }) {

  const [modifiedFileIndex, setModifiedFileIndex] = React.useState(null);
  const [newFileName, setNewFileName] = React.useState(null);

  const handlefileNameChange = (fileId) => {
    setModifiedFileIndex(null);
    handleDatabaseFileNameChange(fileId, newFileName);
  }

  const handleFileDelete = (fileId) => {
    const confirmed = window.confirm(`Are you sure you want to delete file with Id: ${fileId}?`);
    if (confirmed) {
      handleDatabaseFileDelete(fileId);
    }
  }

  if (isLoading) {
    return <Placeholder className={`${classes.placeholder}`} />
  }

  if (files === null || !Array.isArray(files) || files.length === 0)
    return null;

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
        {files.map((file, index) => (
          <TableRow key={file.id}>
            <TableCell className={`${classes.tableCell}`}>{file.id}</TableCell>
            {(modifiedFileIndex === index) ?
              <Flex direction={"row"} className={`${classes.fileNameChangeRow}`}>
                <TextField
                  value={newFileName}
                  onChange={(e) => { setNewFileName(e.target.value); console.log('New val', e.target.value)}}
                  inputStyles={{
                    color: 'var(--text-color'
                  }}
                  className={`${classes.textInput}`}
                  innerEndComponent={
                    <>
                      <Button
                        onClick={() => handlefileNameChange(file.id)}
                        className={`${classes.buttonSave}`}
                      >
                        <MdOutlineSave className={`${classes.iconSave}`}/>
                        Save
                      </Button>
                    </>
                  }
                />
              </Flex>
              // <TextField
              //     value={file.fileName}
              //     // onChange={(e) => { handleFileNameChange(index, e.target.value)}}
              //     inputStyles={{
              //       color: 'var(--text-color'
              //     }}
              //     className={`${classes.tableCell}`}
              //   />
              :
              <TableCell className={`${classes.tableCell}`}>{file.fileName}</TableCell>      
            }
            <TableCell className={`${classes.tableCell}`}>
              <Flex
                direction="row"
                justifyContent="flex-end"
                alignContent="flex-end"
                wrap="nowrap"
                gap="1rem"
              > 
                {/* {!(modifiedFileIndex === index) ? null :
                  <Button
                    onClick={handlefileNameChange}
                    className={`${classes.buttonSave}`}
                  >
                    <MdOutlineSave className={`${classes.iconSave}`}/>
                    Save
                  </Button>
                } */}
                <MdCloudDownload className={`${classes.actionButton}`} onClick={() => handleDatabaseFileDownload(file.id)}/>
                <MdDriveFileRenameOutline className={`${classes.actionButton}`} onClick={() => {
                  setModifiedFileIndex((modifiedFileIndex === index) ? null : index)
                  setNewFileName(file.fileName)
                }}></MdDriveFileRenameOutline>
                <MdDeleteOutline className={`${classes.actionButton}`} onClick={() => handleFileDelete(file.id)}/>
              </Flex>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default FileList;