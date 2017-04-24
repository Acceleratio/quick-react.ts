import { ITiledDashboardFarm } from '../TileDashboard/TileDashboard.Props';

export interface ITileGroupProps {
    farm: ITiledDashboardFarm;
    filter?: string;  
    groupOnClick?: (groupId: any) => void;
    serverOnClick?: (groupId: any, serverId: any) => void;
}
