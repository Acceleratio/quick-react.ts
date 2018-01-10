/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Icon } from './../../src/components/Icon/Icon';
import './../../src/components/Icon/symbol-defs.svg';

export class Index extends React.Component<any, any> {
    public render() {
        let symbols = Array.from(document.querySelector('defs').children);
        return (
            <div>
                <div> <Icon iconName={'icon-disk'}></Icon> <span>   icon-disk</span></div>
                <div> <Icon iconName={'icon-viewType'}></Icon> <span>   icon-viewType</span></div>
                <div> <Icon iconName={'icon-alert'}></Icon> <span>   icon-alert</span></div>
                <div> <Icon iconName={'icon-alert1'}></Icon> <span>   icon-alert1</span></div>
                <div> <Icon iconName={'icon-add_to_group'}></Icon> <span>   icon-add_to_group</span></div>
                <div> <Icon iconName={'icon-move_to_group'}></Icon> <span>   icon-move_to_group</span></div>
                <div> <Icon iconName={'icon-copy_to_group'}></Icon> <span>   icon-copy_to_group</span></div>
                <div> <Icon iconName={'icon-remove_user'}></Icon> <span>   icon-remove_user</span></div>
                <div> <Icon iconName={'icon-transfer_user'}></Icon> <span>   icon-transfer_user</span></div>
                <div> <Icon iconName={'icon-clone_user'}></Icon> <span>   icon-clone_user</span></div>
                <div> <Icon iconName={'icon-remove_users_from_group'}></Icon> <span>   icon-remove_users_from_group</span></div>
                <div> <Icon iconName={'icon-edit_user'}></Icon> <span>   icon-edit_user</span></div>
                <div> <Icon iconName={'icon-create_group'}></Icon> <span>   icon-create_group</span></div>
                <div> <Icon iconName={'icon-grant_permissions'}></Icon> <span>   icon-grant_permissions</span></div>
                <div> <Icon iconName={'icon-break'}></Icon> <span>   icon-break</span></div>
                <div> <Icon iconName={'icon-restore'}></Icon> <span>   icon-restore</span></div>
                <div> <Icon iconName={'icon-delete_group'}></Icon> <span>   icon-delete_group</span></div>
                <div> <Icon iconName={'icon-delete_user'}></Icon> <span>   icon-delete_user</span></div>
                <div> <Icon iconName={'icon-event_viewer'}></Icon> <span>   icon-event_viewer</span></div>
                <div> <Icon iconName={'icon-filter2'}></Icon> <span>   icon-filter2</span></div>
                <div> <Icon iconName={'icon-not_equal'}></Icon> <span>   icon-not_equal</span></div>
                <div> <Icon iconName={'icon-onedrive'}></Icon> <span>   icon-onedrive</span></div>
                <div> <Icon iconName={'icon-permissions_explorer'}></Icon> <span>   icon-permissions_explorer</span></div>
                <div> <Icon iconName={'icon-account'}></Icon> <span>   icon-account</span></div>
                <div> <Icon iconName={'icon-add'}></Icon> <span>   icon-add</span></div>
                <div> <Icon iconName={'icon-all_users'}></Icon> <span>   icon-all_users</span></div>
                <div> <Icon iconName={'icon-arrow_down'}></Icon> <span>   icon-arrow_down</span></div>
                <div> <Icon iconName={'icon-arrow_down_right'}></Icon> <span>   icon-arrow_down_right</span></div>
                <div> <Icon iconName={'icon-arrow_L'}></Icon> <span>   icon-arrow_L</span></div>
                <div> <Icon iconName={'icon-arrow_R'}></Icon> <span>   icon-arrow_R</span></div>
                <div> <Icon iconName={'icon-arrow_right'}></Icon> <span>   icon-arrow_right</span></div>
                <div> <Icon iconName={'icon-Arrow_up'}></Icon> <span>   icon-Arrow_up</span></div>
                <div> <Icon iconName={'icon-arrow-down'}></Icon> <span>   icon-arrow-down</span></div>
                <div> <Icon iconName={'icon-arrow-left'}></Icon> <span>   icon-arrow-left</span></div>
                <div> <Icon iconName={'icon-arrow-right'}></Icon> <span>   icon-arrow-right</span></div>
                <div> <Icon iconName={'icon-arrows'}></Icon> <span>   icon-arrows</span></div>
                <div> <Icon iconName={'icon-arrow-up'}></Icon> <span>   icon-arrow-up</span></div>
                <div> <Icon iconName={'icon-barChart'}></Icon> <span>   icon-barChart</span></div>
                <div> <Icon iconName={'icon-barChart2'}></Icon> <span>   icon-barChart2</span></div>
                <div> <Icon iconName={'icon-buy'}></Icon> <span>   icon-buy</span></div>
                <div> <Icon iconName={'icon-buy2'}></Icon> <span>   icon-buy2</span></div>
                <div> <Icon iconName={'icon-camera'}></Icon> <span>   icon-camera</span></div>
                <div> <Icon iconName={'icon-checkbox'}></Icon> <span>   icon-checkbox</span></div>
                <div> <Icon iconName={'icon-checkmark'}></Icon> <span>   icon-checkmark</span></div>
                <div> <Icon iconName={'icon-ck_kit'}></Icon> <span>   icon-ck_kit</span></div>
                <div> <Icon iconName={'icon-ClodKit365'}></Icon> <span>   icon-ClodKit365</span></div>
                <div> <Icon iconName={'icon-cloud'}></Icon> <span>   icon-cloud</span></div>
                <div> <Icon iconName={'icon-collapseAll'}></Icon> <span>   icon-collapseAll</span></div>
                <div> <Icon iconName={'icon-Column_chooser'}></Icon> <span>   icon-Column_chooser</span></div>
                <div> <Icon iconName={'icon-compare'}></Icon> <span>   icon-compare</span></div>
                <div> <Icon iconName={'icon-curentjobs'}></Icon> <span>   icon-curentjobs</span></div>
                <div> <Icon iconName={'icon-custom_pack'}></Icon> <span>   icon-custom_pack</span></div>
                <div> <Icon iconName={'icon-dashboard1'}></Icon> <span>   icon-dashboard1</span></div>
                <div> <Icon iconName={'icon-dashboard2'}></Icon> <span>   icon-dashboard2</span></div>
                <div> <Icon iconName={'icon-delete'}></Icon> <span>   icon-delete</span></div>
                <div> <Icon iconName={'icon-details'}></Icon> <span>   icon-details</span></div>
                <div> <Icon iconName={'icon-disabledUser'}></Icon> <span>   icon-disabledUser</span></div>
                <div> <Icon iconName={'icon-document'}></Icon> <span>   icon-document</span></div>
                <div> <Icon iconName={'icon-docx'}></Icon> <span>   icon-docx</span></div>
                <div> <Icon iconName={'icon-edit'}></Icon> <span>   icon-edit</span></div>
                <div> <Icon iconName={'icon-edit_email'}></Icon> <span>   icon-edit_email</span></div>
                <div> <Icon iconName={'icon-edit_phone'}></Icon> <span>   icon-edit_phone</span></div>
                <div> <Icon iconName={'icon-equal'}></Icon> <span>   icon-equal</span></div>
                <div> <Icon iconName={'icon-error'}></Icon> <span>   icon-error</span></div>
                <div> <Icon iconName={'icon-excel'}></Icon> <span>   icon-excel</span></div>
                <div> <Icon iconName={'icon-Exchange'}></Icon> <span>   icon-Exchange</span></div>
                <div> <Icon iconName={'icon-expand_collapse'}></Icon> <span>   icon-expand_collapse</span></div>
                <div> <Icon iconName={'icon-expandAll'}></Icon> <span>   icon-expandAll</span></div>
                <div> <Icon iconName={'icon-export'}></Icon> <span>   icon-export</span></div>
                <div> <Icon iconName={'icon-feedback'}></Icon> <span>   icon-feedback</span></div>
                <div> <Icon iconName={'icon-filter'}></Icon> <span>   icon-filter</span></div>
                <div> <Icon iconName={'icon-flag'}></Icon> <span>   icon-flag</span></div>
                <div> <Icon iconName={'icon-folder'}></Icon> <span>   icon-folder</span></div>
                <div> <Icon iconName={'icon-full_size'}></Icon> <span>   icon-full_size</span></div>
                <div> <Icon iconName={'icon-gen_word'}></Icon> <span>   icon-gen_word</span></div>
                <div> <Icon iconName={'icon-gen_word1'}></Icon> <span>   icon-gen_word1</span></div>
                <div> <Icon iconName={'icon-generate'}></Icon> <span>   icon-generate</span></div>
                <div> <Icon iconName={'icon-ghost'}></Icon> <span>   icon-ghost</span></div>
                <div> <Icon iconName={'icon-group'}></Icon> <span>   icon-group</span></div>
                <div> <Icon iconName={'icon-help'}></Icon> <span>   icon-help</span></div>
                <div> <Icon iconName={'icon-history'}></Icon> <span>   icon-history</span></div>
                <div> <Icon iconName={'icon-hitory_back'}></Icon> <span>   icon-hitory_back</span></div>
                <div> <Icon iconName={'icon-home'}></Icon> <span>   icon-home</span></div>
                <div> <Icon iconName={'icon-in_progress'}></Icon> <span>   icon-in_progress</span></div>
                <div> <Icon iconName={'icon-Info_krug'}></Icon> <span>   icon-Info_krug</span></div>
                <div> <Icon iconName={'icon-inProgress'}></Icon> <span>   icon-inProgress</span></div>
                <div> <Icon iconName={'icon-internalLink'}></Icon> <span>   icon-internalLink</span></div>
                <div> <Icon iconName={'icon-item'}></Icon> <span>   icon-item</span></div>
                <div> <Icon iconName={'icon-key'}></Icon> <span>   icon-key</span></div>
                <div> <Icon iconName={'icon-link'}></Icon> <span>   icon-link</span></div>
                <div> <Icon iconName={'icon-list'}></Icon> <span>   icon-list</span></div>
                <div> <Icon iconName={'icon-load'}></Icon> <span>   icon-load</span></div>
                <div> <Icon iconName={'icon-load_info'}></Icon> <span>   icon-load_info</span></div>
                <div> <Icon iconName={'icon-load_job_tasks'}></Icon> <span>   icon-load_job_tasks</span></div>
                <div> <Icon iconName={'icon-load_witherrors'}></Icon> <span>   icon-load_witherrors</span></div>
                <div> <Icon iconName={'icon-load_witherrors1'}></Icon> <span>   icon-load_witherrors1</span></div>
                <div> <Icon iconName={'icon-logo'}></Icon> <span>   icon-logo</span></div>
                <div> <Icon iconName={'icon-logo_partner'}></Icon> <span>   icon-logo_partner</span></div>
                <div> <Icon iconName={'icon-logo_partner2'}></Icon> <span>   icon-logo_partner2</span></div>
                <div> <Icon iconName={'icon-logOut'}></Icon> <span>   icon-logOut</span></div>
                <div> <Icon iconName={'icon-MyAccount'}></Icon> <span>   icon-MyAccount</span></div>
                <div> <Icon iconName={'icon-news'}></Icon> <span>   icon-news</span></div>
                <div> <Icon iconName={'icon-normal_size'}></Icon> <span>   icon-normal_size</span></div>
                <div> <Icon iconName={'icon-office'}></Icon> <span>   icon-office</span></div>
                <div> <Icon iconName={'icon-office_manage'}></Icon> <span>   icon-office_manage</span></div>
                <div> <Icon iconName={'icon-Office365'}></Icon> <span>   icon-Office365</span></div>
                <div> <Icon iconName={'icon-open'}></Icon> <span>   icon-open</span></div>
                <div> <Icon iconName={'icon-pdf'}></Icon> <span>   icon-pdf</span></div>
                <div> <Icon iconName={'icon-pending'}></Icon> <span>   icon-pending</span></div>
                <div> <Icon iconName={'icon-permission_date'}></Icon> <span>   icon-permission_date</span></div>
                <div> <Icon iconName={'icon-permission_level'}></Icon> <span>   icon-permission_level</span></div>
                <div> <Icon iconName={'icon-permission_level2'}></Icon> <span>   icon-permission_level2</span></div>
                <div> <Icon iconName={'icon-phone'}></Icon> <span>   icon-phone</span></div>
                <div> <Icon iconName={'icon-power'}></Icon> <span>   icon-power</span></div>
                <div> <Icon iconName={'icon-premium_subs'}></Icon> <span>   icon-premium_subs</span></div>
                <div> <Icon iconName={'icon-principal_status'}></Icon> <span>   icon-principal_status</span></div>
                <div> <Icon iconName={'icon-principal_type'}></Icon> <span>   icon-principal_type</span></div>
                <div> <Icon iconName={'icon-print'}></Icon> <span>   icon-print</span></div>
                <div> <Icon iconName={'icon-que'}></Icon> <span>   icon-que</span></div>
                <div> <Icon iconName={'icon-Quote'}></Icon> <span>   icon-Quote</span></div>
                <div> <Icon iconName={'icon-Quote2'}></Icon> <span>   icon-Quote2</span></div>
                <div> <Icon iconName={'icon-Quote22'}></Icon> <span>   icon-Quote22</span></div>
                <div> <Icon iconName={'icon-recent_jobs'}></Icon> <span>   icon-recent_jobs</span></div>
                <div> <Icon iconName={'icon-refresh'}></Icon> <span>   icon-refresh</span></div>
                <div> <Icon iconName={'icon-reload'}></Icon> <span>   icon-reload</span></div>
                <div> <Icon iconName={'icon-reset'}></Icon> <span>   icon-reset</span></div>
                <div> <Icon iconName={'icon-reset_jobs'}></Icon> <span>   icon-reset_jobs</span></div>
                <div> <Icon iconName={'icon-save'}></Icon> <span>   icon-save</span></div>
                <div> <Icon iconName={'icon-schedule'}></Icon> <span>   icon-schedule</span></div>
                <div> <Icon iconName={'icon-search'}></Icon> <span>   icon-search</span></div>
                <div> <Icon iconName={'icon-security_group'}></Icon> <span>   icon-security_group</span></div>
                <div> <Icon iconName={'icon-settings'}></Icon> <span>   icon-settings</span></div>
                <div> <Icon iconName={'icon-shared_folder'}></Icon> <span>   icon-shared_folder</span></div>
                <div> <Icon iconName={'icon-SharePoint'}></Icon> <span>   icon-SharePoint</span></div>
                <div> <Icon iconName={'icon-site'}></Icon> <span>   icon-site</span></div>
                <div> <Icon iconName={'icon-site_collection'}></Icon> <span>   icon-site_collection</span></div>
                <div> <Icon iconName={'icon-site2'}></Icon> <span>   icon-site2</span></div>
                <div> <Icon iconName={'icon-Snapshot'}></Icon> <span>   icon-Snapshot</span></div>
                <div> <Icon iconName={'icon-SP_report'}></Icon> <span>   icon-SP_report</span></div>
                <div> <Icon iconName={'icon-starter-subs'}></Icon> <span>   icon-starter-subs</span></div>
                <div> <Icon iconName={'icon-subscription'}></Icon> <span>   icon-subscription</span></div>
                <div> <Icon iconName={'icon-subsite'}></Icon> <span>   icon-subsite</span></div>
                <div> <Icon iconName={'icon-summary'}></Icon> <span>   icon-summary</span></div>
                <div> <Icon iconName={'icon-superAdmin'}></Icon> <span>   icon-superAdmin</span></div>
                <div> <Icon iconName={'icon-switchView'}></Icon> <span>   icon-switchView</span></div>
                <div> <Icon iconName={'icon-TakeSnapshot'}></Icon> <span>   icon-TakeSnapshot</span></div>
                <div> <Icon iconName={'icon-trash'}></Icon> <span>   icon-trash</span></div>
                <div> <Icon iconName={'icon-user'}></Icon> <span>   icon-user</span></div>
                <div> <Icon iconName={'icon-user_management'}></Icon> <span>   icon-user_management</span></div>
                <div> <Icon iconName={'icon-Users_quote'}></Icon> <span>   icon-Users_quote</span></div>
                <div> <Icon iconName={'icon-warning2'}></Icon> <span>   icon-warning2</span></div>
                <div> <Icon iconName={'icon-verson_update'}></Icon> <span>   icon-verson_update</span></div>
                <div> <Icon iconName={'icon-warning'}></Icon> <span>   icon-warning</span></div>
                <div> <Icon iconName={'icon-world'}></Icon> <span>   icon-world</span></div>
                {symbols.map(i => {
                    let iconName = i.id.substring(i.id.indexOf('_') + 1); 
                    return <div> <Icon iconName={iconName} width={'16px'} height={'16px'}></Icon> <span>   {iconName}</span></div>;
                })}
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
