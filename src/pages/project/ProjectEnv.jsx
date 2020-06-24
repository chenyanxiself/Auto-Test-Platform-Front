import React, { Component } from 'react';
class ProjectEnv extends Component {
    constructor(props) {
        super(props);
        this.projectId=parseInt(this.props.match.params.id)
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                ProjectEnv
            </div>
         );
    }
}
 
export default ProjectEnv;