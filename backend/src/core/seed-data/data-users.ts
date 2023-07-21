import { USER_TYPE } from "src/common/enums/user-type";
import { CreateUserInput } from 'src/domain/dtos/auth/register/register.input';

export const users: CreateUserInput[] = [
    {
        email: 'fernanda.mkt.rv@gmail.com',
        first_name: 'Fernanda',
        last_name: 'Rivera',
        image_url: 'https://avatars.githubusercontent.com/u/181381?v=4',
        password: 'fernanda.rivera',
        tenant_id: null,
        type: USER_TYPE.PORTAL_ROOT,
        user_id: 'FERNANDA',
        roles: [],
    },
    {
        email: 'nanetadrianamv@gmail.com',
        first_name: 'Nanet',
        last_name: 'Villalobos',
        image_url: 'https://avatars.githubusercontent.com/u/181381?v=4',
        password: 'nanet.villalobos',
        tenant_id: null,
        type: USER_TYPE.PORTAL_ROOT,
        user_id: 'NANET',
        roles: [],
    },
    {
        email: 'davidramos015@gmail.com',
        first_name: 'David',
        last_name: 'Ramos',
        image_url: 'https://avatars.githubusercontent.com/u/181381?v=4',
        password: 'davidramos',
        tenant_id: null,
        type: USER_TYPE.PORTAL_ROOT,
        user_id: 'DAVID',
        roles: [],
    }
]