import { IPrincipal } from '../../src/components/PeoplePicker/Principal.Props';

export const peoplePickerData: IPrincipal[] = [
    { identifier: '1', displayName: 'FirstName1 LastName1 loooong loooong looooong', email: 'username1@domain1', displayIdentifier: 'domain1\\username', type: 1 },
    { identifier: '2', displayName: 'FirstName2 LastName2', email: 'username2@domain2', displayIdentifier: 'username2@domain2', type: 2 },
    { identifier: '3', displayName: 'FirstName3 LastName3', email: 'username3@domain3', type: 3 },
    { identifier: '4', displayName: 'FirstName4 LastName4', email: 'username4@domain4', type: 4 },
    { identifier: '5', displayName: 'FirstName5 LastName5', email: 'username5@domain5', type: 1 }
];
