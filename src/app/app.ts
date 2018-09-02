import * as express from 'express';
import * as expressJwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';

import { AuthService } from './auth/auth.service';

const app = express();

app.use(
  expressJwt({
    ...AuthService.jwtVerifyOptions,
    ...{ credentialsRequired: false, secret: jwksRsa.expressJwtSecret(AuthService.jwksRsaOptions) }
  })
);

export default app;
