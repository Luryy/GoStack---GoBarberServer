import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    email: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({ name: 'avatar_url' })
    getAvatarUrl(): string | null {
        if (!this.avatar) return null;
        // switch (storageConfig.driver) {
        //     case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
        // case 's3':
        //     return `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${this.avatar}`;
        // default:
        //     return null;
        // }
    }
}

export default User;
