import { Mailman, MailMessage } from "@squareboat/nest-mailman";
import { Field, InputType } from '@nestjs/graphql'
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsString, ValidateIf } from "class-validator";

@InputType()
export class StandarEmailActionInput {

    @Field({ nullable: false })
    text: string;

    @Field({ nullable: false })
    link: string;
}


@InputType()
export class StandarEmailInput {

    @IsEmail()
    @Field({ nullable: false })
    to: string;

    @IsString()
    @Field({ nullable: true })
    greeting: string;

    @IsString()
    @Field({ nullable: false })
    subject: string;

    @Type(() => StandarEmailActionInput)
    @Field(() => StandarEmailActionInput, { nullable: true })
    @ValidateIf(o => o.button)
    button: StandarEmailActionInput;

    @Field(() => [ String ], { nullable: true })
    @IsArray()
    lines: string[];
}

export class StandarEmail {

    private greeting: string;
    private subject: string;
    private lines: string[];
    private action: { text: string; link: string; };

    toMail(): MailMessage {

        const mail = MailMessage.init();

        this.greeting && mail.greeting(this.greeting);
        this.lines && this.lines.forEach(line => mail.line(line));

        this.action && mail.action(this.action.text, this.action.link);
        this.subject && mail.subject(this.subject);

        return mail;
    }

    async sendMail({ to, greeting, subject, lines, button }: StandarEmailInput) {

        try {

            this.greeting = greeting;
            this.subject = subject;
            this.lines = lines;
            this.action = button;

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
