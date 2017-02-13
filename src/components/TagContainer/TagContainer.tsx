import * as React from 'react';
import {ITagContainerProps} from './TagContainer.Props';
import { Icon } from '../Icon/Icon';
import './TagContainer.scss';

 export class TagContainer extends React.Component<ITagContainerProps, any> {
    constructor(props?: ITagContainerProps) {
        super(props);
    }

    render() {
        let {tags, title} = this.props;
        return (
            
            <div className="tag-container"> 
                { title &&              
                    <h5>{title}</h5>
                }
                {
                    tags.map((tag, tagIndex) => (
                         <div key={tag.display} className="tag">
                             { tag.iconName &&
                                <Icon iconName={tag.iconName}></Icon>
                             }
                             <span>
                                 {tag.display}
                             </span>
                         </div>
                    ))
                }
                {this.props.children}
            </div>
        );
    }
 }
