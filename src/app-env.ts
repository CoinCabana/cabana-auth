require('dotenv').config();

class AppEnv {
    SERVER_URL: string;

    MEMBER_ADDRESS: string;
    MEMBER_PRIVATE_KEY: string;
    PROJECT_OWNER_ADDRESS: string;
    PROJECT_OWNER_PRIVATE_KEY: string;
}

export const appEnv:AppEnv = Object.assign(new AppEnv(), process.env);
