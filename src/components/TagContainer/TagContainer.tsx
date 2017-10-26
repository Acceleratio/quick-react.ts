import * as React from 'react';
import { ITagContainerProps, ITag } from './TagContainer.Props';
import { Icon } from '../Icon/Icon';
import { autobind } from '../../utilities/autobind';
import { Label } from '../Label/Label';
import './TagContainer.scss';

export class TagContainer extends React.Component<ITagContainerProps, any> {
    constructor(props?: ITagContainerProps) {
        super(props);
    }

    public render() {
        let { tags, title } = this.props;
        let extraTags = '';
        if (tags.length > 3) {
            extraTags = tags.map((i) => { return i; }).splice(3, tags.length).reduce((previous, current) => {
                if (previous !== '') {
                    return previous + '\n' + current.display;
                }
                return current.display;
            }, '');
        }

        return (
            <div className="tag-container">
                {title &&
                    <Label>{title}</Label>
                }
                {
                    tags.length <= 3 &&
                    tags.map((tag, tagIndex) => (
                        this.renderTag(tag)
                    ))
                }
                {
                    tags.length > 3 &&
                    tags.map((i) => { return i; }).slice(0, 3).map((tag, tagIndex) => (
                        this.renderTag(tag)
                    ))
                }
                {
                    tags.length > 3 && <div className="tag points" title={extraTags}>...</div>
                }
                {this.props.children}
            </div>
        );
    }

    private renderTag(tag: ITag): JSX.Element {
        return (
            <div key={tag.display} className="tag">
                {tag.iconName &&
                    <Icon iconName={tag.iconName} title={tag.tooltip} />}
                <span
                    style={{ cursor: 'pointer' }}
                    className={'tag-text'} title={tag.display}
                >
                    {tag.display}
                </span>
            </div>
        );
    }
}
