import React, { } from 'react'; 
import './home.css';
import Navbar from '../../components/NavBar/navBar';
import AssignmentTable from '../../components/AssignmentTable/assignmentTable';

const home: React.FC = () => {


    return (
        <div>
        <Navbar />
        <div className = 'container'>
              <AssignmentTable testMode={false} />
        </div>
      </div>
    );
}

export default home;