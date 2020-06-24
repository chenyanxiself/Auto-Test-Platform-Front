import React, { Component } from 'react';
class ProjectSetting extends Component {
    constructor(props) {
        super(props);
        this.projectId=parseInt(this.props.match.params.id)
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                ProjectSetting
            </div>
         );
    }
}
 
export default ProjectSetting;