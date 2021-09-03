---
title: Postgres
permalink: /config/databases/postgres
---

## Prerequisites

- The hostname for the [Postgres][postgres] database server
- The username/password for the [Postgres][postgres] database server
- The name of the database to use within the [Postgres][postgres] database
  server

## Setup

### <--{"id" : "Setup"}-->  Manual

Add the following to a `.env` file in your Cube.js project:

```bash
CUBEJS_DB_TYPE=postgres
CUBEJS_DB_HOST=my.postgres.host
CUBEJS_DB_NAME=my_postgres_database
CUBEJS_DB_USER=postgres_user
CUBEJS_DB_PASS=**********
```

## Environment Variables

| Environment Variable | Description                                                             | Possible Values           | Required |
| -------------------- | ----------------------------------------------------------------------- | ------------------------- | :------: |
| `CUBEJS_DB_HOST`     | The host URL for a database                                             | A valid database host URL |    ✅    |
| `CUBEJS_DB_PORT`     | The port for the database connection                                    | A valid port number       |    ❌    |
| `CUBEJS_DB_NAME`     | The name of the database to connect to                                  | A valid database name     |    ✅    |
| `CUBEJS_DB_USER`     | The username used to connect to the database                            | A valid database username |    ✅    |
| `CUBEJS_DB_PASS`     | The password used to connect to the database                            | A valid database password |    ✅    |
| `CUBEJS_DB_SSL`      | If `true`, enables SSL encryption for database connections from Cube.js | `true`, `false`           |    ❌    |

## SSL

To enable SSL-encrypted connections between Cube.js and Postgres, set the
`CUBEJS_DB_SSL` environment variable to `true`. For more information on how to
configure custom certificates, please check out [Enable SSL Connections to the
Database][ref-recipe-enable-ssl].

## Additional Configuration

### <--{"id" : "Additional Configuration"}-->  AWS RDS

Use `CUBEJS_DB_SSL=true` to enable SSL if you have SSL enabled for your RDS
cluster. Download the new certificate [here][aws-rds-pem], and provide the
contents of the downloaded file to `CUBEJS_DB_SSL_CA`. All other SSL-related
environment variables can be left unset. See [the SSL section][self-ssl] for
more details. More info on AWS RDS SSL can be found [here][aws-docs-rds-ssl].

### <--{"id" : "Additional Configuration"}-->  Google Cloud SQL

You can connect to an SSL-enabled MySQL database by setting `CUBEJS_DB_SSL` to
`true`. You may also need to set `CUBEJS_DB_SSL_SERVERNAME`, depending on how
you are [connecting to Cloud SQL][gcp-docs-sql-connect].

### <--{"id" : "Additional Configuration"}-->  Heroku

Unless you're using a Private or Shield Heroku Postgres database, Heroku
Postgres does not currently support verifiable certificates. [Here is the
description of the issue from Heroku][heroku-postgres-issue].

As a workaround, you can set `rejectUnauthorized` option to `false` in the
Cube.js Postgres driver:

```js
const PostgresDriver = require('@cubejs-backend/postgres-driver');
module.exports = {
  driverFactory: () =>
    new PostgresDriver({
      ssl: {
        rejectUnauthorized: false,
      },
    }),
};
```

[aws-docs-rds-ssl]:
  https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html
[aws-rds-pem]: https://s3.amazonaws.com/rds-downloads/rds-ca-2019-root.pem
[gcp-docs-sql-connect]:
  https://cloud.google.com/sql/docs/postgres/connect-functions#connecting_to
[heroku-postgres-issue]:
  https://help.heroku.com/3DELT3RK/why-can-t-my-third-party-utility-connect-to-heroku-postgres-with-ssl
[postgres]: https://www.postgresql.org/
[self-ssl]: #ssl
[ref-recipe-enable-ssl]: /recipes/enable-ssl-connections-to-database