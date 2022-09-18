import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express';
import { createServer } from 'http';
import { ParseServer } from 'parse-server';
// @ts-ignore
import Config from './../../node_modules/parse-server/lib/Config.js';

// import Parse from "parse/node";

//Initialize Parse
// Parse.initialize("ParseTest", "", "TEST_KEY");
// @ts-ignore
// Parse.serverURL = "http://localhost:1337";

const RelatedSchema: Parse.RestSchema = {
  className: 'Related',
  fields: {
    users: { type: 'Relation', targetClass: '_User' },
    user: { type: 'Pointer', targetClass: '_User', required: false },
  },
  classLevelPermissions: {
    find: { requiresAuthentication: true },
    count: { requiresAuthentication: true },
    get: { requiresAuthentication: true },
    update: {},
    create: {},
    delete: {},
    protectedFields: {
      '*': ['users'],
    },
  },
};

const api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/test',
  cloud: './build/src/cloud/main.js',
  appId: 'ParseTest',
  masterKey: 'test',
  allowClientClassCreation: false,
  preventLoginWithUnverifiedEmail: true,
  enforcePrivateUsers: true,
  directAccess: true,
  schema: {
    definitions: [RelatedSchema],
    recreateModifiedFields: true,
    deleteExtraFields: true,
  },
});

const app = express();

/**
 * If the request includes an "Authorization" header, then validate the access token against Azure AD B2C.
 * If the header is not included, then use normal Parse authentication and authorization methods.
 *
 * @param {*} req HTTP request object
 * @param {*} res HTTP response to be send
 * @param {*} next Call next middleware function
 * @returns
 */
const authenticateIfNeeded = async (
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const parseUser = new Parse.User();
    parseUser.id = 'mrgJjOGwfi'; // replace with your User ID
    /**
     * enables parse user from JWT
     * https://github.com/parse-community/parse-server/issues/6390
     * https://github.com/parse-community/docs/pull/819/files
     */
    await parseUser.fetch({ useMasterKey: true });
    console.log(parseUser.toJSON());
    req['userFromJWT'] = parseUser;
  }
  return next();
};

// Serve the Parse API at /parse URL prefix
app.use('/parse', authenticateIfNeeded, api);

app.use(
  express.urlencoded({
    extended: true,
  })
);

const { exec } = require('child_process');
app.use(express.json());
const port = 1337;
const httpServer = createServer(app);
httpServer.listen(port, async function () {
  console.log('parse-server-example running on port ' + port + '.');
  try {
    const config = Config.get('ParseTest');
    const parseUser = new Parse.User();
    parseUser.id = 'mrgJjOGwfi';
    await config.database.create('_User', {
      className: '_User',
      objectId: 'mrgJjOGwfi',
      firstName: 'mockUser',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const related = new Parse.Object('Related');
    const relation = related.relation('users');
    relation.add(parseUser);
    await related.save(null, { useMasterKey: true });
    setTimeout(() => {
      exec('npm run relation');
    }, 3000);
  } catch (e) {
    console.log(e);
  }
});
process.on('SIGINT', async function () {
  const config = Config.get('ParseTest');
  await config.database.deleteEverything(true);
  process.exit(0);
});
