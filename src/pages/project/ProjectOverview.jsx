import React, {Component} from 'react';
import './projectOverview.scss'

class ProjectOverview extends Component {
    constructor(props) {
        super(props);
        this.projectId = parseInt(this.props.match.params.id)
        this.state = {
            selectKeys: []
        }
    }

    render() {
        return (
            <div>ProjectOverview</div>
        );
    }
}

export default ProjectOverview;