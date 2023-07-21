import { Virtuoso } from 'react-virtuoso'

import AlertMessage from "src/components/AlertMessage";
import PermissionItem from "./permission-item";
import { usePermissions } from './hooks'

export default function PermissionList() {

    const { error, virtuosoData } = usePermissions();

    if (error) {
        return (
            <AlertMessage type="error" message={error.message} multiline />
        )
    }

    return (
        <div>
            <Virtuoso
                style={{ height: 400, padding: '1rem' }}
                data={virtuosoData}
                components={{
                    Footer: () => (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                            Fin de la lista
                        </div>
                    ),
                }}
                itemContent={(index, item) => (
                    < PermissionItem key={item.resource} item={item} />
                )}
            />
        </div>
    );
}