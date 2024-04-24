import { IConfig } from './config.interface';

export default (): IConfig => ({
  port: parseInt(process.env.PORT || '3000'),
  db_url: process.env.DATABASE_URL,
});
