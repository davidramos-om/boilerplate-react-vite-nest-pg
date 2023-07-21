import { Mailman, MailMessage } from "@squareboat/nest-mailman";
import { IsArray, IsBoolean, IsEmail, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

import { ComposeMail } from "../compose-mail.interface";
import { Type } from "class-transformer";

@InputType()
export class TenantDataUpdatedItemInput {

    @Field({ nullable: false })
    attribute: string;

    @Field({ nullable: false })
    old: string;

    @Field({ nullable: false })
    new: string;
}

@InputType()
export class TenantDataUpdatedInput {

    @IsEmail()
    @Field({ nullable: false })
    to: string;

    @Field({ nullable: false })
    @IsBoolean()
    urlChanged: boolean

    @Field({ nullable: false })
    @IsString()
    name: string;

    @Field({ nullable: false })
    @IsString()
    loginLink: string;

    @Type(() => TenantDataUpdatedItemInput)
    @Field(() => [ TenantDataUpdatedItemInput ], { nullable: false, defaultValue: [] })
    @IsArray()
    changes: TenantDataUpdatedItemInput[];
}

export class TenantDataUpdated implements ComposeMail {

    private name: string;
    private loginLink: string;
    private urlChanged: boolean;
    private changes: TenantDataUpdatedItemInput[];

    toMail(): MailMessage {

        const mail = MailMessage.init()
            .subject("Información de la empresa actualizada")
            .greeting(`Hola ${this.name}`)
            .line(`Te comunicamos que la información de tu empresa ha sido actualizada.`)
            .line(`Los datos actualizados son:`)

        let tableRows: { Atributo: string, Antes: string, Nuevo: string }[] = [];
        this.changes.forEach(change => { tableRows.push({ Atributo: change.attribute, Antes: change.old, Nuevo: change.new }); });

        mail.table(tableRows);

        if (this.urlChanged) {
            mail.line("Los cambios en el código de la empresa generan cambios en la URL de acceso a la plataforma, por lo que te recomendamos que compartas el nuevo código con tus colaboradores.")
                .action("Acceder a la plataforma", this.loginLink)
        }

        mail.line("")
        mail.line(`Si tienes alguna duda, puedes contactarnos a través de nuestro correo de soporte`);

        return mail;
    }

    async sendMail({ name, changes, to, loginLink, urlChanged }: TenantDataUpdatedInput) {

        try {
            this.name = name;
            this.changes = changes;
            this.loginLink = loginLink;
            this.urlChanged = urlChanged;

            const mm = Mailman.init();
            mm.to(to);

            await mm.send(this.toMail());
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
