import IParseTemplateMailDTO from '@shared/containers/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContent {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    to: IMailContent;
    from?: IMailContent;
    subject: string;
    templateData: IParseTemplateMailDTO;
}
