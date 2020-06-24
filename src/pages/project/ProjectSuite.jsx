import React, { Component } from 'react';

class ProjectSuite extends Component {
    constructor(props) {
        super(props);
        this.projectId=parseInt(this.props.match.params.id)
        this.state = {  }
    }
    render() { 
        return ( 
            <div>ProjectSuite</div>
         );
    }
}
 
export default ProjectSuite;