import React, { Component } from 'react';
class ProjectOverview extends Component {
    constructor(props) {
        super(props);
        this.projectId=parseInt(this.props.match.params.id)
        this.state = {  }
    }
    render() {
        return ( 
            <div>ProjectOverview</div>
         );
    }
}
 
export default ProjectOverview;