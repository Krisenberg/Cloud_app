import { Flex, Heading } from '@aws-amplify/ui-react';
import logo from '../../logo.svg';
import '../../styles/App.css';
import classes from './Main.module.css';

import FileList from '../../components/FileList';

const MainContent = () => {

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