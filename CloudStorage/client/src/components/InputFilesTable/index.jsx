import { Button, DropZone, Flex, Text, VisuallyHidden, Table, TableBody,
  TableCell, TableHead, TableRow, TextField} from '@aws-amplify/ui-react';

import { MdCheckCircleOutline, MdOutlineRemoveCircleOutline } from "react-icons/md";

import classes from './InputFilesTable.module.css';

function InputFilesTable({ files, acceptedFileNames, areAccepted, isSingleTable, handleFileNameChange }) {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" width={isSingleTable ? "35%" : "100%"} marginTop={"30px"}>
      {areAccepted ?
        <Flex direction="row" alignItems="center" justifyContent="center" width="100%">
          <MdCheckCircleOutline className={`${classes.iconAccept}`}></MdCheckCircleOutline>
          <Text className={`${classes.miniHeader}`}>Accepted files</Text>
        </Flex> :
        <Flex direction="row" alignItems="center" justifyContent="center" width="100%">
          <MdOutlineRemoveCircleOutline className={`${classes.iconDeny}`}></MdOutlineRemoveCircleOutline>
          <Text className={`${classes.miniHeader}`}>Rejected files</Text>
        </Flex>
      }
      {/* <Flex direction="row" alignItems="center" justifyContent="center" width="100%">
        {areAccepted ?
          <MdCheckCircleOutline></MdCheckCircleOutline>
          <Text></Text>
          "Accepted files" : "Rejected files"
        }
      </Flex>
      <Text className={`${classes.miniHeader}`}>
        {areAccepted ? 
          <Flex direction="row" alignItems="center" justifyContent="center" width="100%">
            <MdCheckCircleOutline></MdCheckCircleOutline>
            
          </Flex>
          "Accepted files" : "Rejected files"
        }
      </Text> */}
      <Table highlightOnHover={false} className={`${classes.table}`}>
        <TableHead>
          <TableRow>
            <TableCell as="th" className={`${classes.tableHeader}`}>
              No
            </TableCell>
            <TableCell as="th" className={`${classes.tableHeader}`}>
              File name
            </TableCell>
            <TableCell as="th" className={`${classes.tableHeaderSize}`}>
              Size [bytes]
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={file.id}>
              <TableCell className={`${classes.tableCell}`}>{index + 1}</TableCell>
              <TableCell>
                {areAccepted ?
                  <TextField
                    value={acceptedFileNames[index]}
                    onChange={(e) => { handleFileNameChange(index, e.target.value)}}
                    inputStyles={{
                      color: 'var(--text-color'
                    }}
                    className={`${classes.tableCell}`}
                  /> :
                  <Text className={`${classes.tableCell}`}>{file.name}</Text>
                }
              </TableCell>
              <TableCell className={`${classes.tableCellSize}`}>{file.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
}

export default InputFilesTable;