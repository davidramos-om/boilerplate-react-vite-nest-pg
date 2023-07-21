import { useLayoutEffect } from "react";
import { useMutation } from '@apollo/client';
import { MARK_AS_READ } from './gql';

export function MarkAsRead({ id, status }: { id: string; status: string; }) {

    const [ markAsRead ] = useMutation(MARK_AS_READ);

    useLayoutEffect(() => {

        if (status !== 'UNREAD')
            return;

        markAsRead({ variables: { id } });
    }, [ id, status, markAsRead ]);

    return null;
}
