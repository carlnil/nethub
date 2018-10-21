### Lab 2 for DD1368 Database Technology at KTH Royal Institute of Technology

To start, navigate to client directory at /client and execute the following command.

```
npm run start
```

Do the same in the server directory at /server.

Follow steps below to load database.

Open a command prompt or terminal in the project server folder and login to PostgreSQL. 

Create the database.

```SQL
CREATE DATABASE nethub;
```

Then, load data.

```
\c nethub;
\i database.psql;
\i values.psql;
```

