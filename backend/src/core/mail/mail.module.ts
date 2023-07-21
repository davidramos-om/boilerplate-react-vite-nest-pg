import { Module, Global } from '@nestjs/common';

import { MailResolver } from './mail.resolver';
import { MailService } from './mail.service';

@Global()
@Module({
    imports: [],
    providers: [ MailResolver, MailService ],
    exports: [ MailService ]
})
export class MailModule { }
