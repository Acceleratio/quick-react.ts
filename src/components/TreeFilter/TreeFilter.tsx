import * as React from 'react';
import Resizable from 'react-resizable-box';
import * as classNames from 'classnames';
import * as _ from 'lodash';

import { Callout } from '../Callout';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { Icon } from '../Icon';
import {
    ITreeFilterProps,
    ITreeFilterState,
    FilterSelectionEnum,
    IFilterSelection,
    defaultTreeFilterProps,
    TreeItem
} from './TreeFilter.Props';
import { ItemOperator } from './TreeItemOperators';
import { VirtualizedTreeView } from './VirtualizedTreeView';
import { IVirtualizedTreeViewProps } from './VirtualizedTreeView.Props';
import { Tooltip } from '../Tooltip/Tooltip';

import { Spinner } from '../Spinner/Spinner';
import { SpinnerType } from '../Spinner/Spinner.Props';

import { autobind } from '../../utilities/autobind';

import './TreeFilter.scss';

export class TreeFilter extends React.PureComponent<ITreeFilterProps, ITreeFilterState> {
    private _anchor: any;
    private _callout: any;
    private allItemIds: ReadonlyArray<string>;
    private lookups: any;

    private _tooltipRef: any;

    static defaultProps = defaultTreeFilterProps;

    public constructor(props: ITreeFilterProps) {
        super(props);

        this.allItemIds = ItemOperator.getAllItemIds(props.items);
        this.lookups = ItemOperator.getLookupTableAndParentLookup(props.items);

        const selectionStrings = this.getSelectedText(props.filterSelection, this.lookups.itemLookup);

        this.state = {
            isOpen: false,
            isReady: props.isReady,
            isDefaultSelected: this.checkIfDefaultSelection(props.filterSelection.type, props.filterSelection.selectedIDs),
            selectionText: selectionStrings.selectionText,
            query: '',
            selection: props.filterSelection,
            titleText: selectionStrings.titleText
        };
    }

    getSelectedText = (selection: IFilterSelection, itemLookup) => {
        let selectionText;
        let titleText;

        if (selection.type === FilterSelectionEnum.All) {
            return { selectionText: '[All]', titleText: 'All items selected' };
        } else if (selection.type === FilterSelectionEnum.None) {
            return { selectionText: this.props.emptySelectionText, titleText: this.props.emptySelectionText };
        }

        const keys = Object.keys(itemLookup);
        const checkedItemIds = selection.selectedIDs.filter(selectedId => {
            if (itemLookup.hasOwnProperty(selectedId)) {
                return selectedId;
            } else {
                console.warn(`Warning: Provided selected key: [${selectedId}] doesn't exist.`);
            }
        });

        if (checkedItemIds === undefined || checkedItemIds.length === 0) {
            selectionText = titleText = this.props.emptySelectionText;
        } else if (checkedItemIds.length === 1) {
            const itemId = checkedItemIds[0];
            selectionText = titleText = itemLookup[itemId].value;
        } else {
            const someIds = checkedItemIds.slice(0, 3);
            const names = someIds.map(itemID => itemLookup[itemID].value);
            selectionText = names.join(', ') + '...';
            titleText = checkedItemIds.map(id => itemLookup[id].value).join(', ');
        }

        return { selectionText, titleText };
    }

    private checkIfDefaultSelection(filterSelectionType: FilterSelectionEnum, selectedIds: Array<string>): boolean {
        const { defaultSelection } = this.props;
        const checkedItemIds = filterSelectionType === FilterSelectionEnum.All ? this.allItemIds : selectedIds;
        const numberOfSelectedItems = checkedItemIds.length;

        const isDefaultSelected =
            (defaultSelection === FilterSelectionEnum.None && numberOfSelectedItems === 0) ||
            (defaultSelection === FilterSelectionEnum.All && numberOfSelectedItems === this.allItemIds.length);

        return isDefaultSelected;
    }

    public componentWillReceiveProps(nextProps: ITreeFilterProps) {
        if (nextProps.items !== this.props.items) {
            this.lookups = ItemOperator.getLookupTableAndParentLookup(nextProps.items);
            this.allItemIds = Object.keys(this.lookups.itemLookup);
        }

        const selectionStrings = this.getSelectedText(nextProps.filterSelection, this.lookups.itemLookup);

        this.setState(
            prevState => ({
                ...prevState,
                selectionText: selectionStrings.selectionText,
                titleText: selectionStrings.titleText,
                isDefaultSelected: this.checkIfDefaultSelection(nextProps.filterSelection.type, nextProps.filterSelection.selectedIDs),
                selection: nextProps.filterSelection,
                isReady: nextProps.isReady
            }));
    }

    private setAnchorRef = (ref) => {
        this._anchor = ref;
    }

    private setCalloutRef = (ref) => {
        this._callout = ref;
    }

    private toggleOpenState = () => {
        if (this.props.items == null || this.props.items.length === 0) {
            return;
        }
        clearTimeout(this._tooltipRef.timer);
        this.setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
    }

    private onDismiss = () => {
        this.setState(prevState => ({ ...prevState, 
            isOpen: false,
            query: this.props.clearSearchOnClose ? '' : prevState.query, }));
        this.props.onCalloutClose();
    }

    private getBoxSupportElementsHeight = () => {
        let heightDiff = 12;
        if (!this.props.isSingleSelect && this.props.showStatusBar) { heightDiff += 20; }
        if (this.props.showSelectAll) { heightDiff += 21; }
        if (this.props.hasSearch) { heightDiff += 42; }
        if (this.props.showButtons) { heightDiff += 22; }
        return heightDiff;
    }

    private getBoxHeight = (availableHeight) => {
        const supportElementsHeight = this.getBoxSupportElementsHeight();
        const maxListHeight = availableHeight - supportElementsHeight;
        const numberOfItems = this.allItemIds.length;
        const itemsListHeight = numberOfItems * this.props.rowHeight;
        if (itemsListHeight < maxListHeight) {
            if (this.props.showButtons) {
                return itemsListHeight + supportElementsHeight + 20;
            }
            return itemsListHeight + supportElementsHeight;
        } else {
            return availableHeight;
        }
    }

    private onCalloutResize = () => {
        this._callout.UpdatePosition();
    }

    @autobind
    private onValuesSelected(filterId: string, filterSelection: IFilterSelection) {
        const isDefault = this.checkIfDefaultSelection(filterSelection.type, filterSelection.selectedIDs);
        let state = { ...this.state, isDefaultSelected: isDefault, selection: filterSelection };
        if (this.props.isSingleSelect) {
            state = { ...state, isOpen: false, query: this.props.clearSearchOnClose ? '' : state.query };
        }
        this.setState(state);
        if (this.props.onValuesSelected !== undefined) {
            this.props.onValuesSelected(filterId, filterSelection);
        } else {
            const selectionStrings = this.getSelectedText(filterSelection, this.lookups.itemLookup);
            this.setState({ selectionText: selectionStrings.selectionText, titleText: selectionStrings.titleText });
        }
    }

    @autobind
    private onFilterReset() {
        this.setState(prevState => ({
            ...prevState,
            isDefaultSelected: true
        }));

        const newFilterSelected = {
            type: this.props.defaultSelection,
            selectedIDs: []
        };

        if (this.props.onValuesSelected !== undefined) {
            this.props.onValuesSelected(this.props.filterId, newFilterSelected);
        } else {
            const selectionStrings = this.getSelectedText(newFilterSelected, this.lookups.itemLookup);
            this.setState({
                selectionText: selectionStrings.selectionText,
                titleText: selectionStrings.titleText,
                selection: newFilterSelected
            });
        }
    }

    @autobind
    private onItemsSearch(query: string) {
        this.setState({ ...this.state, query });
    }

    @autobind
    private _onDismiss() {
        const selectionStrings = this.getSelectedText(this.props.filterSelection, this.lookups.itemLookup);
        this.setState(prevState => ({
            ...prevState,
            isOpen: false,
            query: this.props.clearSearchOnClose ? '' : prevState.query,
            selection: this.props.filterSelection,
            selectionText: selectionStrings.selectionText,
            titleText: selectionStrings.titleText
        }));
        this.props.onCalloutClose();
    }

    @autobind
    private _onSelect() {
        if (this.props.onSave !== undefined) {
            this.props.onSave(this.props.filterId, this.state.selection);
        }

        this.setState(prevState => ({ ...prevState, 
            isOpen: false, 
            query: this.props.clearSearchOnClose ? '' : prevState.query,
            selection: this.state.selection }));
        this.props.onCalloutClose();
    }

    @autobind
    private _setTooltipRef(ref) {
        this._tooltipRef = ref;
    }

    private _getAllItemIds = () => this.allItemIds;
    private _getLookups = () => this.lookups;

    public render() {
        const { isOpen, isReady, isDefaultSelected } = this.state;
        const hasItems = this.props.items != null && this.props.items.length !== 0;
        const treeFilterProps = {
            ...this.props,
            title: undefined,
            allItemIdsGetter: this._getAllItemIds,
            lookupTableGetter: this._getLookups,
            onValuesSelected: this.onValuesSelected,
            onItemsSearch: this.onItemsSearch,
            searchQuery: this.state.query,
            showButtons: this.props.showButtons,
            onSave: this._onSelect,
            onCancel: this._onDismiss,
            filterSelection: this.state.selection
        };

        const treeFilterClassName = classNames(
            'tree-filter-container',
            {
                'is-disabled': this.props.disabled
            }
        );

        const treeFilterTitleClass = classNames(
            'tree-filter-title',
            {
                'tree-filter-title-with-border': this.props.hasTitleBorder,
                'tree-filter-title-validation-error': !this.props.validated
            }
        );

        return (
            <div className={treeFilterClassName} ref={this.setAnchorRef}>
                {
                    this.props.iconName && this.props.title &&
                    <Icon iconName={this.props.iconName} className="filter-title-icon" />
                }
                {
                    this.props.title &&
                    <span className={classNames({ 'item-selected': !isDefaultSelected })} >{this.props.title}</span>
                }
                {
                    this.props.title && !isDefaultSelected && this.props.showResetButton &&
                    <Icon iconName="icon-delete" title="Reset selection" className="reset-filter-icon" onClick={this.onFilterReset} />
                }
                <Tooltip
                    content={this.props.validated ? this.state.titleText : this.props.validationErrorMessage}
                    delayMs={500}
                    directionalHint={DirectionalHint.rightCenter}
                    ref={this._setTooltipRef}
                    className={this.props.validated ? undefined : 'tooltip-error'}>
                    <div
                        className={treeFilterTitleClass}
                        onClick={this.toggleOpenState}>
                        <span>{this.state.selectionText}</span>
                        {
                            !this.props.validated &&
                            <Icon className="validation-error-icon" iconName="icon-warning2" />
                        }
                        {
                            hasItems && isOpen && this.state.isReady &&
                            <Icon className="dropdown-icon" iconName="icon-Arrow_up" />
                        }
                        {
                            hasItems && !isOpen && this.state.isReady &&
                            <Icon className="dropdown-icon" iconName="icon-arrow_down" />
                        }
                        {
                            !this.state.isReady && !this.props.disabled &&
                            <Spinner type={SpinnerType.small} />
                        }
                    </div>
                </Tooltip>
                {
                    this.state.isOpen && this.state.isReady &&
                    <Callout
                        ref={this.setCalloutRef}
                        isBeakVisible={false}
                        className="tree-filter-callout"
                        gapSpace={0}
                        doNotLayer={false}
                        directionalHint={this.props.directionalHint}
                        targetElement={this._anchor}
                        onDismiss={this.props.showButtons ? this._onDismiss : this.onDismiss}
                    >
                        <Resizable
                            width={this.props.width}
                            height={this.getBoxHeight(this.props.height)}
                            style={{ overflow: 'hidden' }}
                            minWidth={this.props.minWidth}
                            minHeight={this.props.minHeight}
                            maxWidth={this.props.maxWidth}
                            maxHeight={this.props.maxHeight}
                            onResize={this.onCalloutResize}
                            enable={this.props.enabledResizeHandles}
                        >
                            <div style={{ height: '100%', width: '100%' }}>
                                {
                                    <VirtualizedTreeView
                                        {...treeFilterProps}
                                    />
                                }
                            </div>
                        </Resizable>
                    </Callout>
                }
            </div>
        );
    }
}
